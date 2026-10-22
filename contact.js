// Cloudflare Pages Function: POST /api/contact
// Checks Cloudflare Turnstile, validates the fields, then forwards to Web3Forms.
// Secrets live in Pages > Settings > Variables and Secrets (never in the repo):
//   TURNSTILE_SECRET  - the Turnstile *secret* key
//   WEB3FORMS_KEY     - your Web3Forms access key

const MAX_BODY_BYTES = 20000;

const FORMS = {
  contact: {
    subject: 'New Project Enquiry — Audi LXD Portfolio',
    limits: { name: 100, email: 254, project_type: 100, timeline: 100, message: 3000 },
    required: ['name', 'email', 'project_type', 'message'],
  },
  project: {
    subject: 'New Project Brief — Audi LXD Portfolio',
    limits: { name: 100, email: 254, problem: 1000, audience: 300, timeline: 100, extras: 3000, solutions: 500, budget: 100 },
    required: ['name', 'email', 'problem', 'audience'],
  },
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

// Strip control characters (keeps newlines and tabs) and trim.
function clean(value) {
  return String(value).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim();
}

export async function onRequestPost({ request, env }) {
  if (!env.TURNSTILE_SECRET || !env.WEB3FORMS_KEY) {
    console.error('Missing TURNSTILE_SECRET or WEB3FORMS_KEY environment variable');
    return json({ success: false, message: 'Server not configured.' }, 500);
  }

  // Only accept requests that come from this same site.
  const origin = request.headers.get('Origin');
  if (!origin || origin !== new URL(request.url).origin) {
    return json({ success: false, message: 'Forbidden.' }, 403);
  }

  if (!(request.headers.get('Content-Type') || '').includes('application/json')) {
    return json({ success: false, message: 'Unsupported request.' }, 415);
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return json({ success: false, message: 'Request too large.' }, 413);
  }

  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    return json({ success: false, message: 'Invalid request.' }, 400);
  }
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return json({ success: false, message: 'Invalid request.' }, 400);
  }

  const cfg = FORMS[data.form];
  if (!cfg) {
    return json({ success: false, message: 'Invalid request.' }, 400);
  }

  // Honeypot: pretend it worked so bots do not learn anything.
  if (data.botcheck === true || data.botcheck === 'on' || data.botcheck === 'true') {
    return json({ success: true });
  }

  // Keep only the fields this form is allowed to send, and check lengths.
  const fields = {};
  for (const [key, max] of Object.entries(cfg.limits)) {
    if (data[key] === undefined || data[key] === null) continue;
    if (typeof data[key] !== 'string') {
      return json({ success: false, message: 'Invalid request.' }, 400);
    }
    const value = clean(data[key]);
    if (value.length > max) {
      return json({ success: false, message: 'One of your answers is too long.' }, 400);
    }
    if (value) fields[key] = value;
  }
  for (const key of cfg.required) {
    if (!fields[key]) {
      return json({ success: false, message: 'Please fill in all required fields.' }, 400);
    }
  }
  if (!EMAIL_RE.test(fields.email)) {
    return json({ success: false, message: 'Please enter a valid email address.' }, 400);
  }

  // Verify the Turnstile token with Cloudflare.
  const token = typeof data['cf-turnstile-response'] === 'string' ? data['cf-turnstile-response'] : '';
  if (!token || token.length > 2048) {
    return json({ success: false, message: 'Please complete the security check.' }, 400);
  }
  const verifyBody = new URLSearchParams({
    secret: env.TURNSTILE_SECRET,
    response: token,
  });
  const ip = request.headers.get('CF-Connecting-IP');
  if (ip) verifyBody.set('remoteip', ip);

  let verified = false;
  try {
    const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: verifyBody,
    });
    const verifyJson = await verifyRes.json();
    verified = verifyJson.success === true;
    if (!verified) console.error('Turnstile rejected token', JSON.stringify(verifyJson['error-codes'] || []));
  } catch (err) {
    console.error('Turnstile verification failed', err);
    return json({ success: false, message: 'Could not verify the security check. Try again.' }, 502);
  }
  if (!verified) {
    return json({ success: false, message: 'Security check failed. Please refresh and try again.' }, 400);
  }

  // Forward to Web3Forms. Subject and sender name are set here, not by the browser.
  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: env.WEB3FORMS_KEY,
        subject: cfg.subject,
        from_name: 'Audi LXD Portfolio',
        ...fields,
      }),
    });
    const text = await res.text();
    let out = null;
    try { out = JSON.parse(text); } catch { /* not JSON */ }
    if (!res.ok || !out || out.success !== true) {
      console.error('Web3Forms error', res.status, text.slice(0, 300));
      return json({ success: false, message: 'Could not send your message. Please try again.' }, 502);
    }
  } catch (err) {
    console.error('Web3Forms request failed', err);
    return json({ success: false, message: 'Could not send your message. Please try again.' }, 502);
  }

  return json({ success: true });
}

// Anything other than POST
export async function onRequest() {
  return json({ success: false, message: 'Method not allowed.' }, 405);
}

// ── Cloudflare Turnstile: explicit render so we keep the widget ID ──
let turnstileWidgetId = null;

function renderTurnstile() {
  if (turnstileWidgetId !== null) return;
  if (!window.turnstile) { setTimeout(renderTurnstile, 100); return; }
  if (turnstileWidgetId !== null) return;
  turnstileWidgetId = window.turnstile.render('#turnstile-contact', {
    sitekey: '0x4AAAAAAFhjmg__C_eEDgM1',
    action: 'contact',
    theme: 'dark'
  });
}

function getTurnstileToken() {
  return (window.turnstile && turnstileWidgetId !== null)
    ? (window.turnstile.getResponse(turnstileWidgetId) || '')
    : '';
}

// Tokens are single-use: always reset the widget after an attempt that stays on the page.
function resetTurnstile() {
  if (window.turnstile && turnstileWidgetId !== null) window.turnstile.reset(turnstileWidgetId);
}

renderTurnstile();

    // ── Email reveal — hides from bots ──
    function revealEmail() {
      const parts = ['chaslwanda', '@', 'gmail', '.com'];
      const email = parts.join('');
      document.getElementById('reveal-email-btn').style.display = 'none';
      const link = document.getElementById('email-link');
      link.href = 'mailto:' + email;
      link.textContent = email;
      document.getElementById('email-revealed').style.display = 'block';
    }

    // ── Form submit: goes to our own /api/contact function (checks Turnstile, then sends) ──
document.getElementById('contact-form').addEventListener('submit', async function (e) {
  e.preventDefault();
  const btn = document.getElementById('submit-btn');
  const originalText = btn.textContent;
  const object = Object.fromEntries(new FormData(this));
  const token = getTurnstileToken();

  if (!token) {
    btn.textContent = 'Please complete the security check';
    setTimeout(function () { btn.textContent = originalText; }, 2500);
    return;
  }

  btn.textContent = 'Sending...';
  btn.disabled = true;
  object.form = 'contact';
  object['cf-turnstile-response'] = token;

  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(object)
    });
    const result = await response.json();

    if (result.success) {
      const overlay = document.getElementById('success-overlay');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    } else {
      btn.textContent = 'Something went wrong. Try again.';
      btn.disabled = false;
      resetTurnstile();
    }
  } catch (error) {
    btn.textContent = 'Network error. Try again.';
    btn.disabled = false;
    resetTurnstile();
  }
});

document.getElementById('reveal-email-btn').addEventListener('click', revealEmail);

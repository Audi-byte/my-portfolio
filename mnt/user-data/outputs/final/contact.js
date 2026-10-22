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

  if (!object['cf-turnstile-response']) {
    btn.textContent = 'Please complete the security check';
    setTimeout(function () { btn.textContent = originalText; }, 2500);
    return;
  }

  btn.textContent = 'Sending...';
  btn.disabled = true;
  object.form = 'contact';

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
      if (window.turnstile) window.turnstile.reset();
    }
  } catch (error) {
    btn.textContent = 'Network error. Try again.';
    btn.disabled = false;
    if (window.turnstile) window.turnstile.reset();
  }
});

document.getElementById('reveal-email-btn').addEventListener('click', revealEmail);

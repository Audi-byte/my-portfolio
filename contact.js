// hCaptcha is loaded by the Web3Forms client script. Tokens are single-use,
// so reset the widget after any failed attempt that stays on the page.
function resetCaptcha() {
  try { if (window.hcaptcha) window.hcaptcha.reset(); } catch (e) { /* ignore */ }
}

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

    // ── Form submit: sent to Web3Forms together with the hCaptcha token ──
document.getElementById('contact-form').addEventListener('submit', async function (e) {
  e.preventDefault();
  const btn = document.getElementById('submit-btn');
  const originalText = btn.textContent;
  const object = Object.fromEntries(new FormData(this));
  delete object['g-recaptcha-response']; // hCaptcha adds an unused duplicate field

  if (!object['h-captcha-response']) {
    btn.textContent = 'Please complete the security check';
    setTimeout(function () { btn.textContent = originalText; }, 2500);
    return;
  }

  btn.textContent = 'Sending...';
  btn.disabled = true;

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
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
      resetCaptcha();
    }
  } catch (error) {
    btn.textContent = 'Network error. Try again.';
    btn.disabled = false;
    resetCaptcha();
  }
});

document.getElementById('reveal-email-btn').addEventListener('click', revealEmail);

// Invisible spam check: real visitors need a few seconds to fill in the form, bots do not.
// Combined with the hidden honeypot field and Web3Forms' own server-side spam filter.
const pageLoadedAt = Date.now();
const MIN_FILL_MS = 4000;

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

    // ── Form submit: sent to Web3Forms ──
document.getElementById('contact-form').addEventListener('submit', async function (e) {
  e.preventDefault();
  const btn = document.getElementById('submit-btn');
  const originalText = btn.textContent;
  const object = Object.fromEntries(new FormData(this));

  if (Date.now() - pageLoadedAt < MIN_FILL_MS) {
    // Too fast to be a person (or autofill + instant click). Ask them to try again; nothing is lost.
    btn.textContent = 'Please check your message and press send again';
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
    }
  } catch (error) {
    btn.textContent = 'Network error. Try again.';
    btn.disabled = false;
  }
});

document.getElementById('reveal-email-btn').addEventListener('click', revealEmail);

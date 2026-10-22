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

    // ── Form submit ──
    document.getElementById('contact-form').addEventListener('submit', async function(e) {
      e.preventDefault();
      const btn = document.getElementById('submit-btn');
      btn.textContent = 'Sending...';
      btn.disabled = true;

      const formData = new FormData(this);
      const object = Object.fromEntries(formData);

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(object)
        });

        const result = await response.json();

        if (result.success) {
          // Show full-screen overlay
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

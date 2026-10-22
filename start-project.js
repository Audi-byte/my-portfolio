    let currentStep = 1;

    const nudges = {
      1: ["Psst — just two quick fields! What's the problem and who's the audience? That's it for Step 1. 🙌", "Almost there! Two fields won't bite — fill them in and let's get moving. 😄", "Don't leave me hanging! Tell me the problem — I promise I won't judge. 📝"],
      2: ["Pick at least one — even 'Not Sure Yet' counts! I won't make you commit. 😊", "One click is all it takes for Step 2. Which solution sounds right to you? 🎯", "No pressure — 'Help Me Decide' is a perfectly valid answer. Just pick one! ✅"]
    };

    function showNudge(step) {
      const msgs = nudges[step];
      const msg = msgs[Math.floor(Math.random() * msgs.length)];
      const toast = document.getElementById('nudge-toast');
      toast.textContent = msg;
      toast.classList.add('show');
      setTimeout(() => { toast.classList.remove('show'); }, 3500);
    }

    function validateStep1() {
      const problem = document.getElementById('problem').value.trim();
      const audience = document.getElementById('audience').value.trim();
      if (!problem || !audience) {
        showNudge(1);
        if (!problem) document.getElementById('problem').focus();
        else document.getElementById('audience').focus();
        return;
      }
      goTo(2);
    }

    function validateStep2() {
      const checked = document.querySelectorAll('input[name="solution"]:checked');
      if (checked.length === 0) {
        showNudge(2);
        return;
      }
      goTo(3);
    }

    function goTo(step) {
      document.getElementById('panel-' + currentStep).classList.remove('active');
      document.querySelector('.step-item[data-step="' + currentStep + '"]').classList.remove('active');
      currentStep = step;
      document.getElementById('panel-' + currentStep).classList.add('active');
      document.querySelectorAll('.step-item').forEach(item => {
        const n = parseInt(item.dataset.step);
        item.classList.remove('active', 'done');
        if (n === currentStep) item.classList.add('active');
        if (n < currentStep) item.classList.add('done');
      });
      document.querySelectorAll('.step-line').forEach((line, i) => {
        line.classList.toggle('done', i < currentStep - 1);
      });
      document.querySelector('.sap-form-wrap').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    async function submitForm() {
      const btn = document.querySelector('.btn-submit');
      const originalText = btn.textContent;

      function flash(msg) {
        btn.textContent = msg;
        setTimeout(function () { btn.textContent = originalText; }, 2500);
      }

      const name = document.getElementById('sap-name').value.trim();
      const email = document.getElementById('sap-email').value.trim();
      const tokenField = document.querySelector('#panel-5 [name="cf-turnstile-response"]');
      const token = tokenField ? tokenField.value : '';

      if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        flash('Please add your name and a valid email');
        return;
      }
      if (!token) {
        flash('Please complete the security check');
        return;
      }

      btn.textContent = 'Sending...';
      btn.disabled = true;

      const data = {
        form: 'project',
        botcheck: document.getElementById('botcheck').checked,
        'cf-turnstile-response': token,
        name: name,
        email: email,
        problem: document.getElementById('problem').value,
        audience: document.getElementById('audience').value,
        timeline: document.getElementById('timeline').value,
        extras: document.getElementById('extras').value,
        solutions: Array.from(document.querySelectorAll('input[name="solution"]:checked')).map(i => i.value).join(', '),
        budget: (document.querySelector('input[name="budget"]:checked') || {value: 'Not specified'}).value
      };

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(data)
        });
        const result = await response.json();
        if (result.success) {
          document.getElementById('panel-5').classList.remove('active');
          document.querySelector('.step-item[data-step="5"]').classList.add('done');
          document.querySelectorAll('.step-line').forEach(l => l.classList.add('done'));
          document.getElementById('panel-success').classList.add('active');
          document.querySelector('.steps-track').style.opacity = '0.4';
          document.querySelector('.sap-form-wrap').scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          btn.textContent = 'Something went wrong. Try again.';
          btn.disabled = false;
          if (window.turnstile) window.turnstile.reset();
        }
      } catch (e) {
        btn.textContent = 'Network error. Try again.';
        btn.disabled = false;
        if (window.turnstile) window.turnstile.reset();
      }
    }

    function revealSapEmail() {
      const parts = ['info', '@', 'charleslwanda', '.com'];
      const email = parts.join('');
      document.getElementById('sap-email-btn').style.display = 'none';
      const el = document.getElementById('sap-email-revealed');
      const a = document.createElement('a');
      a.href = 'mailto:' + email;
      a.textContent = email;
      a.style.color = 'var(--gold)';
      el.replaceChildren(a);
      el.style.display = 'inline';
    }

// ── Wire up buttons (replaces inline onclick handlers) ──
document.querySelectorAll('[data-goto]').forEach(function (b) {
  b.addEventListener('click', function () { goTo(parseInt(b.dataset.goto, 10)); });
});
document.querySelectorAll('[data-validate]').forEach(function (b) {
  b.addEventListener('click', function () {
    if (b.dataset.validate === '1') validateStep1(); else validateStep2();
  });
});
var submitBtn = document.querySelector('[data-submit]');
if (submitBtn) submitBtn.addEventListener('click', submitForm);
var sapEmailBtn = document.getElementById('sap-email-btn');
if (sapEmailBtn) sapEmailBtn.addEventListener('click', revealSapEmail);

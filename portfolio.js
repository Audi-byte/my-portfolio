function openCase(id, btn) {
  // Close any open panels
  document.querySelectorAll('.cs-panel.open').forEach(p => {
    p.classList.remove('open');
  });
  // Reset all buttons
  document.querySelectorAll('.pf-card-btn.active').forEach(b => {
    b.innerHTML = 'View Case Study <span class="pf-btn-arrow">&darr;</span>';
    b.classList.remove('active');
  });

  const panel = document.getElementById(id);
  panel.classList.add('open');

  // Update button state
  btn.innerHTML = 'Close Case Study <span class="pf-btn-arrow">&uarr;</span>';
  btn.classList.add('active');

  // Scroll to panel smoothly
  setTimeout(() => {
    panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 50);
}

function closeCase(id) {
  const panel = document.getElementById(id);
  panel.classList.remove('open');

  // Reset corresponding card button
  const cardId = panel.id;
  document.querySelectorAll('.pf-card').forEach(card => {
    if (card.dataset.target === cardId) {
      const btn = card.querySelector('.pf-card-btn');
      btn.innerHTML = 'View Case Study <span class="pf-btn-arrow">&darr;</span>';
      btn.classList.remove('active');
    }
  });

  // Scroll back up to the grid
  document.querySelector('.pf-grid-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ── Wire up buttons (replaces inline onclick handlers) ──
document.querySelectorAll('[data-open-case]').forEach(function (btn) {
  btn.addEventListener('click', function () { openCase(btn.dataset.openCase, btn); });
});
document.querySelectorAll('[data-close-case]').forEach(function (btn) {
  btn.addEventListener('click', function () { closeCase(btn.dataset.closeCase); });
});

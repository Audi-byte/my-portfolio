// Makes the portfolio cards on the home page clickable (mouse and keyboard)
// without inline onclick handlers.
document.querySelectorAll('[data-href]').forEach(function (card) {
  card.addEventListener('click', function () {
    window.location.href = card.dataset.href;
  });
  card.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      window.location.href = card.dataset.href;
    }
  });
});

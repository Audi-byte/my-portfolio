// Google Analytics loader.
// 1. Create a GA4 property, copy its Measurement ID (looks like G-AB12CD34EF).
// 2. Paste it below. While it is still the placeholder, nothing loads at all.
(function () {
  var GA_ID = 'G-XXXXXXXXXX';
  if (GA_ID === 'G-XXXXXXXXXX' || !/^G-[A-Z0-9]{6,}$/.test(GA_ID)) return;

  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', GA_ID);
})();

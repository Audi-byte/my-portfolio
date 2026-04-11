/* ============================================================
   AUDI — LXD Portfolio  |  main.js
   ============================================================ */

/* ── Load shared nav + footer ── */
async function loadPartials() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  // Load nav
  try {
    const navRes = await fetch('nav.html');
    const navHtml = await navRes.text();
    const navContainer = document.getElementById('nav-placeholder');
    if (navContainer) {
      navContainer.outerHTML = navHtml;
      // Set active nav link
      document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
          link.classList.add('nav-active');
        }
      });
      // Re-init nav behaviours after inject
      initNav();
    }
  } catch(e) {
    console.warn('Nav partial not loaded:', e);
  }

  // Load footer
  try {
    const footRes = await fetch('footer.html');
    const footHtml = await footRes.text();
    const footContainer = document.getElementById('footer-placeholder');
    if (footContainer) {
      footContainer.outerHTML = footHtml;
      // Update year
      document.querySelectorAll('.footer-year').forEach(el => {
        el.textContent = new Date().getFullYear();
      });
    }
  } catch(e) {
    console.warn('Footer partial not loaded:', e);
  }
}

/* ── Nav behaviours ── */
function initNav() {
  const nav = document.getElementById('nav');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  if (!nav) return;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  if (hamburger && mobileMenu) {
    const mobileLinks = document.querySelectorAll('.mobile-link');
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Active nav link on scroll (homepage sections)
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  if (sections.length && navLinks.length) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            link.style.color = link.getAttribute('href') === `#${entry.target.id}` ? 'var(--white)' : '';
          });
        }
      });
    }, { threshold: 0.4 });
    sections.forEach(s => sectionObserver.observe(s));
  }
}

/* ── Auto year in footer ── */
document.querySelectorAll('.footer-year').forEach(el => {
  el.textContent = new Date().getFullYear();
});

/* ── Scroll reveal ── */
const revealEls = document.querySelectorAll('.reveal, .reveal-up, .reveal-line');
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
revealEls.forEach(el => revealObserver.observe(el));

/* ── Counter animation ── */
function animateCounter(el, target, duration = 1600) {
  let start = null;
  const step = ts => {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target, parseInt(entry.target.dataset.count, 10));
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

/* ── Hero reveal on load ── */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.querySelectorAll('.hero .reveal, .hero .reveal-line').forEach(el => {
      el.classList.add('revealed');
    });
  }, 150);
});

/* ── Parallax orbs ── */
document.addEventListener('mousemove', e => {
  const x = (e.clientX / window.innerWidth  - 0.5) * 25;
  const y = (e.clientY / window.innerHeight - 0.5) * 25;
  const orb1 = document.querySelector('.orb-1');
  const orb2 = document.querySelector('.orb-2');
  if (orb1) orb1.style.transform = `translate(${x * 0.7}px, ${y * 0.7}px)`;
  if (orb2) orb2.style.transform = `translate(${-x * 0.4}px, ${-y * 0.4}px)`;
});

/* ── Init ── */
loadPartials();

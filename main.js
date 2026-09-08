// NAV SCROLL
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// MOBILE TOGGLE
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// SMOOTH ACTIVE LINK
const sections = document.querySelectorAll('section[id]');
const links = document.querySelectorAll('.nav__link');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      links.forEach(l => l.classList.remove('active'));
      const active = document.querySelector('.nav__link[href="#' + entry.target.id + '"]');
      if (active) active.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });
sections.forEach(s => observer.observe(s));

// FADE-IN ANIMATION
const fadeObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.fade-in').forEach(el => fadeObs.observe(el));

// ACCORDION
document.querySelectorAll('.accordion__trigger').forEach(trigger => {
  trigger.addEventListener('click', () => {
    const item = trigger.closest('.accordion__item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.accordion__item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

function bindTabs(tabNodes) {
  const tabs = Array.from(tabNodes);
  if (!tabs.length) return;

  const activate = (tab, { focus } = {}) => {
    tabs.forEach(t => {
      const on = t === tab;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      if (panel) panel.hidden = !on;
    });
    if (focus) tab.focus();
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activate(tab));
    tab.addEventListener('keydown', e => {
      let next = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = tabs[(index + 1) % tabs.length];
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = tabs[(index - 1 + tabs.length) % tabs.length];
      if (e.key === 'Home') next = tabs[0];
      if (e.key === 'End') next = tabs[tabs.length - 1];
      if (next) {
        e.preventDefault();
        activate(next, { focus: true });
      }
    });
  });
}

document.querySelectorAll('.usps__explorer').forEach(box => bindTabs(box.querySelectorAll('.usps__tab')));
bindTabs(document.querySelectorAll('.steps__tab'));

const compare = document.querySelector('.compare');
if (compare) {
  compare.querySelectorAll('.compare__opt').forEach(btn => {
    btn.addEventListener('click', () => {
      const side = btn.dataset.side;
      compare.classList.toggle('is-me', side === 'me');
      compare.classList.toggle('is-hire', side === 'hire');
      compare.querySelectorAll('.compare__opt').forEach(b => {
        const on = b === btn;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-selected', on ? 'true' : 'false');
      });
    });
  });
}

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const countObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    countObs.unobserve(el);
    const target = Number(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    if (reduceMotion || Number.isNaN(target)) {
      el.textContent = target + suffix;
      return;
    }
    const duration = 1100;
    const start = performance.now();
    const tick = now => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}, { threshold: 0.4 });
document.querySelectorAll('.stats-strip__number[data-count]').forEach(el => {
  if (!reduceMotion) el.textContent = '0' + (el.dataset.suffix || '');
  countObs.observe(el);
});


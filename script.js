/**
 * València Guide — script.js
 * Handles: scroll → navbar style, active nav link tracking,
 * hamburger menu, smooth-scroll anchors, scroll-reveal animations.
 */
(function () {
  'use strict';

  /* ─────────────────────────────────────
     1. NAVBAR — scroll state
  ───────────────────────────────────── */
  const navbar = document.getElementById('navbar');

  function updateNavbar() {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }
  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();


  /* ─────────────────────────────────────
     2. HAMBURGER MENU
  ───────────────────────────────────── */
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburger.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
  });

  // Close on any mobile link click
  mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
    });
  });


  /* ─────────────────────────────────────
     3. ACTIVE NAV LINK — IntersectionObserver
     Highlights the nav link whose section
     is currently in the viewport.
  ───────────────────────────────────── */
  const navLinks    = document.querySelectorAll('.nav-link');
  const sections    = document.querySelectorAll('section[id], div[id="hero"]');

  // Map section id → nav link
  const linkMap = {};
  navLinks.forEach(link => {
    const hash = link.getAttribute('href').replace('#', '');
    linkMap[hash] = link;
  });

  const sectionObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(l => l.classList.remove('active'));
          if (linkMap[id]) linkMap[id].classList.add('active');
        }
      });
    },
    {
      rootMargin: '-30% 0px -60% 0px',
      threshold: 0
    }
  );

  sections.forEach(sec => sectionObserver.observe(sec));


  /* ─────────────────────────────────────
     4. SMOOTH SCROLL with navbar offset
     Overrides default anchor jump to
     account for the fixed navbar height.
  ───────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();

      const navH = navbar.offsetHeight;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });


  /* ─────────────────────────────────────
     5. SCROLL REVEAL ANIMATION
     Elements with class .reveal fade in
     and rise up when they enter the viewport.
  ───────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Once visible, stop watching to save resources
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -60px 0px'
    }
  );

  revealEls.forEach((el, i) => {
    // Stagger siblings within the same parent
    const siblings = Array.from(el.parentNode.querySelectorAll('.reveal'));
    const delay    = siblings.indexOf(el) * 80;
    el.style.transitionDelay = delay + 'ms';
    revealObserver.observe(el);
  });

})();
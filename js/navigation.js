/**
 * @fileoverview Hamburger menu, smooth scroll, and scroll-reveal animations.
 * @module navigation
 */

// ── Hamburger menu ─────────────────────────────────────────────────────────

/**
 * Removes the nav-open class from the header and syncs aria-expanded.
 */
function closeNav() {
  const header    = document.querySelector('header');
  const hamburger = document.querySelector('.hamburger');
  if (!header) return;
  header.classList.remove('nav-open');
  if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
}

/**
 * Wires up the hamburger button click, nav link clicks (auto-close),
 * and outside-click dismissal for the mobile navigation.
 */
(function initHamburger() {
  const header    = document.querySelector('header');
  const hamburger = document.querySelector('.hamburger');
  const navLinks  = document.querySelectorAll('.header-nav a');
  if (!header || !hamburger) return;

  hamburger.addEventListener('click', function () {
    const isOpen = header.classList.toggle('nav-open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.forEach(function (link) {
    link.addEventListener('click', closeNav);
  });

  document.addEventListener('click', function (e) {
    if (!header.contains(e.target)) closeNav();
  });
}());


// ── Smooth scroll ──────────────────────────────────────────────────────────

/**
 * Easing function (cubic in-out) for the scroll animation.
 * @param {number} t - Progress value between 0 and 1.
 * @returns {number} Eased progress value.
 */
function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Animates the window scroll position from start by distance over duration ms.
 * @param {number} start    - Current scroll position in px.
 * @param {number} distance - Pixels to scroll (positive = down).
 * @param {number} duration - Animation length in ms.
 */
function animateScroll(start, distance, duration) {
  let startTime = null;
  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    window.scrollTo(0, start + distance * easeInOutCubic(progress));
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/**
 * Scrolls to target, offsetting by the sticky header height.
 * @param {HTMLElement} target - Section element to scroll to.
 */
function scrollToTarget(target) {
  const headerHeight = document.querySelector('header').offsetHeight;
  const targetTop    = target.getBoundingClientRect().top + window.scrollY - headerHeight;
  animateScroll(window.scrollY, targetTop - window.scrollY, 700);
}

/**
 * Attaches smooth-scroll behaviour to all anchor links with a real hash target.
 * Skips bare "#" links so that modal triggers are not intercepted.
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) scrollToTarget(target);
    });
  });
}

initSmoothScroll();


// ── Scroll-reveal animations ───────────────────────────────────────────────

/**
 * Adds alternating reveal-left / reveal-right classes to every top-level
 * section except the hero, so each section slides in from a different side.
 */
function assignRevealClasses() {
  document.querySelectorAll('body > section:not(.hero)').forEach(function (el, i) {
    el.classList.add(i % 2 === 0 ? 'reveal-left' : 'reveal-right');
  });
}

/**
 * Creates an IntersectionObserver that adds the "active" class once an element
 * enters the viewport, then stops watching it.
 * @returns {IntersectionObserver}
 */
function createScrollObserver() {
  const obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  return obs;
}

/**
 * Assigns reveal classes, observes all reveal elements, and immediately
 * activates any that are already visible when the page first loads.
 */
function initScrollAnimations() {
  assignRevealClasses();
  const observer = createScrollObserver();
  document.querySelectorAll('.reveal-left, .reveal-right').forEach(function (el) {
    observer.observe(el);
  });
  setTimeout(function () {
    document.querySelectorAll('.reveal-left, .reveal-right').forEach(function (el) {
      if (el.getBoundingClientRect().top < window.innerHeight) {
        el.classList.add('active');
        observer.unobserve(el);
      }
    });
  }, 100);
}

initScrollAnimations();

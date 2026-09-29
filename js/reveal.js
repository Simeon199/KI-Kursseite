/**
 * @fileoverview Scroll-reveal animation for content blocks (adopted from the Homepage project).
 * @module reveal
 */

/** Containers whose children fade in one after another. */
const GROUP_SELECTOR = '.aud-grid, .offers, .pillars, .quotes, .steps, .gets, .refs';

/** Single blocks that fade in as a whole. */
const SINGLE_SELECTOR = '.head, .note, .finder, .about-grid, .aiact, .contact form';

/** Time (ms) after which the reveal classes are removed so hover transitions are not slowed down. */
const CLEANUP_DELAY = 1200;

/**
 * Removes all reveal classes once the entrance animation has finished.
 * @param {Element} element - The revealed element.
 * @returns {void}
 */
function scheduleCleanup(element) {
  setTimeout(() => element.classList.remove('reveal', 'reveal-group', 'is-visible'), CLEANUP_DELAY);
}

/**
 * Reveals an element once it enters the viewport and stops observing it.
 * @param {IntersectionObserverEntry[]} entries - Observed intersection entries.
 * @param {IntersectionObserver} observer - The observer that reported the entries.
 * @returns {void}
 */
function revealVisible(entries, observer) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    scheduleCleanup(entry.target);
    observer.unobserve(entry.target);
  });
}

/**
 * Tags elements for the reveal animation and starts observing them.
 * Does nothing if the user prefers reduced motion or the API is missing,
 * so the content simply stays visible.
 * @returns {void}
 */
export function initReveal() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced || !('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver(revealVisible, { threshold: .15, rootMargin: '0px 0px -60px 0px' });
  document.querySelectorAll(GROUP_SELECTOR).forEach(el => el.classList.add('reveal-group'));
  document.querySelectorAll(SINGLE_SELECTOR).forEach(el => el.classList.add('reveal'));
  document.querySelectorAll('.reveal, .reveal-group').forEach(el => observer.observe(el));
}

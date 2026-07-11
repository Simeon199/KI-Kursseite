/**
 * @fileoverview FAQ accordion interaction.
 * @module accordion
 */

/**
 * Initialises click-to-expand behaviour for all FAQ items.
 * Clicking an open question closes it; clicking a closed one opens it
 * and collapses any currently open item.
 */
document.querySelectorAll('.faq-q').forEach(function (question) {
  question.addEventListener('click', function () {
    const item    = question.parentElement;
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  });
});

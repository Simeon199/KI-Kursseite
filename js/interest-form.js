/**
 * @fileoverview Shared behaviour of the interest forms (waitlist and first-call request).
 * Prototype behaviour: no data is sent anywhere.
 * @module interest-form
 */

/**
 * Lets every element with a data-interest attribute pre-select the matching
 * option of the given select field when it is clicked.
 * @param {string} selectId - ID of the select element to pre-fill.
 * @returns {void}
 */
export function prefillSelectOnClick(selectId) {
  const select = document.getElementById(selectId);
  document.querySelectorAll('[data-interest]').forEach(link => {
    link.addEventListener('click', () => { select.value = link.dataset.interest; });
  });
}

/**
 * Prevents the real submit and shows the confirmation message instead.
 * @param {string} formId - ID of the form element.
 * @param {string} messageId - ID of the confirmation element.
 * @returns {void}
 */
export function showThanksOnSubmit(formId, messageId) {
  document.getElementById(formId).addEventListener('submit', event => {
    event.preventDefault();
    document.getElementById(messageId).classList.add('show');
  });
}

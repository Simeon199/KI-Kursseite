/**
 * @fileoverview Spam protection and form field validation.
 * @module validation
 */

/** Minimale plausible Ausfuelldauer (ms). Schnellere Submits gelten als Bot. */
const MIN_FILL_TIME_MS = 2500;

/**
 * Zeitstempel der Bot-Falle — wird beim Oeffnen des Anmelde-Popups zurueckgesetzt,
 * da das Formular sonst schon "alt" waere, sobald jemand die Landingpage laenger
 * gelesen hat, bevor das Popup geoeffnet wird.
 */
let formRenderTime = Date.now();

/**
 * Checks whether a submission looks automated. Two independent signals:
 *  - Honeypot: ein fuer Menschen unsichtbares Feld; fuellt ein Bot es aus, ist es Spam.
 *  - Zeitfalle: menschliches Ausfuellen dauert laenger als {@link MIN_FILL_TIME_MS}.
 * @returns {boolean} True if the submission looks like spam.
 */
function isSpam() {
  const honeypot       = document.getElementById('website');
  const honeypotFilled = !!(honeypot && honeypot.value.trim() !== '');
  const tooFast        = (Date.now() - formRenderTime) < MIN_FILL_TIME_MS;
  return honeypotFilled || tooFast;
}

/**
 * Puts a submit button into a loading or ready state.
 * @param {HTMLButtonElement} button          - The submit button element.
 * @param {boolean}           isLoading       - True to disable and show loading text.
 * @param {string}            [originalText=''] - Text to restore when not loading.
 */
function setButtonLoadingState(button, isLoading, originalText = '') {
  button.disabled    = isLoading;
  button.textContent = isLoading ? 'Wird gesendet …' : originalText;
}

/**
 * Marks a form element as invalid by applying the error border colour and
 * setting aria-invalid for assistive technology.
 * Always returns false so it can be used inline as a validation guard.
 * @param {HTMLElement} element - The input or select element to mark.
 * @returns {false}
 */
function markInputInvalid(element) {
  element.style.borderColor = '#E07B54';
  element.setAttribute('aria-invalid', 'true');
  return false;
}

/**
 * Validates every form control against its HTML5 constraints, marking invalid
 * ones visually. Resets the error state on every field first.
 * @param {HTMLFormElement} form - The form to validate.
 * @returns {boolean} True if all fields are valid.
 */
function validateRequiredFields(form) {
  let isValid = true;
  form.querySelectorAll('input, select, textarea').forEach(el => {
    el.style.borderColor = '';
    el.removeAttribute('aria-invalid');
    if (!el.checkValidity()) isValid = markInputInvalid(el);
  });
  return isValid;
}

/**
 * Smoothly scrolls the first invalid field into view and focuses it.
 * @param {HTMLFormElement} form - The form that was validated.
 */
function focusFirstError(form) {
  const firstError = form.querySelector('[aria-invalid="true"]');
  if (firstError) {
    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    firstError.focus({ preventScroll: true });
  }
}

/**
 * @fileoverview Booking form submit handler and UI feedback.
 * @module submit
 */

/**
 * Resets the submit button to its original, interactive state.
 * @param {HTMLButtonElement} button       - The submit button.
 * @param {string}            originalText - Text to restore on the button.
 */
function resetButton(button, originalText) {
  setButtonLoadingState(button, false, originalText);
}

/**
 * Hides the booking form and reveals the success message.
 */
function showSuccess() {
  document.getElementById('form-wrap').style.display   = 'none';
  document.getElementById('success-msg').style.display = 'block';
  const dialog = document.querySelector('.modal-dialog');
  if (dialog) dialog.scrollTop = 0;
}

/**
 * Clears any previously shown submit-error message.
 */
function clearSubmitError() {
  const errorEl = document.getElementById('submit-error');
  if (errorEl) errorEl.style.display = 'none';
}

/**
 * Re-enables the submit button and shows a user-facing error message after
 * a failed webhook transmission.
 * @param {HTMLButtonElement} submitBtn    - The submit button element.
 * @param {string}            originalText - Original button label to restore.
 */
function showSubmitError(submitBtn, originalText) {
  resetButton(submitBtn, originalText);
  const errorEl = document.getElementById('submit-error');
  if (errorEl) {
    errorEl.textContent = 'Leider gab es ein Problem beim Senden Ihrer Anmeldung. Bitte versuchen Sie es erneut oder kontaktieren Sie uns direkt.';
    errorEl.style.display = 'block';
  }
}

/**
 * Validates child count, form fields, and collected data; then sends the
 * submission to n8n and shows the success or error state accordingly.
 * @param {HTMLFormElement}   form         - The booking form element.
 * @param {HTMLButtonElement} submitBtn    - The submit button element.
 * @param {string}            originalText - Original button label to restore on error.
 */
function processSubmission(form, submitBtn, originalText) {
  const childCount = ensureChildFields();
  if (!childCount) {
    markInputInvalid(document.getElementById('kinder-anzahl'));
    return resetButton(submitBtn, originalText);
  }
  if (!validateRequiredFields(form)) {
    focusFirstError(form);
    return resetButton(submitBtn, originalText);
  }
  let data;
  try {
    data = collectFormData(childCount);
  } catch (err) {
    console.error('❌ Fehler beim Einlesen der Kinderdaten:', err);
    return resetButton(submitBtn, originalText);
  }
  sendToN8n(data)
    .then(showSuccess)
    .catch(err => {
      console.error('❌ Fehler beim Senden der Anmeldung:', err);
      showSubmitError(submitBtn, originalText);
    });
}

/**
 * Handles the booking form's submit event: checks for spam, guards against
 * double submission, and delegates to {@link processSubmission}.
 * @param {SubmitEvent} e - The form submit event.
 */
function handleBookingSubmit(e) {
  e.preventDefault();
  if (isSpam()) return console.warn('Spam-Versuch erkannt');
  const submitBtn       = this.querySelector('.btn-submit');
  const originalBtnText = submitBtn.textContent;
  if (submitBtn.disabled) return;
  clearSubmitError();
  setButtonLoadingState(submitBtn, true);
  processSubmission(this, submitBtn, originalBtnText);
}

const bookingForm = document.getElementById('booking-form');
if (bookingForm) bookingForm.addEventListener('submit', handleBookingSubmit);

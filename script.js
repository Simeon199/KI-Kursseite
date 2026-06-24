/**
 * @fileoverview FAQ accordion interaction, form validation, data collection,
 *               and booking form submission logic.
 * @module script
 */

// ==========================================
// FAQ ACCORDION
// ==========================================

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


// ==========================================
// UTILITIES
// ==========================================

/**
 * Escapes HTML special characters in a value and trims surrounding whitespace.
 * Returns an empty string for null or undefined values.
 * @param {*} value - The value to escape.
 * @returns {string} A safe, trimmed string.
 */

function escapeText(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .trim();
}

// ==========================================
// FORM PROTECTION & VALIDATION
// ==========================================

/**
 * Checks whether the honeypot field has been filled in, indicating a spam submission.
 * @returns {boolean} True if the submission looks like spam.
 */

function isSpam() {
  const honeypot = document.getElementById('website');
  return !!(honeypot && honeypot.value.trim() !== '');
}

/**
 * Puts a submit button into a loading or ready state.
 * @param {HTMLButtonElement} button       - The submit button element.
 * @param {boolean}           isLoading    - True to disable and show loading text.
 * @param {string}            [originalText=''] - Text to restore when not loading.
 */

function setButtonLoadingState(button, isLoading, originalText = '') {
  button.disabled    = isLoading;
  button.textContent = isLoading ? 'Wird zur Zahlung weitergeleitet …' : originalText;
}

/**
 * Marks a form element as invalid by applying the error border colour.
 * Always returns false so it can be used inline as a validation guard.
 * @param {HTMLElement} element - The input or select element to mark.
 * @returns {false}
 */

function markInputInvalid(element) {
  element.style.borderColor = '#E07B54';
  return false;
}

/**
 * Validates all required fields in a form, marking invalid ones visually.
 * Resets border colour on every field before re-evaluating.
 * @param {HTMLFormElement} form - The form to validate.
 * @returns {boolean} True if all required fields are valid.
 */

function validateRequiredFields(form) {
  let isValid = true;
  form.querySelectorAll('[required]').forEach(el => {
    el.style.borderColor = '';
    const isEmpty   = (el.type === 'checkbox' && !el.checked) || (el.type !== 'checkbox' && !el.value.trim());
    const isInvalid = el.type !== 'checkbox' && el.value.trim() && !el.checkValidity();
    if (isEmpty || isInvalid) isValid = markInputInvalid(el);
  });
  return isValid;
}

/**
 * Smoothly scrolls the first invalid field into view.
 * @param {HTMLFormElement} form - The form that was validated.
 */

function focusFirstError(form) {
  const firstError = form.querySelector('[required][style*="E07B54"]');
  if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ==========================================
// DATA EXTRACTION
// ==========================================

/**
 * Reads and escapes the registration data for a single child from the DOM.
 * Throws if a required DOM element is missing.
 * @param {number} index - Child index (1-based).
 * @returns {{firstName: string, lastName: string, grade: string, schoolType: string, schoolName: string}}
 * @throws {Error} When a required DOM element cannot be found.
 */

function extractChildData(index) {
  const get = id => {
    const el = document.getElementById(id);
    if (!el) throw new Error(`DOM element missing: #${id}`);
    return el;
  };
  return {
    firstName:  escapeText(get(`vorname-kind-${index}`).value),
    lastName:   escapeText(get(`nachname-kind-${index}`).value),
    grade:      escapeText(get(`klasse-kind-${index}`).value),
    schoolType: escapeText(get(`schulart-kind-${index}`).value),
    schoolName: escapeText(get(`schule-kind-${index}`).value) || '–',
  };
}

/**
 * Formats a single child's data as a human-readable summary string.
 * @param {{firstName: string, lastName: string, grade: string, schoolType: string, schoolName: string}} child
 * @param {number} idx - Zero-based index used to compute the display number.
 * @returns {string} E.g. "Kind 1: Max Mustermann – Klasse 8, Realschule (Hans-Thoma-RS)"
 */

function formatChildSummary(child, idx) {
  const schoolSuffix = child.schoolName !== '–' ? ` (${child.schoolName})` : '';
  return `Kind ${idx + 1}: ${child.firstName} ${child.lastName} – ${child.grade}, ${child.schoolType}${schoolSuffix}`;
}

/**
 * Builds a pipe-separated summary string for all registered children.
 * @param {number} count - Total number of children to collect.
 * @returns {string} Combined children summary, entries separated by " | ".
 */

function buildChildrenText(count) {
  return Array.from({ length: count }, (_, i) => extractChildData(i + 1))
    .map(formatChildSummary)
    .join(' | ');
}

/**
 * @typedef {Object} FormData
 * @property {string} timestamp        - Formatted submission date/time.
 * @property {string} firstName        - Parent's first name.
 * @property {string} lastName         - Parent's last name.
 * @property {string} email            - Parent's e-mail address (lowercase).
 * @property {string} phone            - Parent's phone number, or "–".
 * @property {string} address          - Parent's address.
 * @property {number} childCount       - Number of children registered.
 * @property {string} childrenText     - Pipe-separated child summaries.
 * @property {string} appointmentKey   - Raw select value for the desired appointment.
 * @property {string} appointmentLabel - Human-readable appointment label.
 * @property {string} message          - Optional message, or "–".
 * @property {string} paymentStatus    - Initial payment status string.
 */

/**
 * Collects and sanitises all booking form data into a single object.
 * @param {number} childCount - Number of children (already validated).
 * @returns {FormData} The collected form data.
 */

function collectFormData(childCount) {
  const appointmentKey = document.getElementById('wunschtermin').value;
  return {
    timestamp:        new Date().toLocaleString('de-DE', { dateStyle: 'full', timeStyle: 'short' }),
    firstName:        escapeText(document.getElementById('vorname').value),
    lastName:         escapeText(document.getElementById('nachname').value),
    email:            document.getElementById('email').value.trim().toLowerCase(),
    phone:            escapeText(document.getElementById('telefon').value) || '–',
    address:          escapeText(document.getElementById('adresse').value),
    childCount,
    childrenText:     buildChildrenText(childCount),
    appointmentKey,
    appointmentLabel: CONFIG.appointmentLabels[appointmentKey] || '–',
    message:          escapeText(document.getElementById('nachricht').value) || '–',
    paymentStatus:    'Wartet auf Zahlung'
  };
}

// ==========================================
// API & REDIRECT
// ==========================================

/**
 * Sends the collected form data to the configured n8n webhook.
 * Errors are logged to the console and do not block the redirect.
 * @param {FormData} data - The form data to transmit.
 * @returns {Promise<void>}
 */

function sendToN8n(data) {
  return fetch(CONFIG.n8nWebhookUrl, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(data)
  })
  .then(res => {
    if (!res.ok) throw new Error('n8n transmission failed');
    console.log('✅ Daten erfolgreich an n8n übertragen');
  })
  .catch(err => console.error('❌ Fehler:', err));
}

/**
 * Redirects the browser to the Digistore24 checkout page,
 * pre-filling name and e-mail via query parameters.
 * @param {FormData} data - The form data used to build the redirect URL.
 */

function redirectToDigistore(data) {
  const params = new URLSearchParams({
    email:      data.email,
    first_name: data.firstName,
    last_name:  data.lastName
  });
  window.location.href = `${CONFIG.digistoreBaseUrl}?${params.toString()}`;
}

// ==========================================
// MAIN SUBMIT HANDLER
// ==========================================

/**
 * Resets the submit button to its original, interactive state.
 * @param {HTMLButtonElement} button       - The submit button.
 * @param {string}            originalText - Text to restore on the button.
 */

function resetButton(button, originalText) {
  setButtonLoadingState(button, false, originalText);
}

/**
 * Validates child count, form fields, and collected data; then triggers
 * the n8n webhook and Digistore redirect on success.
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
  sendToN8n(data).then(() => redirectToDigistore(data));
}

/**
 * Handles the booking form's submit event:
 * checks for spam, guards against double submission, and delegates to {@link processSubmission}.
 * @param {SubmitEvent} e - The form submit event.
 */

function handleBookingSubmit(e) {
  e.preventDefault();
  if (isSpam()) return console.warn('Spam-Versuch erkannt');
  const submitBtn       = this.querySelector('.btn-submit');
  const originalBtnText = submitBtn.textContent;
  if (submitBtn.disabled) return;
  setButtonLoadingState(submitBtn, true);
  processSubmission(this, submitBtn, originalBtnText);
}

const bookingForm = document.getElementById('booking-form');
if (bookingForm) bookingForm.addEventListener('submit', handleBookingSubmit);
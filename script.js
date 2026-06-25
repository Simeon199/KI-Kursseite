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
 * Normalises and HTML-escapes a value so it is safe to forward to downstream
 * systems (n8n / e-mail). Strips control and zero-width characters, enforces a
 * hard length cap, escapes all five HTML-significant characters and trims.
 * Returns an empty string for null or undefined values.
 * @param {*} value - The value to sanitise.
 * @returns {string} A safe, trimmed string.
 */

function escapeText(value) {
  return String(value == null ? '' : value)
    // 1) Steuerzeichen entfernen, ausser Tab (U+0009), Zeilenumbruch (U+000A)
    //    und Wagenruecklauf (U+000D), die im mehrzeiligen Nachrichtenfeld
    //    erlaubt bleiben. Verhindert getarnte Payloads und Layout-Tricks.
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    // 2) Zero-Width-/unsichtbare Zeichen entfernen.
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    // 3) Harte Laengenbegrenzung als zusaetzliche Verteidigung: maxlength im HTML
    //    laesst sich ueber die DevTools umgehen - hier kappen wir auf JS-Seite.
    .slice(0, 2000)
    // 4) Vollstaendiges HTML-Escaping nach OWASP, inkl. Anfuehrungszeichen, damit
    //    der Wert im HTML-Body- UND Attribut-Kontext sicher ist, falls n8n die
    //    Daten ungeprueft in eine HTML-E-Mail einsetzt (Schutz vor Stored-XSS).
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .trim();
}

// ==========================================
// FORM PROTECTION & VALIDATION
// ==========================================

/** Minimale plausible Ausfuelldauer (ms). Schnellere Submits gelten als Bot. */
const MIN_FILL_TIME_MS = 2500;

/** Zeitstempel beim Laden der Seite - Basis fuer die zeitbasierte Bot-Falle. */
const formRenderTime = Date.now();

/**
 * Checks whether a submission looks automated. Two independent signals:
 *  - Honeypot: ein fuer Menschen unsichtbares Feld; fuellt ein Bot es aus, ist es Spam.
 *  - Zeitfalle: menschliches Ausfuellen dauert laenger als {@link MIN_FILL_TIME_MS};
 *    nahezu instantane Submits stammen praktisch immer von Bots.
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
 * @param {HTMLButtonElement} button       - The submit button element.
 * @param {boolean}           isLoading    - True to disable and show loading text.
 * @param {string}            [originalText=''] - Text to restore when not loading.
 */

function setButtonLoadingState(button, isLoading, originalText = '') {
  button.disabled    = isLoading;
  button.textContent = isLoading ? 'Wird zur Zahlung weitergeleitet …' : originalText;
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
 * ones visually. A single checkValidity() call covers all native standards at
 * once: required (empty), pattern (regex), type=email, maxlength, etc. Optional
 * empty fields count as valid - only filled optional fields (e.g. phone) must
 * still satisfy their pattern. Resets the error state on every field first.
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
 * Collects and escapes the registration data for all children at once, so the
 * same result can feed both the human-readable summary and the structured
 * array that the server uses for per-child validation (Klasse, Schulart, ...).
 * @param {number} count - Total number of children to collect.
 * @returns {Array<{firstName: string, lastName: string, grade: string, schoolType: string, schoolName: string}>}
 */

function collectChildren(count) {
  return Array.from({ length: count }, (_, i) => extractChildData(i + 1));
}

/**
 * Builds a pipe-separated summary string from already-collected children.
 * @param {Array<{firstName: string, lastName: string, grade: string, schoolType: string, schoolName: string}>} children
 * @returns {string} Combined children summary, entries separated by " | ".
 */

function buildChildrenText(children) {
  return children.map(formatChildSummary).join(' | ');
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
 * @property {Array<{firstName: string, lastName: string, grade: string, schoolType: string, schoolName: string}>} children - Structured per-child data for server-side validation.
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
  const children       = collectChildren(childCount);
  return {
    timestamp:        new Date().toLocaleString('de-DE', { dateStyle: 'full', timeStyle: 'short' }),
    firstName:        escapeText(document.getElementById('vorname').value),
    lastName:         escapeText(document.getElementById('nachname').value),
    email:            document.getElementById('email').value.trim().toLowerCase(),
    phone:            escapeText(document.getElementById('telefon').value) || '–',
    address:          escapeText(document.getElementById('adresse').value),
    childCount,
    children,
    childrenText:     buildChildrenText(children),
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
 * Redirects the browser to the Digistore24 checkout page, pre-filling name,
 * e-mail and phone via query parameters. URLSearchParams URL-encodes every
 * value, and the target host is the fixed CONFIG.digistoreBaseUrl, so no
 * open-redirect is possible. The "–" placeholder for an empty phone is
 * converted back to an empty string so Digistore never receives a literal dash.
 * @param {FormData} data - The form data used to build the redirect URL.
 */

function redirectToDigistore(data) {
  // Digistore24 erwartet die Menge produktspezifisch als quantity_<Produkt-ID>,
  // NICHT als generisches "quantity" (das wird ignoriert und der Preis bleibt 1x).
  // Die Produkt-ID stammt aus der Checkout-URL (.../product/705362) und ist damit
  // die einzige Quelle der Wahrheit - so kann sie nicht von der Basis-URL abweichen.
  // Voraussetzung im Digistore-Produkt: "Käufer kann Menge ändern" muss aktiv sein.
  const productId = (CONFIG.digistoreBaseUrl.match(/\/product\/(\d+)/) || [])[1] || '';
  const params = new URLSearchParams({
    email:                     data.email,
    first_name:                data.firstName,
    last_name:                 data.lastName,
    phone_no:                  data.phone === '–' ? '' : data.phone,
    [`quantity_${productId}`]: data.childCount,
    quantity_locked:           1
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

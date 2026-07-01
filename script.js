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

/**
 * Zeitstempel der Bot-Falle - Basis fuer die zeitbasierte Pruefung in {@link isSpam}.
 * Wird beim Oeffnen des Anmelde-Popups in {@link openBookingModal} zurueckgesetzt,
 * da das Formular sonst schon "alt" waere, sobald jemand die Landingpage laenger
 * gelesen hat, bevor das Popup geoeffnet wird.
 */
let formRenderTime = Date.now();

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
 * @property {string}  message          - Optional message, or "–".
 * @property {string}  paymentStatus    - Initial invoice status, shown in SeaTable for the manual billing workflow.
 * @property {boolean} consent          - Whether the privacy-policy checkbox was ticked; sent for a server-side GDPR audit trail.
 * @property {boolean} newsletter       - Whether the user opted in to the newsletter.
 * @property {string}  website          - Honeypot value; empty for genuine users, lets the server independently re-check for spam.
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
    childCount:       childCount,
    children:         children,
    childrenText:     buildChildrenText(children),
    appointmentKey:   appointmentKey,
    appointmentLabel: CONFIG.appointmentLabels[appointmentKey] || '–',
    message:          escapeText(document.getElementById('nachricht').value) || '–',
    paymentStatus:    'Rechnung ausstehend',
    consent:          document.getElementById('datenschutz').checked,
    newsletter:       document.getElementById('newsletter').checked,
    website:          document.getElementById('website').value.trim()
  };
}

// ==========================================
// API
// ==========================================

/**
 * Sends the collected form data to the configured n8n webhook, which stores it
 * in SeaTable and notifies the course creators so they can prepare a manual
 * invoice. Throws on transport or server failure so the caller can react -
 * there is no redirect to a payment provider anymore, so this request is the
 * only confirmation a submission actually arrived.
 * @param {FormData} data - The form data to transmit.
 * @returns {Promise<void>}
 * @throws {Error} When the request fails or the server responds with a non-OK status.
 */

function sendToN8n(data) {
  return fetch(CONFIG.n8nWebhookUrl, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(data)
  })
  .then(res => {
    if (!res.ok) throw new Error('n8n transmission failed');
  });
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
 * Hides the booking form and reveals the success message. There is no
 * payment redirect anymore, so this is the final state of a successful submission.
 */

function showSuccess() {
  document.getElementById('form-wrap').style.display = 'none';
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
 * a failed webhook transmission, since no redirect exists anymore to signal
 * success or failure implicitly.
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
  clearSubmitError();
  setButtonLoadingState(submitBtn, true);
  processSubmission(this, submitBtn, originalBtnText);
}

const bookingForm = document.getElementById('booking-form');
if (bookingForm) bookingForm.addEventListener('submit', handleBookingSubmit);

// ==========================================
// ANMELDE-POPUP (BOOKING MODAL)
// ==========================================

/**
 * Opens the booking modal, locks page scrolling behind it, and resets the
 * spam time-trap so it measures fill time from when the form actually
 * becomes visible rather than from the initial page load.
 */

function openBookingModal() {
  const modal = document.getElementById('booking-modal');
  if (!modal) return;
  modal.classList.add('is-open');
  document.body.style.overflow = 'hidden';
  formRenderTime = Date.now();
}

/**
 * Closes the booking modal and restores page scrolling.
 */

function closeBookingModal() {
  const modal = document.getElementById('booking-modal');
  if (!modal) return;
  modal.classList.remove('is-open');
  document.body.style.overflow = '';
}

document.querySelectorAll('[data-open-booking]').forEach(function (trigger) {
  trigger.addEventListener('click', function (e) {
    e.preventDefault();
    openBookingModal();
  });
});

const modalCloseBtn = document.getElementById('modal-close-btn');
if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeBookingModal);

const bookingModal = document.getElementById('booking-modal');
if (bookingModal) {
  bookingModal.addEventListener('click', function (e) {
    if (e.target === bookingModal) closeBookingModal();
  });
}

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') closeBookingModal();
});


// ==========================================
// HAMBURGER MENU
// ==========================================

/**
 * Toggles the mobile navigation by adding/removing the `nav-open` class
 * on the `<header>` element and syncing the aria-expanded attribute.
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


// ==========================================
// SMOOTH SCROLL
// ==========================================

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


// ==========================================
// SCROLL ANIMATIONS
// ==========================================

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

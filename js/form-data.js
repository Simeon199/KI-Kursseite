/**
 * @fileoverview Booking form data extraction and sanitisation.
 * @module form-data
 */

/**
 * Reads and escapes the registration data for a single child from the DOM.
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
 * Collects and escapes the registration data for all children.
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
 * @property {string}  timestamp        - Formatted submission date/time.
 * @property {string}  firstName        - Parent's first name.
 * @property {string}  lastName         - Parent's last name.
 * @property {string}  email            - Parent's e-mail address (lowercase).
 * @property {string}  phone            - Parent's phone number, or "–".
 * @property {string}  address          - Parent's address.
 * @property {number}  childCount       - Number of children registered.
 * @property {Array}   children         - Structured per-child data.
 * @property {string}  childrenText     - Pipe-separated child summaries.
 * @property {string}  appointmentKey   - Raw select value for the desired appointment.
 * @property {string}  appointmentLabel - Human-readable appointment label.
 * @property {string}  message          - Optional message, or "–".
 * @property {string}  paymentStatus    - Initial invoice status for SeaTable.
 * @property {boolean} consent          - Whether the privacy-policy checkbox was ticked.
 * @property {boolean} newsletter       - Whether the user opted in to the newsletter.
 * @property {string}  website          - Honeypot value for server-side re-check.
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

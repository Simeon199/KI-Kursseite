/**
 * @fileoverview Dynamic rendering of per-child registration fields.
 * @module render
 */

/** @type {string[]} Available grade options */
const GRADE_OPTIONS = ['Klasse 7', 'Klasse 8', 'Klasse 9', 'Klasse 10'];

/** @type {string[]} Available school-type options */
const SCHOOL_TYPE_OPTIONS = ['Werkrealschule', 'Realschule', 'Gymnasium', 'Gemeinschaftsschule'];

/**
 * @typedef {Object} ChildValues
 * @property {string} firstName  - First name of the child.
 * @property {string} lastName   - Last name of the child.
 * @property {string} grade      - Selected grade (e.g. "Klasse 8").
 * @property {string} schoolType - Selected school type.
 * @property {string} schoolName - Optional school name / location.
 */

/**
 * Reads and saves the current input values of all rendered child blocks.
 * @param {HTMLElement} container - The #kinder-felder container element.
 * @returns {Object.<number, ChildValues>} Map of child index to its saved values.
 */

function saveChildValues(container) {
  const saved = {};
  container.querySelectorAll('.kind-block').forEach((_, idx) => {
    const i = idx + 1;
    const val = id => (document.getElementById(id) || {}).value || '';
    saved[i] = {
      firstName:  val(`vorname-kind-${i}`),
      lastName:   val(`nachname-kind-${i}`),
      grade:      val(`klasse-kind-${i}`),
      schoolType: val(`schulart-kind-${i}`),
      schoolName: val(`schule-kind-${i}`),
    };
  });
  return saved;
}

/**
 * Builds the HTML markup for a single text input form group.
 * @param {string} fieldId      - ID/name prefix for the input (e.g. "vorname").
 * @param {string} label        - Display label text.
 * @param {string} placeholder  - Input placeholder text.
 * @param {number} i            - Child index (1-based).
 * @returns {string} HTML string for the form group.
 */

function buildNameInput(fieldId, label, placeholder, i) {
  return `<div class="form-group">
      <label for="${fieldId}-kind-${i}">${label} <span class="req">*</span></label>
      <input type="text" id="${fieldId}-kind-${i}" name="${fieldId}-kind-${i}"
        placeholder="${placeholder}" required maxlength="60"
        pattern="[A-Za-zÄÖÜäöüß\\-\\s]{2,60}"
        title="Bitte nur Buchstaben, Leerzeichen und Bindestriche verwenden">
    </div>`;
}

/**
 * Builds the HTML markup for the first-name / last-name row of a child block.
 * @param {number} i - Child index (1-based).
 * @returns {string} HTML string for the form row.
 */

function buildNameRow(i) {
  return `<div class="form-row">
    ${buildNameInput('vorname',  'Vorname',  'Vorname des Kindes',  i)}
    ${buildNameInput('nachname', 'Nachname', 'Nachname des Kindes', i)}
  </div>`;
}

/**
 * Builds the HTML markup for a required select (dropdown) form group.
 * @param {string}   fieldId - ID/name prefix for the select.
 * @param {string}   label   - Display label text.
 * @param {string[]} options - Option values (used as both value and display text).
 * @param {number}   i       - Child index (1-based).
 * @returns {string} HTML string for the form group.
 */

function buildSelectInput(fieldId, label, options, i) {
  const optionsHtml = options.map(o => `<option value="${o}">${o}</option>`).join('');
  return `<div class="form-group">
      <label for="${fieldId}-kind-${i}">${label} <span class="req">*</span></label>
      <select id="${fieldId}-kind-${i}" name="${fieldId}-kind-${i}" required>
        <option value="" disabled selected>Bitte waehlen</option>
        ${optionsHtml}
      </select>
    </div>`;
}

/**
 * Builds the HTML markup for the grade / school-type row of a child block.
 * @param {number} i - Child index (1-based).
 * @returns {string} HTML string for the form row.
 */

function buildClassRow(i) {
  return `<div class="form-row">
    ${buildSelectInput('klasse',   'Klasse',   GRADE_OPTIONS,       i)}
    ${buildSelectInput('schulart', 'Schulart', SCHOOL_TYPE_OPTIONS, i)}
  </div>`;
}

/**
 * Builds the HTML markup for the optional school-name field of a child block.
 * @param {number} i - Child index (1-based).
 * @returns {string} HTML string for the form group.
 */

function buildSchoolField(i) {
  return `<div class="form-group">
    <label for="schule-kind-${i}">Schule / Ort</label>
    <input type="text" id="schule-kind-${i}" name="schule-kind-${i}"
      placeholder="z.B. Hans-Thoma-Realschule Kenzingen" maxlength="80">
  </div>`;
}

/**
 * Creates a complete child-block DOM element for the given index.
 * @param {number} i - Child index (1-based).
 * @returns {HTMLDivElement} The assembled child block element.
 */

function createChildBlock(i) {
  const block = document.createElement('div');
  block.className = 'kind-block';
  block.innerHTML = `<div class="kind-label">Kind ${i}</div>
    ${buildNameRow(i)}
    ${buildClassRow(i)}
    ${buildSchoolField(i)}`;
  return block;
}

/**
 * Restores previously saved input values into a child block's fields.
 * @param {number}      i      - Child index (1-based).
 * @param {ChildValues} values - Saved values to restore.
 */

function restoreChildValues(i, values) {
  if (!values) return;
  const set = (id, val) => { if (val) document.getElementById(id).value = val; };
  set(`vorname-kind-${i}`,  values.firstName);
  set(`nachname-kind-${i}`, values.lastName);
  set(`klasse-kind-${i}`,   values.grade);
  set(`schulart-kind-${i}`, values.schoolType);
  set(`schule-kind-${i}`,   values.schoolName);
}

/**
 * Renders child input blocks into #kinder-felder, preserving any already-entered values.
 * @param {number} count - Number of child blocks to render.
 */

function renderChildFields(count) {
  const container = document.getElementById('kinder-felder');
  const saved = saveChildValues(container);
  container.innerHTML = '';
  for (let i = 1; i <= count; i++) {
    container.appendChild(createChildBlock(i));
    restoreChildValues(i, saved[i]);
  }
}

/**
 * Ensures the rendered child blocks match the count from #kinder-anzahl,
 * re-rendering if they differ.
 * @returns {number} The validated child count, or 0 if the selection is invalid.
 */

function ensureChildFields() {
  const select = document.getElementById('kinder-anzahl');
  if (!select) return 0;
  const count = parseInt(select.value);
  if (!Number.isFinite(count) || count < 1) return 0;
  if (document.querySelectorAll('.kind-block').length !== count) renderChildFields(count);
  return count;
}

// Guard against pages where #kinder-anzahl does not exist (e.g. index.html).
// Listen for both 'change' and 'input' to catch autofill and programmatic changes.

const childCountSelect = document.getElementById('kinder-anzahl');
if (childCountSelect) {
  ['change', 'input'].forEach(ev =>
    childCountSelect.addEventListener(ev, function () {
      const val = parseInt(this.value);
      if (Number.isFinite(val) && val >= 1) renderChildFields(val);
    })
  );
}

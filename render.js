// ==========================================
// DYNAMIC HTML RENDERING
// ==========================================

function renderChildFields(count) {
  const container = document.getElementById('kinder-felder');

  // Preserve existing input values before clearing
  const saved = {};
  container.querySelectorAll('.kind-block').forEach((_, idx) => {
    const i = idx + 1;
    saved[i] = {
      firstName: (document.getElementById(`vorname-kind-${i}`)  || {}).value || '',
      lastName:  (document.getElementById(`nachname-kind-${i}`) || {}).value || '',
      grade:     (document.getElementById(`klasse-kind-${i}`)   || {}).value || '',
      schoolType:(document.getElementById(`schulart-kind-${i}`) || {}).value || '',
      schoolName:(document.getElementById(`schule-kind-${i}`)   || {}).value || '',
    };
  });

  container.innerHTML = '';
  for (let i = 1; i <= count; i++) {
    const block = document.createElement('div');
    block.className = 'kind-block';
    block.innerHTML =
      '<div class="kind-label">Kind ' + i + '</div>' +
      '<div class="form-row">' +
        '<div class="form-group">' +
          '<label for="vorname-kind-' + i + '">Vorname <span class="req">*</span></label>' +
          '<input type="text" id="vorname-kind-' + i + '" name="vorname-kind-' + i + '" placeholder="Vorname des Kindes" required' +
                 ' maxlength="60" pattern="[A-Za-zÄÖÜäöüß\\-\\s]{2,60}"' +
                 ' title="Bitte nur Buchstaben, Leerzeichen und Bindestriche verwenden">' +
        '</div>' +
        '<div class="form-group">' +
          '<label for="nachname-kind-' + i + '">Nachname <span class="req">*</span></label>' +
          '<input type="text" id="nachname-kind-' + i + '" name="nachname-kind-' + i + '" placeholder="Nachname des Kindes" required' +
                 ' maxlength="60" pattern="[A-Za-zÄÖÜäöüß\\-\\s]{2,60}"' +
                 ' title="Bitte nur Buchstaben, Leerzeichen und Bindestriche verwenden">' +
        '</div>' +
      '</div>' +
      '<div class="form-row">' +
        '<div class="form-group">' +
          '<label for="klasse-kind-' + i + '">Klasse <span class="req">*</span></label>' +
          '<select id="klasse-kind-' + i + '" name="klasse-kind-' + i + '" required>' +
            '<option value="" disabled selected>Bitte waehlen</option>' +
            '<option value="Klasse 7">Klasse 7</option>' +
            '<option value="Klasse 8">Klasse 8</option>' +
            '<option value="Klasse 9">Klasse 9</option>' +
            '<option value="Klasse 10">Klasse 10</option>' +
          '</select>' +
        '</div>' +
        '<div class="form-group">' +
          '<label for="schulart-kind-' + i + '">Schulart <span class="req">*</span></label>' +
          '<select id="schulart-kind-' + i + '" name="schulart-kind-' + i + '" required>' +
            '<option value="" disabled selected>Bitte waehlen</option>' +
            '<option value="Werkrealschule">Werkrealschule</option>' +
            '<option value="Realschule">Realschule</option>' +
            '<option value="Gymnasium">Gymnasium</option>' +
            '<option value="Gemeinschaftsschule">Gemeinschaftsschule</option>' +
          '</select>' +
        '</div>' +
      '</div>' +
      '<div class="form-group">' +
        '<label for="schule-kind-' + i + '">Schule / Ort</label>' +
        '<input type="text" id="schule-kind-' + i + '" name="schule-kind-' + i + '" placeholder="z.B. Hans-Thoma-Realschule Kenzingen" maxlength="80">' +
      '</div>';
    container.appendChild(block);

    // Restore values for blocks that already existed
    if (saved[i]) {
      const s = saved[i];
      if (s.firstName)  document.getElementById(`vorname-kind-${i}`).value  = s.firstName;
      if (s.lastName)   document.getElementById(`nachname-kind-${i}`).value = s.lastName;
      if (s.grade)      document.getElementById(`klasse-kind-${i}`).value   = s.grade;
      if (s.schoolType) document.getElementById(`schulart-kind-${i}`).value = s.schoolType;
      if (s.schoolName) document.getElementById(`schule-kind-${i}`).value   = s.schoolName;
    }
  }
}

// Guard against pages where #kinder-anzahl does not exist (e.g. index.html)
const childCountSelect = document.getElementById('kinder-anzahl');
if (childCountSelect) {
  // Listen for both 'change' and 'input' to catch autofill and programmatic changes
  ['change', 'input'].forEach(ev =>
    childCountSelect.addEventListener(ev, function() {
      const val = parseInt(this.value);
      if (Number.isFinite(val) && val >= 1) renderChildFields(val);
    })
  );
}

// Ensures child fields exist and match the selected count. Returns the count, or 0 on failure.
function ensureChildFields() {
  const select = document.getElementById('kinder-anzahl');
  if (!select) return 0;
  const count = parseInt(select.value);
  if (!Number.isFinite(count) || count < 1) return 0;
  if (document.querySelectorAll('.kind-block').length !== count) {
    renderChildFields(count);
  }
  return count;
}

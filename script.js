// ==========================================
// FAQ ACCORDION
// ==========================================
document.querySelectorAll('.faq-q').forEach(function(question) {
  question.addEventListener('click', function() {
    const item = question.parentElement;
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(function(el) { el.classList.remove('open'); });
    if (!wasOpen) item.classList.add('open');
  });
});

// emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

// ==========================================
// UTILITIES
// ==========================================
function escapeText(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .trim();
}

// ==========================================
// FORM PROTECTION & VALIDATION
// ==========================================
function isSpam() {
  const honeypot = document.getElementById('website');
  return !!(honeypot && honeypot.value.trim() !== '');
}

function setButtonLoadingState(button, isLoading, originalText = '') {
  button.disabled = isLoading;
  button.textContent = isLoading ? 'Wird zur Zahlung weitergeleitet …' : originalText;
}

function markInputInvalid(element) {
  element.style.borderColor = '#E07B54';
  return false;
}

function validateRequiredFields(form) {
  let isValid = true;
  form.querySelectorAll('[required]').forEach(el => {
    el.style.borderColor = '';
    const isEmpty   = (el.type === 'checkbox' && !el.checked) || (el.type !== 'checkbox' && !el.value.trim());
    const isInvalid = el.type !== 'checkbox' && el.value.trim() && !el.checkValidity();
    if (isEmpty || isInvalid) {
      isValid = markInputInvalid(el);
    }
  });
  return isValid;
}

function focusFirstError(form) {
  const firstError = form.querySelector('[required][style*="E07B54"]');
  if (firstError) {
    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

// ==========================================
// DATA EXTRACTION
// ==========================================
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

function buildChildrenText(count) {
  const children = Array.from({ length: count }, (_, i) => extractChildData(i + 1));
  return children.map((child, idx) => {
    const schoolSuffix = child.schoolName !== '–' ? ` (${child.schoolName})` : '';
    return `Kind ${idx + 1}: ${child.firstName} ${child.lastName} – ${child.grade}, ${child.schoolType}${schoolSuffix}`;
  }).join(' | ');
}

function collectFormData(childCount) {
  const appointmentKey = document.getElementById('wunschtermin').value;
  return {
    timestamp:         new Date().toLocaleString('de-DE', { dateStyle: 'full', timeStyle: 'short' }),
    firstName:         escapeText(document.getElementById('vorname').value),
    lastName:          escapeText(document.getElementById('nachname').value),
    email:             document.getElementById('email').value.trim().toLowerCase(),
    phone:             escapeText(document.getElementById('telefon').value) || '–',
    address:           escapeText(document.getElementById('adresse').value),
    childCount:        childCount,
    childrenText:      buildChildrenText(childCount),
    appointmentKey:    appointmentKey,
    appointmentLabel:  CONFIG.appointmentLabels[appointmentKey] || '–',
    message:           escapeText(document.getElementById('nachricht').value) || '–',
    paymentStatus:     'Wartet auf Zahlung'
  };
}

// ==========================================
// API & REDIRECT
// ==========================================
function sendToN8n(data) {
  return fetch(CONFIG.n8nWebhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  .then(res => {
    if (!res.ok) throw new Error('n8n transmission failed');
    console.log('✅ Daten erfolgreich an n8n übertragen');
  })
  .catch(err => console.error('❌ Fehler:', err));
}

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
const bookingForm = document.getElementById('booking-form');
if (bookingForm) {
  bookingForm.addEventListener('submit', function(e) {
    e.preventDefault();

    if (isSpam()) return console.warn('Spam-Versuch erkannt');

    const submitBtn       = this.querySelector('.btn-submit');
    const originalBtnText = submitBtn.textContent;

    if (submitBtn.disabled) return;
    setButtonLoadingState(submitBtn, true);

    // Guarantee fields exist and count matches the select value
    const childCount = ensureChildFields();
    if (!childCount) {
      markInputInvalid(document.getElementById('kinder-anzahl'));
      setButtonLoadingState(submitBtn, false, originalBtnText);
      return;
    }

    if (!validateRequiredFields(this)) {
      focusFirstError(this);
      setButtonLoadingState(submitBtn, false, originalBtnText);
      return;
    }

    let data;
    try {
      data = collectFormData(childCount);
    } catch (err) {
      console.error('❌ Fehler beim Einlesen der Kinderdaten:', err);
      setButtonLoadingState(submitBtn, false, originalBtnText);
      return;
    }

    sendToN8n(data).then(() => {
      redirectToDigistore(data);
    });
  });
}


  // document.getElementById('booking-form').addEventListener('submit', function(e) {
  //   e.preventDefault();

  //   // Spam-Schutz: Honeypot-Feld darf nicht befuellt sein (nur Bots fuellen unsichtbare Felder)
  //   const honeypot = document.getElementById('website');
  //   if (honeypot && honeypot.value.trim() !== '') {
  //     console.warn('Spam-Versuch erkannt – Anmeldung verworfen');
  //     return;
  //   }

  //   const submitBtn = this.querySelector('.btn-submit');
  //   if (submitBtn.disabled) return; // doppeltes Absenden verhindern
  //   submitBtn.disabled = true;
  //   const originalBtnText = submitBtn.textContent;
  //   submitBtn.textContent = 'Wird gesendet …';

  //   const reaktivieren = function() {
  //     submitBtn.disabled = false;
  //     submitBtn.textContent = originalBtnText;
  //   };

  //   // Pflichtfelder + Eingabemuster (pattern) pruefen
  //   const required = this.querySelectorAll('[required]');
  //   let valid = true;
  //   required.forEach(function(el) {
  //     el.style.borderColor = '';
  //     const leer = (el.type === 'checkbox' && !el.checked) || (el.type !== 'checkbox' && !el.value.trim());
  //     const ungueltig = el.type !== 'checkbox' && el.value.trim() && !el.checkValidity();
  //     if (leer || ungueltig) {
  //       el.style.borderColor = '#E07B54';
  //       valid = false;
  //     }
  //   });
  //   if (!valid) {
  //     const first = this.querySelector('[required][style*="E07B54"]');
  //     if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
  //     reaktivieren();
  //     return;
  //   }

  //   const jetzt = new Date().toLocaleString('de-DE', { dateStyle: 'full', timeStyle: 'short' });

  //   const kinderAnzahl = parseInt(document.getElementById('kinder-anzahl').value) || 1;
  //   const kinderDetails = [];
  //   for (let i = 1; i <= kinderAnzahl; i++) {
  //     const vorname  = document.getElementById('vorname-kind-' + i);
  //     const nachname = document.getElementById('nachname-kind-' + i);
  //     const klasse   = document.getElementById('klasse-kind-' + i);
  //     const schulart = document.getElementById('schulart-kind-' + i);
  //     const schule   = document.getElementById('schule-kind-' + i);
  //     kinderDetails.push({
  //       vorname:  vorname  ? sicherFuerText(vorname.value)  : '–',
  //       nachname: nachname ? sicherFuerText(nachname.value) : '–',
  //       klasse:   klasse   ? sicherFuerText(klasse.value)    : '–',
  //       schulart: schulart ? sicherFuerText(schulart.value)  : '–',
  //       schule:   schule   ? (sicherFuerText(schule.value) || '–') : '–',
  //     });
  //   }
  //   const kinderText = kinderDetails.map(function(k, idx) {
  //     return 'Kind ' + (idx+1) + ': ' + k.vorname + ' ' + k.nachname + ' – ' +
  //            k.klasse + ', ' + k.schulart + (k.schule !== '–' ? ' (' + k.schule + ')' : '');
  //   }).join(' | ');

  //   const terminMap = {
  //     'august-1': '03. – 08. August (vormittags)',
  //     'august-2': '10. – 14. August (vormittags)',
  //     'beide':    'Beide Termine möglich'
  //   };

  //   const daten = {
  //     zeitpunkt:   jetzt,
  //     vorname:     sicherFuerText(document.getElementById('vorname').value),
  //     nachname:    sicherFuerText(document.getElementById('nachname').value),
  //     email:       document.getElementById('email').value.trim().toLowerCase(),
  //     telefon:     sicherFuerText(document.getElementById('telefon').value) || '–',
  //     adresse:     sicherFuerText(document.getElementById('adresse').value),
  //     kinder:      kinderAnzahl,
  //     kinder_text: kinderText,
  //     termin:      document.getElementById('wunschtermin').value,
  //     nachricht:   sicherFuerText(document.getElementById('nachricht').value) || '–',
  //   };
  //   daten.termin_text = terminMap[daten.termin] || '–';

  //   // 1a) Benachrichtigung an Rein Campus
  //   const mailAnRC = emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
  //     to_email:    'service@rein-campus.de',
  //     zeitpunkt:   daten.zeitpunkt,
  //     vorname:     daten.vorname,
  //     nachname:    daten.nachname,
  //     email:       daten.email,
  //     telefon:     daten.telefon,
  //     adresse:     daten.adresse,
  //     kinder:      daten.kinder,
  //     kinder_text: daten.kinder_text,
  //     termin_text: daten.termin_text,
  //     nachricht:   daten.nachricht,
  //   });

  //   // 1b) Bestaetigungsmail an Kunden
  //   // Empfohlener Template-Inhalt:
  //   // Betreff: Deine Anmeldung zum KI-Fuehrerschein - Rein Campus
  //   // Hallo {{vorname}} {{nachname}}, vielen Dank fuer deine Anmeldung zum
  //   // KI-Fuehrerschein fuer Schuelerinnen und Schueler! Wir haben deine Anfrage
  //   // erhalten und melden uns in Kuerze bei dir.
  //   // Gewuenschter Termin: {{termin_text}}  |  Anzahl Kinder: {{kinder}}
  //   // Bei Fragen: 07644 9294280 / service@rein-campus.de
  //   const mailAnKunde = emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_CONFIRM_TEMPLATE_ID, {
  //     to_email:    daten.email,
  //     vorname:     daten.vorname,
  //     nachname:    daten.nachname,
  //     termin_text: daten.termin_text,
  //     kinder:      daten.kinder,
  //   });

  //   Promise.allSettled([mailAnRC, mailAnKunde]).then(function(results) {
  //     results.forEach(function(r, i) {
  //       const label = i === 0 ? 'Benachrichtigung an Rein Campus' : 'Bestätigungsmail an Kunden';
  //       if (r.status === 'fulfilled') {
  //         console.log('✅ ' + label + ' gesendet');
  //       } else {
  //         console.error('❌ ' + label + ' fehlgeschlagen:', r.reason);
  //       }
  //     });
  //   });

  //   // Erfolgsseite zeigen
  //   document.getElementById('form-wrap').style.display = 'none';
  //   document.getElementById('success-msg').style.display = 'block';
  //   window.scrollTo({ top: 0, behavior: 'smooth' });
  // });

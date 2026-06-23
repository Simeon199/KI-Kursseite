document.querySelectorAll('.faq-q').forEach(function(q) {
    q.addEventListener('click', function() {
      const item = q.parentElement;
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function(el) { el.classList.remove('open'); });
      if (!wasOpen) item.classList.add('open');
    });
  });

  // ═══════════════════════════════════════════════════════
  const EMAILJS_PUBLIC_KEY          = 'YOUR_PUBLIC_KEY';
  const EMAILJS_SERVICE_ID          = 'YOUR_SERVICE_ID';
  const EMAILJS_TEMPLATE_ID         = 'YOUR_TEMPLATE_ID';          // Benachrichtigung an service@rein-campus.de
  const EMAILJS_CONFIRM_TEMPLATE_ID = 'YOUR_CONFIRM_TEMPLATE_ID';  // Bestaetigung an Kunden
  // ═══════════════════════════════════════════════════════

  // emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

  function kinderfelderGenerieren(anzahl) {
    const container = document.getElementById('kinder-felder');
    container.innerHTML = '';
    for (let i = 1; i <= anzahl; i++) {
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
    }
  }

  document.getElementById('kinder-anzahl').addEventListener('change', function() {
    kinderfelderGenerieren(parseInt(this.value));
  });

  // Grundlegendes Escaping, falls Werte irgendwo als HTML interpretiert werden
  function sicherFuerText(wert) {
    return String(wert == null ? '' : wert)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .trim();
  }

  document.getElementById('booking-form').addEventListener('submit', function(e) {
    e.preventDefault();

    // Spam-Schutz: Honeypot-Feld darf nicht befuellt sein (nur Bots fuellen unsichtbare Felder)
    const honeypot = document.getElementById('website');
    if (honeypot && honeypot.value.trim() !== '') {
      console.warn('Spam-Versuch erkannt – Anmeldung verworfen');
      return;
    }

    const submitBtn = this.querySelector('.btn-submit');
    if (submitBtn.disabled) return; // doppeltes Absenden verhindern
    submitBtn.disabled = true;
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = 'Wird gesendet …';

    const reaktivieren = function() {
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
    };

    // Pflichtfelder + Eingabemuster (pattern) pruefen
    const required = this.querySelectorAll('[required]');
    let valid = true;
    required.forEach(function(el) {
      el.style.borderColor = '';
      const leer = (el.type === 'checkbox' && !el.checked) || (el.type !== 'checkbox' && !el.value.trim());
      const ungueltig = el.type !== 'checkbox' && el.value.trim() && !el.checkValidity();
      if (leer || ungueltig) {
        el.style.borderColor = '#E07B54';
        valid = false;
      }
    });
    if (!valid) {
      const first = this.querySelector('[required][style*="E07B54"]');
      if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
      reaktivieren();
      return;
    }

    const jetzt = new Date().toLocaleString('de-DE', { dateStyle: 'full', timeStyle: 'short' });

    const kinderAnzahl = parseInt(document.getElementById('kinder-anzahl').value) || 1;
    const kinderDetails = [];
    for (let i = 1; i <= kinderAnzahl; i++) {
      const vorname  = document.getElementById('vorname-kind-' + i);
      const nachname = document.getElementById('nachname-kind-' + i);
      const klasse   = document.getElementById('klasse-kind-' + i);
      const schulart = document.getElementById('schulart-kind-' + i);
      const schule   = document.getElementById('schule-kind-' + i);
      kinderDetails.push({
        vorname:  vorname  ? sicherFuerText(vorname.value)  : '–',
        nachname: nachname ? sicherFuerText(nachname.value) : '–',
        klasse:   klasse   ? sicherFuerText(klasse.value)    : '–',
        schulart: schulart ? sicherFuerText(schulart.value)  : '–',
        schule:   schule   ? (sicherFuerText(schule.value) || '–') : '–',
      });
    }
    const kinderText = kinderDetails.map(function(k, idx) {
      return 'Kind ' + (idx+1) + ': ' + k.vorname + ' ' + k.nachname + ' – ' +
             k.klasse + ', ' + k.schulart + (k.schule !== '–' ? ' (' + k.schule + ')' : '');
    }).join(' | ');

    const terminMap = {
      'august-1': '03. – 08. August (vormittags)',
      'august-2': '10. – 14. August (vormittags)',
      'beide':    'Beide Termine möglich'
    };

    const daten = {
      zeitpunkt:   jetzt,
      vorname:     sicherFuerText(document.getElementById('vorname').value),
      nachname:    sicherFuerText(document.getElementById('nachname').value),
      email:       document.getElementById('email').value.trim().toLowerCase(),
      telefon:     sicherFuerText(document.getElementById('telefon').value) || '–',
      adresse:     sicherFuerText(document.getElementById('adresse').value),
      kinder:      kinderAnzahl,
      kinder_text: kinderText,
      termin:      document.getElementById('wunschtermin').value,
      nachricht:   sicherFuerText(document.getElementById('nachricht').value) || '–',
    };
    daten.termin_text = terminMap[daten.termin] || '–';

    // 1a) Benachrichtigung an Rein Campus
    const mailAnRC = emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      to_email:    'service@rein-campus.de',
      zeitpunkt:   daten.zeitpunkt,
      vorname:     daten.vorname,
      nachname:    daten.nachname,
      email:       daten.email,
      telefon:     daten.telefon,
      adresse:     daten.adresse,
      kinder:      daten.kinder,
      kinder_text: daten.kinder_text,
      termin_text: daten.termin_text,
      nachricht:   daten.nachricht,
    });

    // 1b) Bestaetigungsmail an Kunden
    // Empfohlener Template-Inhalt:
    // Betreff: Deine Anmeldung zum KI-Fuehrerschein - Rein Campus
    // Hallo {{vorname}} {{nachname}}, vielen Dank fuer deine Anmeldung zum
    // KI-Fuehrerschein fuer Schuelerinnen und Schueler! Wir haben deine Anfrage
    // erhalten und melden uns in Kuerze bei dir.
    // Gewuenschter Termin: {{termin_text}}  |  Anzahl Kinder: {{kinder}}
    // Bei Fragen: 07644 9294280 / service@rein-campus.de
    const mailAnKunde = emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_CONFIRM_TEMPLATE_ID, {
      to_email:    daten.email,
      vorname:     daten.vorname,
      nachname:    daten.nachname,
      termin_text: daten.termin_text,
      kinder:      daten.kinder,
    });

    Promise.allSettled([mailAnRC, mailAnKunde]).then(function(results) {
      results.forEach(function(r, i) {
        const label = i === 0 ? 'Benachrichtigung an Rein Campus' : 'Bestätigungsmail an Kunden';
        if (r.status === 'fulfilled') {
          console.log('✅ ' + label + ' gesendet');
        } else {
          console.error('❌ ' + label + ' fehlgeschlagen:', r.reason);
        }
      });
    });

    // Erfolgsseite zeigen
    document.getElementById('form-wrap').style.display = 'none';
    document.getElementById('success-msg').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
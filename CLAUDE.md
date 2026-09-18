# CLAUDE.md

Diese Datei gibt Claude Code (claude.ai/code) Hinweise zur Arbeit in diesem Repository.

## Lokale Entwicklung

Keine Build-Tools oder Paketverwaltung vorhanden. Das Projektverzeichnis mit einem beliebigen Static-File-Server starten:

```bash
python -m http.server 8080
# oder
npx serve .
```

Landingpage: `http://localhost:8080`  
Anmeldeformular: `http://localhost:8080/booking/booking.html`

## Architektur

Reine Vanilla-JS-Webseite ohne Framework oder Bundler.

**Seiten**

- `index.html` — Kurs-Landingpage mit FAQ-Akkordeon
- `booking/booking.html` — Anmeldeformular; lädt alle drei JS-Dateien

**JavaScript-Dateien** (als einfache `<script>`-Tags eingebunden, Reihenfolge relevant)

- `config.js` — Einziges `CONFIG`-Objekt mit n8n-Webhook-URL, Digistore24-Checkout-URL und der Zuordnung von Terminschlüsseln zu lesbaren Labels. URL-Änderungen ausschließlich hier vornehmen.
- `render.js` — Baut die Kind-Eingabeblöcke dynamisch auf Basis des `#kinder-anzahl`-Selects auf und rendert sie bei Änderung neu. Bereits eingegebene Werte bleiben dabei erhalten.
- `script.js` — FAQ-Akkordeon sowie der vollständige Formular-Submit-Ablauf: Honeypot-Spamschutz (`#website`), Pflichtfeldvalidierung (rote Umrandung `#E07B54` bei Fehler), Datenzusammenstellung per `collectFormData()`, POST an n8n via `sendToN8n()`, anschließend Weiterleitung zu Digistore24 via `redirectToDigistore()`.

## Ablauf des Anmeldeformulars

```
Nutzer wählt Kinderanzahl
  → render.js rendert N Kind-Blöcke und stellt zuvor eingegebene Werte wieder her

Nutzer sendet Formular ab
  → Spam-Prüfung (Honeypot #website muss leer sein)
  → validateRequiredFields() — markiert ungültige Felder, scrollt zum ersten Fehler
  → collectFormData() — bereinigt und bündelt alle Felder in einem Objekt
  → sendToN8n() — Fire-and-forget-POST an CONFIG.n8nWebhookUrl
  → redirectToDigistore() — window.location auf CONFIG.digistoreBaseUrl?email=…&first_name=…&last_name=…
```

## Externe Anbindungen

Beide URLs befinden sich ausschließlich in `config.js`:

- **n8n-Webhook** — empfängt die Formulardaten als JSON; Fehler werden abgefangen und geloggt, blockieren die Weiterleitung aber nicht
- **Digistore24** — Zahlungs-Checkout, vorausgefüllt mit Name und E-Mail als Query-Parameter

## Regeln

- Installiere keine npm packages selber
- Jede Änderung in logs/debug.log dokumentieren
- Keine neuen Dateien ohne Rückfrage anlegen
- Stelle bei HTML und CSS-Aufgaben immer auch das responsive Verhalten der Webseite (bis 320px Bildschirmauflösung) sicher.
- Stelle sicher, dass keine Datei mehr als 400 Zeilen und keine JavaScript-Funktion mehr als 16 Zeilen Code enthält. Halte die Clean-Code-Prinzipien ein und lagere Funktionalitäten notfalls in Hilfsfunktionen aus, um alle Methoden schlank, lesbar und wartbar zu halten. Jede JavaScript-Funktion sollte - im Optimalfall - genau eine Aufgabe erfüllen.
- Wenn sich CSS-Aufgaben mit der Flexbox beziehungsweise mit Grid lösen lassen, so präferiere stets den Flexbox-Ansatz.
- Dokumentiere neu hinzugefügte JavaScript Funktionen automatisch nach JSDoc-Standard in englischer Sprache.
- Dokumentiere vorgenommene Änderungen stets in der debugs.log Datei.

## Verhalten

- Wenn Anforderungen unklar sind: nachfragen, nicht raten
- Lieber eine kurze Rückfrage als falsch umsetzen
- Bei größeren Aufgaben erst den Plan zeigen, dann umsetzen

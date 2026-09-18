# CLAUDE.md

Diese Datei gibt Claude Code (claude.ai/code) Hinweise zur Arbeit in diesem Repository.

## Architektur

Reine Vanilla-JS-Webseite ohne Framework oder Bundler.

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

### Commit Types

| Commit-Typ | Bedeutung                          | Wann verwenden?                                                                                    | Beispiel                                          |
| ---------- | ---------------------------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| `feat`     | Neue Funktionalität                | Für neue Features, z. B. das Hinzufügen einer neuen Anmeldeseite                                   | `feat: add login page`                            |
| `fix`      | Fehlerbehebung                     | Für Bugfixes, z. B. das Beheben von Problemen mit der Skalierung von Bildern auf mobilen Geräten   | `fix: resolve bug with image loading flicker`     |
| `docs`     | Dokumentation                      | Änderungen an der Dokumentation                                                                    | `docs: update README with new setup instructions` |
| `style`    | Code-Formatierung                  | Änderungen, die nur das Format betreffen (z. B. Leerzeichen, Formatierungen), ohne Code-Änderungen | `style: fix indentation in main.js`               |
| `refactor` | Code-Änderung ohne Bugfix/Funktion | Refaktorisierung von Code, z. B. Vereinfachung oder Umstrukturierung                               | `refactor: simplify login flow logic`             |
| `perf`     | Code-Performance-Optimierung       | Änderungen zur Verbesserung der Leistung                                                           | `perf: code shortened to under 400 lines`         |
| `test`     | Tests                              | Hinzufügen oder Ändern von Tests                                                                   | `test: add unit tests for login component`        |

/**
 * @fileoverview Course finder: recommends a course based on the chosen audience.
 * @module course-finder
 */

/** Recommendation per audience: [title, text, target link]. */
const RECOMMENDATIONS = {
  kind:   ['KI-Entdecker', 'Drei spielerische Ferien-Vormittage für Klasse 4–6.', '#jugendliche'],
  teen:   ['KI-Führerschein', 'Unser Bestseller: 5 Einheiten mit Zertifikat für Klasse 7–10.', '#jugendliche'],
  me:     ['KI-Starter am Abend oder KI-Praxistag',
    'Vier Abende zum Einstieg oder ein kompakter Samstag mit Ihren eigenen Aufgaben.', '#berufstaetige'],
  senior: ['KI ganz entspannt',
    'Vier ruhige Vormittage in kleiner Gruppe. Für einen kurzen Einstieg eignet sich der Vortrag „Echt oder Fälschung?“.',
    '#senioren'],
  team:   ['Angebote für Unternehmen',
    'Workshops für Ihr Team, zugeschnitten auf Ihre Abläufe, mit Nachweis für den EU AI Act.', 'pages/firmen.html']
};

/**
 * Marks exactly one chip as pressed.
 * @param {HTMLElement} pressed - The chip that was clicked.
 * @returns {void}
 */
function markChip(pressed) {
  document.querySelectorAll('.chip').forEach(chip => chip.setAttribute('aria-pressed', 'false'));
  pressed.setAttribute('aria-pressed', 'true');
}

/**
 * Writes the recommendation for an audience into the result box.
 * @param {string} audience - Key of RECOMMENDATIONS.
 * @returns {void}
 */
function showRecommendation(audience) {
  const [title, text, href] = RECOMMENDATIONS[audience];
  document.getElementById('finder-title').textContent = 'Unsere Empfehlung: ' + title;
  document.getElementById('finder-text').textContent = text;
  document.getElementById('finder-link').setAttribute('href', href);
  document.getElementById('finder-result').classList.add('show');
}

/**
 * Wires up the audience chips of the course finder.
 * @returns {void}
 */
export function initCourseFinder() {
  document.querySelector('.chips').addEventListener('click', event => {
    const chip = event.target.closest('.chip');
    if (!chip) return;
    markChip(chip);
    showRecommendation(chip.dataset.v);
  });
}

/**
 * @fileoverview Result screen rendering of the learning-path quiz.
 * @module quiz-results
 */
import { ICONS, TYPES, TYPE_ORDER } from './quiz-types.js';
import { $ } from './quiz-render.js';

/**
 * Renders one tip as list item, with an optional bold lead.
 * @param {{lead?: string, text: string}} tip - The tip to render.
 * @returns {string}
 */
function renderTip(tip) {
  if (tip.lead) return `<li><strong>${tip.lead}</strong> ${tip.text}</li>`;
  return `<li>${tip.text}</li>`;
}

/**
 * Wraps texts into paragraph elements.
 * @param {string[]} texts - Paragraph contents.
 * @returns {string}
 */
function paragraphs(texts) {
  return texts.map(p => `<p>${p}</p>`).join('');
}

/**
 * Builds the icon, title and tagline row of a result.
 * @param {string} iconKey - Type key of the icon to show.
 * @param {string} titleHtml - Inner HTML of the title.
 * @param {string} tagline - Tagline below the title.
 * @returns {string}
 */
function nameRow(iconKey, titleHtml, tagline) {
  return `<div class="result-name-row"><div class="result-icon">${ICONS[iconKey]}</div>` +
    `<div><h2 class="result-title">${titleHtml}</h2><p class="result-tagline">${tagline}</p></div></div>`;
}

/**
 * Builds the result markup for the case that nothing was scored.
 * @returns {string}
 */
function buildEmptyResult() {
  return '<h2 class="result-title">Noch unklar</h2><div class="result-desc"><p>Es wurden noch keine ' +
    'eindeutigen Antworten gewertet. Mach den Test noch einmal und wähle bei jeder Frage die Antwort, ' +
    'die am besten zu dir passt.</p></div>';
}

/**
 * Builds the result markup for exactly one leading type.
 * @param {string} key - Type key.
 * @returns {string}
 */
function buildSingleResult(key) {
  const t = TYPES[key];
  return nameRow(key, `Der ${t.name}`, t.tagline) +
    `<div class="result-desc">${paragraphs(t.paragraphs)}</div>` +
    `<h3 class="result-tips-heading">${t.tipsHeading}</h3>` +
    `<ul class="tips-list">${t.tips.map(renderTip).join('')}</ul>` +
    `<h3 class="result-tips-heading">${t.importantHeading}</h3>` +
    `<div class="result-important">${paragraphs(t.importantParagraphs)}</div>` +
    `<p class="result-strength"><strong>Deine Stärke:</strong> ${t.resultStrength}</p>`;
}

/**
 * Builds the result markup for several equally strong types.
 * @param {string[]} top - Type keys.
 * @returns {string}
 */
function buildMixedResult(top) {
  const names = top.map(k => TYPES[k].name).join('-');
  const tips = top.flatMap(k => TYPES[k].tips).slice(0, 6);
  const strengths = top.map(k => `${TYPES[k].name}: ${TYPES[k].resultStrength}`).join(' &middot; ');
  const intro = top.map(k => `<p>${TYPES[k].tagline} ${TYPES[k].paragraphs[0]}</p>`).join('');
  return nameRow(top[0], `Du bist ein <em>${names}</em>-Mischtyp`, 'Mehrere Lernwege liegen dir etwa gleich gut.') +
    `<div class="result-desc">${intro}</div>` +
    '<h3 class="result-tips-heading">Das kannst du beim Lernen ausprobieren:</h3>' +
    `<ul class="tips-list">${tips.map(renderTip).join('')}</ul>` +
    '<h3 class="result-tips-heading">Wichtig zu wissen</h3>' +
    '<div class="result-important"><p>Du profitierst von mehreren Lernwegen gleichzeitig – nutze das bewusst und ' +
    'wechsle zwischen den Strategien, je nachdem was du gerade lernst.</p></div>' +
    `<p class="result-strength"><strong>Deine Stärke:</strong> ${strengths}</p>`;
}

/**
 * Chooses and renders the result text for the leading types.
 * @param {string[]} top - Leading type keys.
 * @returns {void}
 */
export function renderResultBody(top) {
  let html = buildMixedResult(top);
  if (top.length === 0) html = buildEmptyResult();
  if (top.length === 1) html = buildSingleResult(top[0]);
  $('#result-body').innerHTML = html;
}

/**
 * Builds one bar row of the result chart.
 * @param {string} key - Type key.
 * @param {number} pct - Percentage of the type.
 * @param {boolean} isTop - Whether the type is a leading type.
 * @returns {HTMLElement}
 */
function buildBarRow(key, pct, isTop) {
  const row = document.createElement('div');
  row.className = 'bar-row' + (isTop ? ' top' : '');
  row.innerHTML = `<div class="bar-icon">${ICONS[key]}</div><div class="bar-body">` +
    `<div class="bar-label">Der ${TYPES[key].name}<span class="pct">${pct}%</span></div>` +
    `<div class="bar-track"><div class="bar-fill" data-pct="${pct}"></div></div></div>`;
  return row;
}

/**
 * Sets the bar widths after two frames so the CSS transition plays.
 * @returns {void}
 */
function animateBars() {
  requestAnimationFrame(() => requestAnimationFrame(() => {
    document.querySelectorAll('.bar-fill').forEach(el => {
      el.style.width = el.getAttribute('data-pct') + '%';
    });
  }));
}

/**
 * Renders the percentage chart of all learning types.
 * @param {Object.<string, number>} percents - Percentages per type.
 * @param {string[]} top - Leading type keys.
 * @returns {void}
 */
export function renderBars(percents, top) {
  const container = $('#bars');
  container.innerHTML = '';
  TYPE_ORDER.forEach(key => container.appendChild(buildBarRow(key, percents[key], top.includes(key))));
  animateBars();
}

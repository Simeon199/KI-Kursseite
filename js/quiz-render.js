/**
 * @fileoverview HTML rendering helpers of the learning-path quiz.
 * @module quiz-render
 */
import { QUESTIONS } from './quiz-questions.js';
import { ICONS, TYPES, TYPE_ORDER } from './quiz-types.js';

/**
 * Shortcut for document.querySelector.
 * @param {string} selector - CSS selector.
 * @returns {Element|null}
 */
export const $ = selector => document.querySelector(selector);

/**
 * Renders the four type cards of the intro screen.
 * @returns {void}
 */
export function renderTypeGrid() {
  $('#type-grid').innerHTML = TYPE_ORDER.map(key => {
    const t = TYPES[key];
    return `<div class="type-item"><div class="type-icon">${ICONS[key]}</div>` +
      `<h3>Der ${t.name}</h3><p>${t.short}</p>` +
      '<p class="type-strength"><span class="label">Deine Stärke:</span>' +
      `<span class="value">${t.strength}</span></p></div>`;
  }).join('');
}

/**
 * Renders the progress dots below the quiz card.
 * @param {number} step - Index of the current question.
 * @returns {void}
 */
export function renderDots(step) {
  $('#dots').innerHTML = QUESTIONS.map((_, i) => {
    const state = i < step ? ' done' : i === step ? ' active' : '';
    return `<span class="dot${state}"></span>`;
  }).join('');
}

/**
 * Renders the radio options of the current question.
 * @param {number} step - Index of the current question.
 * @param {number|null} selected - Previously chosen option index.
 * @param {function(number): void} onSelect - Called with the chosen index.
 * @returns {void}
 */
export function renderOptions(step, selected, onSelect) {
  const container = $('#quiz-options');
  container.innerHTML = '';
  QUESTIONS[step].options.forEach((opt, i) => {
    const row = document.createElement('label');
    row.className = 'option';
    row.innerHTML = `<input type="radio" name="q${step}" value="${i}"` +
      `${selected === i ? ' checked' : ''}><p>${opt.label}</p>`;
    row.querySelector('input').addEventListener('change', () => onSelect(i));
    container.appendChild(row);
  });
}

/**
 * Renders one full quiz step including navigation state.
 * @param {number} step - Index of the current question.
 * @param {number|null} selected - Previously chosen option index.
 * @param {function(number): void} onSelect - Called with the chosen index.
 * @returns {void}
 */
export function renderQuizStep(step, selected, onSelect) {
  const nextLabel = step === QUESTIONS.length - 1 ? 'Auswertung anzeigen' : 'weiter';
  $('#quiz-number').textContent = step + 1;
  $('#quiz-text').textContent = QUESTIONS[step].text;
  renderOptions(step, selected, onSelect);
  $('#btn-next').disabled = selected === null;
  $('#btn-next').innerHTML = `${nextLabel} <span aria-hidden="true">›</span>`;
  $('#btn-back').disabled = step === 0;
  renderDots(step);
}

/**
 * @fileoverview Entry point and state handling of the learning-path quiz.
 * @module quiz-page
 */
import { QUESTIONS } from './quiz-questions.js';
import { computeScores, computePercents, determineTop } from './quiz-scoring.js';
import { $, renderTypeGrid, renderQuizStep } from './quiz-render.js';
import { renderResultBody, renderBars } from './quiz-results.js';

let step = 0;
const chosen = new Array(QUESTIONS.length).fill(null);

/**
 * Shows exactly one of the three screens.
 * @param {'intro'|'quiz'|'results'} name - Screen to show.
 * @returns {void}
 */
function showScreen(name) {
  ['intro', 'quiz', 'results'].forEach(id => {
    $(`#screen-${id}`).style.display = id === name ? 'block' : 'none';
  });
  window.scrollTo({ top: 0, behavior: 'auto' });
}

/**
 * Stores the answer of the current question and enables the next button.
 * @param {number} index - Chosen option index.
 * @returns {void}
 */
function selectAnswer(index) {
  chosen[step] = index;
  $('#btn-next').disabled = false;
}

/**
 * Renders the current question.
 * @returns {void}
 */
function drawStep() {
  renderQuizStep(step, chosen[step], selectAnswer);
}

/**
 * Evaluates all answers and shows the result screen.
 * @returns {void}
 */
function showResults() {
  const percents = computePercents(computeScores(chosen));
  const top = determineTop(percents);
  renderResultBody(top);
  renderBars(percents, top);
  showScreen('results');
}

/**
 * Starts the quiz from the first question.
 * @returns {void}
 */
function startQuiz() {
  step = 0;
  drawStep();
  showScreen('quiz');
}

/**
 * Advances to the next question or to the results after the last one.
 * @returns {void}
 */
function goNext() {
  if (chosen[step] === null) return;
  if (step === QUESTIONS.length - 1) return showResults();
  step += 1;
  drawStep();
}

/**
 * Returns to the previous question.
 * @returns {void}
 */
function goBack() {
  if (step === 0) return;
  step -= 1;
  drawStep();
}

/**
 * Clears all answers and returns to the intro screen.
 * @returns {void}
 */
function restart() {
  chosen.fill(null);
  step = 0;
  showScreen('intro');
}

/**
 * Renders the intro and wires up all buttons.
 * @returns {void}
 */
function init() {
  renderTypeGrid();
  $('#start-test').addEventListener('click', startQuiz);
  $('#btn-next').addEventListener('click', goNext);
  $('#btn-back').addEventListener('click', goBack);
  $('#btn-restart').addEventListener('click', restart);
}

init();

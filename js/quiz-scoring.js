/**
 * @fileoverview Scoring logic of the learning-path quiz.
 * @module quiz-scoring
 */
import { QUESTIONS } from './quiz-questions.js';
import { TYPE_ORDER } from './quiz-types.js';

/** Maximum difference (in percent) to the best type for a type to count as "top". */
const TOP_TOLERANCE = 8;

/**
 * Creates an object with one zeroed counter per learning type.
 * @returns {Object.<string, number>}
 */
function emptyScores() {
  return Object.fromEntries(TYPE_ORDER.map(key => [key, 0]));
}

/**
 * Calculates the maximum reachable points per learning type.
 * @returns {Object.<string, number>}
 */
function computeMaxPerType() {
  const max = emptyScores();
  QUESTIONS.forEach(q => {
    if (q.type === 'likert') {
      max[q.target] += 2;
    } else {
      TYPE_ORDER.forEach(key => { max[key] += 1; });
    }
  });
  return max;
}

const MAX_PER_TYPE = computeMaxPerType();

/**
 * Adds the points of one chosen option to the running scores.
 * @param {Object.<string, number>} scores - Scores to update.
 * @param {Object} question - The answered question.
 * @param {Object} option - The chosen answer option.
 * @returns {void}
 */
function addPoints(scores, question, option) {
  if (question.type === 'likert') {
    scores[question.target] += option.points;
  } else {
    scores[option.mapsTo] += 1;
  }
}

/**
 * Sums up the points per learning type for all answered questions.
 * @param {Array<number|null>} chosen - Chosen option index per question.
 * @returns {Object.<string, number>}
 */
export function computeScores(chosen) {
  const scores = emptyScores();
  QUESTIONS.forEach((q, i) => {
    if (chosen[i] !== null) addPoints(scores, q, q.options[chosen[i]]);
  });
  return scores;
}

/**
 * Converts raw scores into rounded percentages of the reachable maximum.
 * @param {Object.<string, number>} scores - Raw scores per type.
 * @returns {Object.<string, number>}
 */
export function computePercents(scores) {
  return Object.fromEntries(TYPE_ORDER.map(key => [
    key, Math.round((scores[key] / MAX_PER_TYPE[key]) * 100)
  ]));
}

/**
 * Determines the leading learning types (best type plus close runners-up).
 * @param {Object.<string, number>} percents - Percentages per type.
 * @returns {string[]} Type keys; empty when nothing was scored.
 */
export function determineTop(percents) {
  const max = Math.max(...TYPE_ORDER.map(key => percents[key]));
  if (max === 0) return [];
  return TYPE_ORDER.filter(key => max - percents[key] <= TOP_TOLERANCE);
}

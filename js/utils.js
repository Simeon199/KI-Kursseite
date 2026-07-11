/**
 * @fileoverview Shared utility functions.
 * @module utils
 */

/**
 * Normalises and HTML-escapes a value so it is safe to forward to downstream
 * systems (n8n / e-mail). Strips control and zero-width characters, enforces a
 * hard length cap, escapes all five HTML-significant characters and trims.
 * Returns an empty string for null or undefined values.
 * @param {*} value - The value to sanitise.
 * @returns {string} A safe, trimmed string.
 */
function escapeText(value) {
  return String(value == null ? '' : value)
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .slice(0, 2000)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .trim();
}
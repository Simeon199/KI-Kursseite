/**
 * @fileoverview n8n webhook communication.
 * @module api
 */

/**
 * Sends the collected form data to the configured n8n webhook, which stores it
 * in SeaTable and notifies the course creators so they can prepare a manual
 * invoice. Throws on transport or server failure so the caller can react.
 * @param {Object} data - The form data to transmit.
 * @returns {Promise<void>}
 * @throws {Error} When the request fails or the server responds with a non-OK status.
 */
function sendToN8n(data) {
  return fetch(CONFIG.n8nWebhookUrl, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(data)
  })
  .then(res => {
    if (!res.ok) throw new Error('n8n transmission failed');
  });
}

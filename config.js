/**
 * @typedef {Object} AppConfig
 * @property {string} n8nWebhookUrl       - Webhook endpoint for n8n automation.
 * @property {Object.<string, string>} appointmentLabels - Maps appointment keys to human-readable labels.
 */

/** @type {AppConfig} */
const CONFIG = {
  n8nWebhookUrl:    'https://n8n.lernenlernenleichtgemacht.de/webhook-test/kursregistrierung',
  appointmentLabels: {
    'august-1': '03. – 08. August (vormittags)',
    'august-2': '10. – 14. August (vormittags)',
    'beide':    'Beide Termine möglich'
  }
};

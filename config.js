// ==========================================
// EMAILJS CREDENTIALS
// ==========================================
const EMAILJS_PUBLIC_KEY          = 'YOUR_PUBLIC_KEY';
const EMAILJS_SERVICE_ID          = 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID         = 'YOUR_TEMPLATE_ID';          // Notification to service@rein-campus.de
const EMAILJS_CONFIRM_TEMPLATE_ID = 'YOUR_CONFIRM_TEMPLATE_ID';  // Confirmation to customer

// ==========================================
// APP CONFIG
// ==========================================
const CONFIG = {
  n8nWebhookUrl:   'https://n8n.lernenlernenleichtgemacht.de/webhook-test/kursregistrierung',
  digistoreBaseUrl: 'https://www.checkout-ds24.com/product/705362',
  appointmentLabels: {
    'august-1': '03. – 08. August (vormittags)',
    'august-2': '10. – 14. August (vormittags)',
    'beide':    'Beide Termine möglich'
  }
};

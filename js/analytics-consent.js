const ANALYTICS_CONSENT_KEY = 'rc-analytics-consent';
const RYBBIT_SCRIPT_URL = 'https://tracking.rein-campus.de/api/script.js';
// Website ID of hello-learn.de in the Rybbit admin. While empty, no tracking request is sent.
const RYBBIT_SITE_ID = 'fe792dbf4905';

const CONSENT_BANNER_HTML = `
  <p class="consent-banner-text">Mit Ihrer Zustimmung messen wir, wie unsere Website genutzt wird (Analysewerkzeug Rybbit auf unserem eigenen Server in Frankfurt, keine Cookies). Dabei wird Ihre IP-Adresse kurzzeitig verarbeitet und eine Kennung in Ihrem Browser gespeichert. Sie können Ihre Entscheidung jederzeit über „Analyse-Einstellungen“ im Seitenfuß ändern. Mehr dazu in der <a href="/legal/datenschutz.html#mRybbit">Datenschutzerklärung</a>.</p>
  <p class="consent-banner-status" hidden></p>
  <div class="consent-banner-actions">
    <button type="button" data-consent="denied">Ablehnen</button>
    <button type="button" data-consent="granted">Akzeptieren</button>
  </div>`;

const CONSENT_STATUS_TEXT = {
  granted: 'Aktuelle Einstellung: Messung erlaubt.',
  denied: 'Aktuelle Einstellung: Messung abgelehnt.',
};

document.addEventListener('DOMContentLoaded', initAnalyticsConsent);

/**
 * Applies the stored analytics decision: loads Rybbit after consent,
 * otherwise shows the banner as long as no decision has been made.
 */
function initAnalyticsConsent() {
  wireAnalyticsSettingsLinks();
  const consent = readAnalyticsConsent();
  if (consent === 'granted') loadRybbit();
  else if (consent === null) showConsentBanner();
}

/**
 * Reads the stored analytics decision.
 * @returns {string|null} 'granted', 'denied', or null if none is stored or storage is blocked.
 */
function readAnalyticsConsent() {
  try {
    return localStorage.getItem(ANALYTICS_CONSENT_KEY);
  } catch (error) {
    return null;
  }
}

/**
 * Stores the analytics decision in the browser's local storage.
 * @param {'granted'|'denied'} value - The visitor's decision.
 */
function writeAnalyticsConsent(value) {
  try {
    localStorage.setItem(ANALYTICS_CONSENT_KEY, value);
  } catch (error) {
    // Storage blocked: the decision only applies to the current page view.
  }
}

/**
 * Checks whether the Rybbit script has been added to this page.
 * @returns {boolean} True if the script element exists.
 */
function isRybbitLoaded() {
  return Boolean(document.querySelector(`script[src="${RYBBIT_SCRIPT_URL}"]`));
}

/**
 * Adds the Rybbit tracking script to the page once, if a site ID is configured.
 */
function loadRybbit() {
  if (!RYBBIT_SITE_ID || isRybbitLoaded()) return;
  const script = document.createElement('script');
  script.src = RYBBIT_SCRIPT_URL;
  script.dataset.siteId = RYBBIT_SITE_ID;
  script.defer = true;
  document.head.appendChild(script);
}

/**
 * Deletes all keys starting with "rybbit" from one storage area.
 * @param {Storage} storage - localStorage or sessionStorage.
 */
function removeRybbitKeys(storage) {
  Object.keys(storage)
    .filter(key => key.startsWith('rybbit'))
    .forEach(key => storage.removeItem(key));
}

/**
 * Removes Rybbit's browser entries and reloads the page if the script
 * is already running, so measuring stops immediately.
 */
function revokeAnalytics() {
  try {
    removeRybbitKeys(localStorage);
    removeRybbitKeys(sessionStorage);
  } catch (error) {
    // Storage blocked: Rybbit could not have stored anything either.
  }
  if (isRybbitLoaded()) window.location.reload();
}

/**
 * Stores a banner choice, closes the banner and starts or stops measuring.
 * @param {'granted'|'denied'} choice - The button the visitor clicked.
 */
function handleConsentChoice(choice) {
  writeAnalyticsConsent(choice);
  hideConsentBanner();
  if (choice === 'granted') loadRybbit();
  else revokeAnalytics();
}

/**
 * Builds the consent banner and wires its two buttons.
 * @returns {HTMLElement} The banner, not yet attached to the page.
 */
function createConsentBanner() {
  const banner = document.createElement('section');
  banner.className = 'consent-banner';
  banner.setAttribute('aria-label', 'Analyse-Einstellungen');
  banner.innerHTML = CONSENT_BANNER_HTML;
  banner.querySelectorAll('[data-consent]').forEach(button => {
    button.addEventListener('click', () => handleConsentChoice(button.dataset.consent));
  });
  return banner;
}

/**
 * Shows the visitor's current decision inside the banner, if there is one.
 * @param {HTMLElement} banner - The consent banner.
 */
function updateConsentStatus(banner) {
  const status = banner.querySelector('.consent-banner-status');
  const text = CONSENT_STATUS_TEXT[readAnalyticsConsent()];
  status.textContent = text || '';
  status.hidden = !text;
}

/**
 * Shows the consent banner, creating it on first use.
 * @returns {HTMLElement} The visible banner.
 */
function showConsentBanner() {
  let banner = document.querySelector('.consent-banner');
  if (!banner) {
    banner = createConsentBanner();
    document.body.appendChild(banner);
  }
  updateConsentStatus(banner);
  banner.hidden = false;
  return banner;
}

/**
 * Hides the consent banner if it is on the page.
 */
function hideConsentBanner() {
  const banner = document.querySelector('.consent-banner');
  if (banner) banner.hidden = true;
}

/**
 * Opens the banner from a footer button and moves keyboard focus into it.
 */
function openConsentSettings() {
  showConsentBanner().querySelector('button').focus();
}

/**
 * Lets every "Analyse-Einstellungen" footer button reopen the consent banner.
 */
function wireAnalyticsSettingsLinks() {
  document.querySelectorAll('.js-analytics-settings').forEach(link => {
    link.addEventListener('click', openConsentSettings);
  });
}

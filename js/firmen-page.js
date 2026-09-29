/**
 * @fileoverview Entry point of the company page (pages/firmen.html).
 * @module firmen-page
 */
import { initReveal } from './reveal.js';
import { prefillSelectOnClick, showThanksOnSubmit } from './interest-form.js';

prefillSelectOnClick('paket-select');
showThanksOnSubmit('b2b-form', 'form-ok');
initReveal();

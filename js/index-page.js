/**
 * @fileoverview Entry point of the course overview page (index.html).
 * @module index-page
 */
import { initCourseFinder } from './course-finder.js';
import { initReveal } from './reveal.js';
import { prefillSelectOnClick, showThanksOnSubmit } from './interest-form.js';

prefillSelectOnClick('kurs-select');
showThanksOnSubmit('interest-form', 'form-ok');
initCourseFinder();
initReveal();

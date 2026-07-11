/**
 * @fileoverview Booking modal open/close logic and event listeners.
 * @module modal
 */

/**
 * Locks or unlocks page scrolling behind the modal. The lock must be applied
 * to <html> AND <body>: because <html> uses overflow-x: clip, an overflow set
 * on <body> alone no longer propagates to the viewport (CSS overflow
 * propagation requires <html> to be `visible` on both axes).
 * @param {boolean} locked - True to lock page scrolling, false to restore it.
 */
function setPageScrollLock(locked) {
  const value = locked ? 'hidden' : '';
  document.documentElement.style.overflow = value;
  document.body.style.overflow = value;
}

/**
 * Opens the booking modal, locks page scrolling behind it, and resets the
 * spam time-trap so it measures fill time from when the form actually becomes
 * visible rather than from the initial page load.
 */
function openBookingModal() {
  const modal = document.getElementById('booking-modal');
  if (!modal) return;
  modal.classList.add('is-open');
  setPageScrollLock(true);
  formRenderTime = Date.now();
}

/**
 * Closes the booking modal and restores page scrolling.
 */
function closeBookingModal() {
  const modal = document.getElementById('booking-modal');
  if (!modal) return;
  modal.classList.remove('is-open');
  setPageScrollLock(false);
}

document.querySelectorAll('[data-open-booking]').forEach(function (trigger) {
  trigger.addEventListener('click', function (e) {
    e.preventDefault();
    openBookingModal();
  });
});

const modalCloseBtn = document.getElementById('modal-close-btn');
if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeBookingModal);

const bookingModal = document.getElementById('booking-modal');
if (bookingModal) {
  bookingModal.addEventListener('click', function (e) {
    if (e.target === bookingModal) closeBookingModal();
  });
}

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') closeBookingModal();
});

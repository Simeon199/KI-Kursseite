/**
 * @fileoverview Booking modal open/close logic and event listeners.
 * @module modal
 */

/**
 * Opens the booking modal, locks page scrolling behind it, and resets the
 * spam time-trap so it measures fill time from when the form actually becomes
 * visible rather than from the initial page load.
 */
function openBookingModal() {
  const modal = document.getElementById('booking-modal');
  if (!modal) return;
  modal.classList.add('is-open');
  document.body.style.overflow = 'hidden';
  formRenderTime = Date.now();
}

/**
 * Closes the booking modal and restores page scrolling.
 */
function closeBookingModal() {
  const modal = document.getElementById('booking-modal');
  if (!modal) return;
  modal.classList.remove('is-open');
  document.body.style.overflow = '';
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

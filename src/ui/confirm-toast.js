// Confirm popup: asks before something is undone or replaced, with Cancel and a clear "Yes" button. It opens just
// below the button that was pressed (with a small arrow pointing at it), so it stays next to what it is about. Focus
// starts on Cancel (the safe choice); Esc also cancels. Only one shows at a time.

/**
 * @param {HTMLElement} anchor the button that was pressed; the popup opens below it
 * @param {string} question such as "Reset the Look tab?"
 * @param {string} yesLabel such as "Yes, reset"
 * @param {() => void} onYes runs only if the yes button is pressed
 * @returns {() => void} closes the popup without doing anything (for example when it no longer applies)
 */
export function confirmToast(anchor, question, yesLabel, onYes) {
  document.querySelector('.confirm-toast')?.remove();
  // A one-time tip that happens to be showing closes, so the two never overlap.
  document.querySelectorAll('.coach-tip .coach-close').forEach((closeTip) => closeTip.click());
  const returnTo = document.activeElement;
  const toast = document.createElement('div');
  toast.className = 'confirm-toast';
  toast.setAttribute('role', 'alertdialog');
  toast.setAttribute('aria-label', question);
  toast.innerHTML = `
    <span>${question}</span>
    <div class="confirm-actions">
      <button type="button" class="confirm-cancel">Cancel</button>
      <button type="button" class="confirm-yes">${yesLabel}</button>
    </div>`;
  document.body.append(toast);

  // Below the button, its right edge lined up with the button's, kept inside the screen.
  const box = anchor.getBoundingClientRect();
  const left = Math.min(Math.max(8, box.right - toast.offsetWidth), innerWidth - toast.offsetWidth - 8);
  toast.style.left = `${left}px`;
  toast.style.top = `${box.bottom + 10}px`;
  toast.style.setProperty('--arrow-x', `${box.left + box.width / 2 - left}px`);

  const close = () => {
    if (!toast.isConnected) return;
    toast.remove();
    removeEventListener('keydown', onKey, true);
    removeEventListener('pointerdown', onOutside, true);
    if (returnTo instanceof HTMLElement && returnTo.isConnected && returnTo.getClientRects().length) returnTo.focus();
  };
  function onKey(event) {
    if (event.key !== 'Escape') return;
    event.stopPropagation();
    close();
  }
  // A press anywhere else counts as Cancel.
  function onOutside(event) {
    if (!toast.contains(event.target)) close();
  }
  addEventListener('keydown', onKey, true);
  addEventListener('pointerdown', onOutside, true);
  toast.querySelector('.confirm-cancel').addEventListener('click', close);
  toast.querySelector('.confirm-yes').addEventListener('click', () => {
    close();
    onYes();
  });
  // Focus starts on Cancel; the focus ring shows only when the keyboard is in use (browsers that know the option).
  toast.querySelector('.confirm-cancel').focus({ focusVisible: false });
  return close;
}

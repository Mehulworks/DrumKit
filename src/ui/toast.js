// Toast: a short message at the bottom of the screen that fades away on its own. Only one shows at a time. A notice is
// a toast with a close button that shows once ever (for example, "turn your phone sideways").
import { ICONS } from './icons.js';
import { settings, saveSettings } from './storage.js';

const SHOW_FOR = 3200; // ms
const NOTICE_FOR = 8000; // ms a one-time notice stays unless closed: time to read two lines, then it goes

/**
 * @param {string} text
 * @param {number} [showFor] ms before it fades
 * @returns {HTMLElement} the toast
 */
export function showToast(text, showFor = SHOW_FOR) {
  document.querySelector('.toast')?.remove();
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.textContent = text;
  document.body.append(toast);
  const leave = () => {
    toast.classList.add('is-leaving');
    setTimeout(() => toast.remove(), 300);
  };
  toast.leave = leave;
  setTimeout(leave, showFor);
  return toast;
}

/**
 * A toast with a close button, shown only the first time (remembered in this browser).
 * @param {string} id a name for this notice
 * @param {string} text
 * @returns {HTMLElement | null} the notice, or null if it was shown before
 */
export function showNoticeOnce(id, text) {
  if (settings.tipsSeen.includes(id)) return null;
  settings.tipsSeen.push(id);
  saveSettings();
  const toast = showToast(text, NOTICE_FOR);
  toast.classList.add('has-close');
  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'toast-close';
  close.setAttribute('aria-label', 'Close');
  close.innerHTML = ICONS.close;
  close.addEventListener('click', () => toast.leave());
  toast.append(close);
  return toast;
}

// Focus mode: just the drums, filling the screen. Hides the toolbar, the Customize tab, the credit line and the
// recording panel, and asks the browser for real fullscreen where it allows it (not on iPhone). Leave with the ✕
// button, Esc or F. Playing, recording and playback carry on; it always starts off on a new visit.
import { ICONS } from './icons.js';
import { showTipOnce } from './tip.js';

/**
 * @param {HTMLButtonElement} button the Focus button in the toolbar
 * @param {HTMLButtonElement} exitButton the faint ✕ shown only in focus mode
 * @param {() => void} onEnter closes anything open (drawers) before the toolbar hides
 * @returns {{isOn: () => boolean}}
 */
export function setupFocusMode(button, exitButton, onEnter) {
  button.innerHTML = `${ICONS.expand}<span class="button-label">Focus mode</span><kbd class="menu-key">F</kbd>`;
  button.setAttribute('aria-label', 'Focus mode');
  exitButton.innerHTML = ICONS.close;
  exitButton.setAttribute('aria-label', 'Leave focus mode');
  exitButton.title = 'Leave focus mode (Esc)';

  const isOn = () => document.body.classList.contains('is-focus');
  let fullscreen = false;

  function enter() {
    onEnter();
    document.body.classList.add('is-focus');
    document.documentElement.requestFullscreen?.().then(() => { fullscreen = true; }).catch(() => {});
    showTipOnce('focus', exitButton, 'Just the drums. Press <strong>Esc</strong> or tap ✕ to leave.');
    // The tip sits over the drums, so taps go through it to them (only its close button catches them).
    document.querySelector('.coach-tip:last-of-type')?.classList.add('is-passthrough');
  }

  function leave() {
    document.body.classList.remove('is-focus');
    document.querySelector('.coach-tip.is-passthrough .coach-close')?.click();
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    fullscreen = false;
  }

  button.addEventListener('click', enter);
  exitButton.addEventListener('click', leave);
  // Leaving the browser's fullscreen (its own Esc or gesture) leaves focus mode too.
  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement && fullscreen && isOn()) leave();
  });
  window.addEventListener('keydown', (event) => {
    if (event.repeat || event.ctrlKey || event.metaKey || event.altKey) return;
    if (event.target.closest?.('input, textarea, select')) return;
    if (event.code === 'KeyF') {
      if (isOn()) leave();
      else enter();
    } else if (event.key === 'Escape' && isOn()) {
      leave();
    }
  });
  return { isOn };
}

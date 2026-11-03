// Tour: a short, one-time walk through a few real controls (Learn, recording). Each step points at its control with a
// saffron ring; Next moves on, Skip ends it. Shown once per page load, until "Don't show again" is ticked (remembered in
// this browser; Reset all brings it back).
import { ICONS } from './icons.js';
import { settings, saveSettings } from './storage.js';

const shownThisLoad = new Set();

/**
 * Starts the tour, once per page load, unless it was turned off.
 * @param {string} id a name for this tour
 * @param {Array<{target: () => (HTMLElement | null), text: string, action?: {label: string, run: () => void}}>} steps steps
 *   whose control is missing or hidden are skipped; the last step's action (such as Start) replaces Got it
 */
export function startTourOnce(id, steps) {
  if (settings.tipsSeen.includes(id) || shownThisLoad.has(id)) return;
  const shown = steps.filter((step) => {
    const el = step.target();
    return el && el.getBoundingClientRect().width > 0;
  });
  if (!shown.length) return;
  shownThisLoad.add(id);
  // "Don't show again": the tour stays off in this browser.
  const never = (off) => {
    settings.tipsSeen = settings.tipsSeen.filter((seen) => seen !== id).concat(off ? [id] : []);
    saveSettings();
  };
  let neverAgain = false;

  const box = document.createElement('div');
  box.className = 'coach-tip tour-tip';
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-label', 'Quick tour');
  document.body.append(box);
  let index = 0;
  let target = null;

  function end() {
    target?.classList.remove('tour-target');
    box.remove();
    removeEventListener('resize', place);
    removeEventListener('keydown', onKey);
  }
  // Below the control, or above it when there is no room below; the arrow points at its middle.
  function place() {
    const r = target.getBoundingClientRect();
    const left = Math.min(Math.max(8, r.left + r.width / 2 - box.offsetWidth / 2), innerWidth - box.offsetWidth - 8);
    const below = r.bottom + 12 + box.offsetHeight < innerHeight;
    box.classList.toggle('is-above', !below);
    box.style.left = `${left}px`;
    box.style.top = `${below ? r.bottom + 12 : r.top - 12 - box.offsetHeight}px`;
    box.style.setProperty('--arrow-x', `${r.left + r.width / 2 - left}px`);
  }
  function show() {
    target?.classList.remove('tour-target');
    target = shown[index].target();
    target.classList.add('tour-target');
    const last = index === shown.length - 1;
    box.innerHTML = `<div class="tour-body">
        <div class="tour-head">
          <span class="tour-count">${index + 1} of ${shown.length}</span>
          <button type="button" class="coach-close" aria-label="Close the tour">${ICONS.close}</button>
        </div>
        <p>${shown[index].text}</p>
        <div class="tour-actions">
          <label class="tour-never"><input type="checkbox"${neverAgain ? " checked" : ""}>Don't show again</label>
          <span class="tour-buttons">
            ${last ? '' : '<button type="button" class="tour-skip">Skip</button>'}
            <button type="button" class="tour-next">${last ? (shown[index].action?.label ?? 'Got it') : 'Next'}</button>
          </span>
        </div>
      </div>`;
    place();
    box.querySelector('.tour-next').focus({ preventScroll: true });
  }
  function onKey(event) {
    if (event.key === 'Escape') end();
  }
  box.addEventListener('change', (event) => {
    if (!event.target.matches('.tour-never input')) return;
    neverAgain = event.target.checked;
    never(neverAgain);
  });
  box.addEventListener('click', (event) => {
    if (event.target.closest('.tour-next')) {
      if (index === shown.length - 1) {
        end();
        shown[index].action?.run();
      }
      else { index++; show(); }
    } else if (event.target.closest('.tour-skip, .coach-close')) end();
  });
  addEventListener('resize', place);
  addEventListener('keydown', onKey);
  show();
}

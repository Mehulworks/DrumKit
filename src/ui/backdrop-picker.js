// Background picker: the Customize drawer's Background tab, a grid of cards (Plain, Wood floor, Concrete...), each
// with a small preview of the real drawing. The choice is separate from the theme, so any look works on any
// background, and it is remembered between visits.
import { BACKDROPS, backdropPreview } from '../kit/art/backdrops.js';
import { settings, saveSettings, DEFAULTS } from './storage.js';

/**
 * @param {HTMLElement} container the Background tab's empty card grid
 * @param {(id: string) => void} onChange draws the chosen background
 */
export function setupBackdropPicker(container, onChange) {
  // A background saved by an older version may no longer exist.
  if (!BACKDROPS.some((item) => item.id === settings.background)) settings.background = 'plain';
  container.innerHTML = BACKDROPS.map((item) => `
    <button type="button" class="kit-card" data-backdrop="${item.id}" aria-pressed="false">
      <span class="kit-card-picture backdrop-swatch">${backdropPreview(item.id)}</span>
      <span class="kit-card-name">${item.label}</span>
      <span class="kit-card-text">${item.description}</span>
    </button>`).join('');
  const mark = () => container.querySelectorAll('[data-backdrop]')
    .forEach((card) => card.setAttribute('aria-pressed', String(card.dataset.backdrop === settings.background)));
  container.addEventListener('click', (event) => {
    const card = event.target.closest('[data-backdrop]');
    if (!card) return;
    settings.background = card.dataset.backdrop;
    saveSettings();
    mark();
    onChange(settings.background);
  });
  mark();
  return {
    /** Back to the first-visit background. */
    reset() {
      settings.background = DEFAULTS.background;
      saveSettings();
      mark();
      onChange(DEFAULTS.background);
    },
  };
}

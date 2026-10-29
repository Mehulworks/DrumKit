// Drumsticks controls (optional feature), in the Customize drawer's Sticks tab: a "Show drumsticks" switch, cards for
// the stick type, small round colour swatches, and chips for each accessory (grip, tip cover, chain, sticker, something
// hanging from the end, clip-on light).
// Picking anything also switches the sticks on. Part of the removable drumsticks feature (see kit/sticks.js).
import { STICKS, applyStickFinish } from '../kit/art/finishes.js';
import { STICK_TYPES, drawStick } from '../kit/art/stick-types.js';
import { EXTRAS, EXTRA_TITLES } from '../kit/art/stick-extras.js';
import { ICONS } from './icons.js';
import { settings, saveSettings, DEFAULTS } from './storage.js';

// Card picture background: a mid tone, so even black sticks show.
const BACKDROP = '<rect x="-160" y="-230" width="320" height="200" style="fill: color-mix(in srgb, var(--color-text-muted) 14%, var(--color-bg))"/>';

// A pair of crossed sticks for a card. Uses the kit drawing's gradients, so the current colour and accessories show.
const pair = (type, extras) => `<svg viewBox="-150 -219 300 169" aria-hidden="true">${BACKDROP}
  <g transform="rotate(-62 0 -135)">${drawStick(type, extras)}</g><g transform="rotate(62 0 -135)">${drawStick(type, extras)}</g></svg>`;

const swatchFill = ({ colors }) => `linear-gradient(90deg, ${colors.edge}, ${colors.body} 45%, ${colors.tip} 60%, ${colors.edge})`;

const chips = (group) => `<span class="panel-title">${EXTRA_TITLES[group]}</span>
  <div class="chips" role="group" aria-label="${EXTRA_TITLES[group]}">
    ${EXTRAS[group].map((item) => `<button type="button" class="chip" data-${group}="${item.id}" aria-pressed="false">${item.label}</button>`).join('')}
  </div>`;

/**
 * @param {HTMLElement} container the Customize drawer's Sticks tab
 * @param {{setVisible: (on: boolean) => void, setLook: (type: string, extras: object) => void}} sticks
 */
export function setupSticksSettings(container, sticks) {
  container.innerHTML = `
    <label class="toggle-row">
      <span class="setting-name">${ICONS.sticks}Show drumsticks</span>
      <input type="checkbox" role="switch" id="show-sticks" />
    </label>
    <hr class="fade-divider" />
    <span class="panel-title">Stick type</span>
    <div class="kit-cards stick-types"></div>
    <span class="panel-title">Colour<span class="stick-colour-choice"></span></span>
    <div class="swatches" role="group" aria-label="Stick colour">
      ${STICKS.map((stick) => `<button type="button" class="swatch" data-finish="${stick.id}" aria-pressed="false"
        aria-label="${stick.label}" title="${stick.label}" style="background: ${swatchFill(stick)}"></button>`).join('')}
    </div>
    ${Object.keys(EXTRAS).map(chips).join('')}`;
  const toggle = container.querySelector('#show-sticks');
  const look = settings.look;
  // Choices saved by an older version may no longer exist.
  Object.keys(EXTRAS).forEach((group) => {
    if (!EXTRAS[group].some((item) => item.id === look[group])) look[group] = 'none';
  });

  // Redraws the type cards (their pictures show the current colour and accessories) and marks every current choice.
  function render() {
    container.querySelector('.stick-types').innerHTML = STICK_TYPES.map((type) => `
      <button type="button" class="kit-card" data-type="${type.id}" aria-pressed="false">
        <span class="kit-card-picture">${pair(type.id, look)}</span>
        <span class="kit-card-name">${type.label}</span><span class="kit-card-text">${type.description}</span>
      </button>`).join('');
    const mark = (attr, value) => container.querySelectorAll(`[data-${attr}]`)
      .forEach((item) => item.setAttribute('aria-pressed', String(item.dataset[attr] === value)));
    mark('type', look.stickType);
    mark('finish', look.sticks);
    Object.keys(EXTRAS).forEach((group) => mark(group, look[group]));
    container.querySelector('.stick-colour-choice').textContent = STICKS.find((stick) => stick.id === look.sticks)?.label ?? '';
  }

  function setOn(on) {
    toggle.checked = on;
    settings.showSticks = on;
    saveSettings();
    sticks.setVisible(on);
  }

  container.addEventListener('click', (event) => {
    const choice = event.target.closest('button');
    if (!choice) return;
    const { type, finish } = choice.dataset;
    const group = Object.keys(EXTRAS).find((name) => choice.dataset[name]);
    if (!type && !finish && !group) return;
    if (type) look.stickType = type;
    if (finish) {
      look.sticks = finish;
      applyStickFinish(finish);
    }
    if (group) look[group] = choice.dataset[group];
    sticks.setLook(look.stickType, look);
    setOn(true);
    render();
  });
  toggle.addEventListener('change', () => setOn(toggle.checked));

  toggle.checked = settings.showSticks;
  sticks.setVisible(settings.showSticks);
  applyStickFinish(look.sticks);
  render();

  return {
    /** Back to the first-visit sticks (shown, classic natural wood, black tape, silver chain). */
    reset() {
      Object.assign(look, DEFAULTS.look);
      applyStickFinish(look.sticks);
      sticks.setLook(look.stickType, look);
      setOn(DEFAULTS.showSticks);
      render();
    },
  };
}

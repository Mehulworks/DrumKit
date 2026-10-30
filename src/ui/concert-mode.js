// Concert mode: the kit shrinks to the bottom of the screen and a crowd and stage lights appear behind
// it. The crowd bobs to the tempo, raises its hands on cymbal crashes, jumps when you play fast and cheers when you
// stop after a burst. The truss lights sway and blink gently to the tempo; the kick and crashes make them glow, at
// most twice a second (flash-lights.js). On phones the kit shrinks less, so it stays easy to play.
import { ICONS } from './icons.js';
import { attachTooltip } from './tooltip.js';
import { concertScene } from '../kit/art/concert-art.js';
import { settings } from './storage.js';

const CRASHES = new Set(['crashLeft', 'crashRight', 'splash']);
const HYPE_HITS = 10; // hits within HYPE_WINDOW that get the crowd jumping
const HYPE_WINDOW = 3000;
const CHEER_AFTER = 1200; // quiet ms after a burst before the crowd cheers
const CROWD_SHARE = 0.5; // upright screens: the crowd strip takes about this share of the kit area's height
// Upright screens show the drawing from above its top edge (where the extra rows of people are) down to just below the
// lighting truss, so the strip is full of people instead of empty stage floor.
const TALL_VIEW = { top: -205, bottom: 330 };
const ROW_STEP = 58; // the crowd's row spacing in the drawing; upright phones leave out the furthest row
// Wide screens: the view starts one row above the drawing's top edge, where the extra row of people stands.
const WIDE_VIEW = { top: -ROW_STEP, height: 900 + ROW_STEP };
const LIGHTS_BOTTOM = 318; // the bottom of the truss lamps in the drawing
const GRID_GAP = 8; // screen pixels between the lights and the top of the Pad grid
const KIT_BOTTOM = 12; // upright phones, drum kit view: screen pixels between the kit and the bottom edge
const KIT_GAP = 24; // and between the lights and the top of the kit
const KIT_ZOOM = 1.14; // the upright kit's zoom in concert.css
const KIT_CROWD_ZOOM = 1.18; // drum kit view on upright phones: people and lights this much bigger
const MAX_FAR = 10; // the most rows added further back

/**
 * @param {HTMLButtonElement} button the Concert button in the toolbar
 * @param {HTMLElement} kitArea the kit area (the scene is placed behind the kit drawing inside it)
 * @returns {{attach: () => void, hit: (id: string, lights: boolean) => void, setOn: (on: boolean) => void, isOn: () => boolean,
 *   gridTop: () => number}} attach re-adds the scene after a kit is redrawn; gridTop is how far down the Pad grid starts
 */
export function setupConcertMode(button, kitArea) {
  button.innerHTML = `${ICONS.crowd}<span class="button-label">Concert</span>`;
  button.setAttribute('aria-pressed', 'false');
  attachTooltip(button, { title: 'Concert mode', lines: ['Play to a crowd: they bob to the tempo, cheer your crashes and jump when you play fast.'] });
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  // Upright screens: the crowd is a strip along the top about 40% of the area's height (its sides cropped as needed, so
  // many smaller people show), and --crowd-h tells concert.css how far down to centre the kit below it. Wide screens:
  // the crowd fills the whole area behind the kit.
  const portrait = matchMedia('(orientation: portrait)');
  const uprightPhone = matchMedia('(orientation: portrait) and (max-width: 31.25em)');
  /** Which crowd this screen and view get (concert-crowd.js). */
  const mode = () => (!portrait.matches ? 'wide' : !uprightPhone.matches ? 'tall' : settings.view === 'grid' ? 'phone' : 'kitPhone');
  function fit() {
    const view = scene();
    if (!view) return;
    if (!portrait.matches) {
      view.setAttribute('viewBox', `0 ${WIDE_VIEW.top} 1600 ${WIDE_VIEW.height}`);
      view.setAttribute('preserveAspectRatio', 'xMidYMid slice');
      kitArea.style.removeProperty('--crowd-h');
      kitArea.style.removeProperty('--kit-shift');
      return;
    }
    const area = kitArea.getBoundingClientRect();
    const kit = measureKit();
    const { width, height, top } = tallView(area, kit);
    view.setAttribute('viewBox', `${(1600 - width) / 2} ${top} ${width} ${height}`);
    view.setAttribute('preserveAspectRatio', 'xMidYMin meet');
    const crowdHeight = (area.width * height) / width;
    kitArea.style.setProperty('--crowd-h', `${crowdHeight}px`);
    if (!kit) return kitArea.style.removeProperty('--kit-shift');
    // Down to the bottom, but never under the lights.
    const toBottom = area.bottom - KIT_BOTTOM - kit.bottom;
    const belowLights = area.top + crowdHeight + KIT_GAP - kit.top;
    kitArea.style.setProperty('--kit-shift', `${Math.max(toBottom, belowLights)}px`);
  }
  // Upright phones, drum kit view: the top and bottom of the drums once zoomed (concert.css), before any shift.
  function measureKit() {
    const kit = kitArea.querySelector('.kit-svg:not(.is-grid)');
    if (!kit || mode() !== 'kitPhone') return null;
    kit.style.transform = 'none'; // measure the kit as drawn
    const box = kit.getBoundingClientRect();
    const parts = [...kit.querySelectorAll('.pad-art, .kit-hits [data-pad]')].map((part) => part.getBoundingClientRect());
    kit.style.transform = '';
    const middle = box.top + box.height / 2; // the zoom is around the middle of the drawing
    const zoomed = (y) => middle + (y - middle) * KIT_ZOOM;
    return { top: zoomed(Math.min(...parts.map((r) => r.top))), bottom: zoomed(Math.max(...parts.map((r) => r.bottom))) };
  }
  /**
   * Upright screens: the part of the drawing shown, and how many far rows of people it needs. Upright phones leave out
   * the farthest row with the Pad grid. With the drum kit (near the bottom), people and lights are a little bigger and
   * rows are added further back until the crowd reaches down to just above the kit.
   * @param {DOMRect} area @param {{top: number, bottom: number} | null} [kit] from measureKit
   */
  function tallView(area, kit = measureKit()) {
    const full = TALL_VIEW.bottom - TALL_VIEW.top;
    let width = Math.min(1600, Math.max(900, (area.width * full) / (CROWD_SHARE * area.height)));
    let extra = mode() === 'phone' ? -ROW_STEP : 0;
    let far = 0;
    if (kit) {
      width /= KIT_CROWD_ZOOM;
      const room = ((area.height - KIT_BOTTOM - KIT_GAP - (kit.bottom - kit.top)) * width) / area.width; // in drawing units
      far = Math.min(MAX_FAR, Math.max(0, Math.floor((room - full) / ROW_STEP)));
      extra = far * ROW_STEP;
    }
    return { width, height: full + extra, top: TALL_VIEW.top - extra, far };
  }
  // How far below the kit area's top the Pad grid starts: just under the lights. main.js lays the grid out below it,
  // so the tiles keep their full width instead of shrinking.
  function gridTop() {
    if (!isOn()) return 0;
    const area = kitArea.getBoundingClientRect();
    if (portrait.matches) {
      const { width, height } = tallView(area);
      return (area.width * height) / width + GRID_GAP;
    }
    const scale = Math.max(area.width / 1600, area.height / WIDE_VIEW.height); // "slice": the drawing covers the area
    const offset = (area.height - WIDE_VIEW.height * scale) / 2;
    return offset + (LIGHTS_BOTTOM - WIDE_VIEW.top) * scale + GRID_GAP;
  }
  // The crowd this screen and view get: which rows, and how many far rows.
  const crowdKey = () => `${mode()}:${portrait.matches ? tallView(kitArea.getBoundingClientRect()).far : 0}`;
  // Turning the screen redraws the scene, with or without the extra rows of people.
  const redraw = () => {
    if (!isOn()) return;
    scene()?.remove();
    attach();
  };
  portrait.addEventListener('change', redraw);
  uprightPhone.addEventListener('change', redraw);
  addEventListener('resize', attach); // the room for far rows may change
  let recent = [];
  let cheerTimer = 0;
  let calmTimer = 0;

  const isOn = () => document.body.classList.contains('is-concert');
  const scene = () => kitArea.querySelector('.concert-scene');

  function attach() {
    if (!isOn()) return;
    const key = crowdKey();
    if (scene() && scene().dataset.crowd !== key) scene().remove(); // the view or the room changed: a different crowd
    if (!scene()) {
      const [crowdMode, far] = key.split(':');
      kitArea.insertAdjacentHTML('afterbegin', `<svg class="concert-scene" data-crowd="${key}" viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice" aria-hidden="true">${concertScene(crowdMode, Number(far))}</svg>`);
      scene().style.setProperty('--beat', `${(60 / settings.tempo).toFixed(3)}s`);
    }
    fit();
  }

  function setOn(on) {
    document.body.classList.toggle('is-concert', on);
    button.setAttribute('aria-pressed', String(on));
    if (on) attach();
    else scene()?.remove();
    document.dispatchEvent(new CustomEvent('concert-change', { detail: { on } })); // phone-turns.js listens
  }

  // Adds a class to the crowd for a moment (cheer, hype).
  function crowdMood(mood, ms) {
    const crowd = scene()?.querySelector('.crowd');
    if (!crowd || reduced.matches) return;
    crowd.classList.add(mood);
    clearTimeout(crowd[`${mood}Timer`]);
    crowd[`${mood}Timer`] = setTimeout(() => crowd.classList.remove(mood), ms);
  }

  // The kick makes the truss lamps glow; a crash makes the disco ball glow. Slow rises and falls, never sharp flashes.
  function glowLights(id) {
    const glow = (selector, peak) => scene().querySelectorAll(selector).forEach((light) => light.animate(
      [{ opacity: 0 }, { opacity: peak, offset: 0.25 }, { opacity: 0 }], { duration: 900, easing: 'ease-in-out' }));
    if (id === 'kick') glow('.lamp-flash', 0.4);
    else if (CRASHES.has(id)) glow('.ball-flash', 0.35);
  }

  /**
   * @param {string} id the pad hit
   * @param {boolean} lights whether lights may react to this hit (see flash-lights.js)
   */
  function hit(id, lights) {
    if (!isOn() || !scene()) return;
    scene().style.setProperty('--beat', `${(60 / settings.tempo).toFixed(3)}s`); // follows tempo changes
    const now = performance.now();
    recent = recent.filter((time) => now - time < HYPE_WINDOW).concat(now);
    if (lights) glowLights(id);
    if (CRASHES.has(id)) crowdMood('cheer', 900);
    if (recent.length >= HYPE_HITS) crowdMood('hype', 1500);
    // After a burst, a short silence earns a cheer.
    clearTimeout(cheerTimer);
    if (recent.length >= HYPE_HITS) cheerTimer = setTimeout(() => crowdMood('cheer', 1600), CHEER_AFTER);
    clearTimeout(calmTimer);
    calmTimer = setTimeout(() => { recent = []; }, HYPE_WINDOW);
  }

  button.addEventListener('click', () => setOn(!isOn()));
  return { attach, hit, setOn, isOn, gridTop };
}

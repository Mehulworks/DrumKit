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

/**
 * @param {HTMLButtonElement} button the Concert button in the toolbar
 * @param {HTMLElement} kitArea the kit area (the scene is placed behind the kit drawing inside it)
 * @returns {{attach: () => void, hit: (id: string, lights: boolean) => void, setOn: (on: boolean) => void, isOn: () => boolean}}
 *   attach re-adds the scene after a kit is redrawn
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
  function fit() {
    const view = scene();
    if (!view) return;
    if (!portrait.matches) {
      view.setAttribute('viewBox', '0 0 1600 900');
      view.setAttribute('preserveAspectRatio', 'xMidYMid slice');
      kitArea.style.removeProperty('--crowd-h');
      return;
    }
    const area = kitArea.getBoundingClientRect();
    const height = TALL_VIEW.bottom - TALL_VIEW.top;
    const width = Math.min(1600, Math.max(900, (area.width * height) / (CROWD_SHARE * area.height)));
    view.setAttribute('viewBox', `${(1600 - width) / 2} ${TALL_VIEW.top} ${width} ${height}`);
    view.setAttribute('preserveAspectRatio', 'xMidYMin meet');
    kitArea.style.setProperty('--crowd-h', `${(area.width * height) / width}px`);
  }
  // Turning the screen redraws the scene, with or without the extra rows of people.
  portrait.addEventListener('change', () => {
    if (!isOn()) return;
    scene()?.remove();
    attach();
  });
  addEventListener('resize', fit);
  let recent = [];
  let cheerTimer = 0;
  let calmTimer = 0;

  const isOn = () => document.body.classList.contains('is-concert');
  const scene = () => kitArea.querySelector('.concert-scene');

  function attach() {
    if (!isOn() || scene()) return;
    kitArea.insertAdjacentHTML('afterbegin', `<svg class="concert-scene" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice"
      aria-hidden="true">${concertScene(portrait.matches)}</svg>`);
    scene().style.setProperty('--beat', `${(60 / settings.tempo).toFixed(3)}s`);
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
  return { attach, hit, setOn, isOn };
}

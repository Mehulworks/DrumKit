// Drumsticks (optional feature): two sticks over the kit (or the Pad grid) that strike each pad you hit and twirl when
// you pause.
// To remove the feature: delete this file, kit/art/stick-types.js, kit/art/stick-extras.js, ui/sticks-settings.js
// and styles/sticks.css, and the lines marked "sticks" in main.js.
import { stickDefs, drawStick } from './art/stick-types.js';

const SVG_NS = 'http://www.w3.org/2000/svg';
// The drawn kit (1600 × 900): a real 16-inch stick at its scale (about 17 units per inch), the drummer's seat just
// below the drawing (sticks point away from it) and where the tips wait between hits. The Pad grid scales these to
// its own drawing size.
const KIT = { length: 275, seat: { x: 800, y: 1050 }, rest: { left: { x: 565, y: 600 }, right: { x: 1035, y: 600 } } };
const STRIKE_MS = 650;
const TWIRL_MS = 650;
const PAUSE_BEFORE_TWIRL = 2000;
const TWIRL_GAP = [4000, 7000]; // ms between twirls while you keep pausing

/**
 * @param {SVGSVGElement} svg the kit drawing
 * @param {Array<{id: string, x: number, y: number, r?: number, art: string, grid?: boolean}>} pads
 * @param {{width: number, height: number, grid?: boolean}} [view] the drawing's size; grid: the Pad grid
 * @returns {{setVisible: (on: boolean) => void, setLook: (type: string, extras: object) => void, hit: (id: string) => void}}
 */
export function createSticks(svg, pads, view = { width: 1600, height: 900 }) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const byId = new Map(pads.map((pad) => [pad.id, pad]));
  // The Pad grid: the seat just below the middle of the drawing, and sticks sized to the tiles.
  const scale = view.width / 1600;
  const geo = view.grid ? {
    // Long enough to read on tall phone grids too (their drawing is narrow, so scale alone makes sticks tiny).
    length: Math.min(view.height * 0.4, Math.max(KIT.length * scale * 1.3, view.width * 0.45)),
    seat: { x: view.width / 2, y: view.height + 120 * scale },
    rest: { left: { x: view.width * 0.38, y: view.height * 0.8 }, right: { x: view.width * 0.62, y: view.height * 0.8 } },
  } : KIT;

  // Transform that puts the stick's tip on a point, held from the drummer's side. lift > 1 looks raised (closer).
  function poseFor(tip, lift = 1) {
    const dx = tip.x - geo.seat.x;
    const dy = tip.y - geo.seat.y;
    const distance = Math.hypot(dx, dy);
    const size = geo.length / KIT.length; // the stick art is drawn at the kit's length
    const butt = { x: tip.x - (dx / distance) * geo.length, y: tip.y - (dy / distance) * geo.length };
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
    return `translate(${butt.x.toFixed(1)}px, ${butt.y.toFixed(1)}px) rotate(${angle.toFixed(1)}deg) scale(${(lift * size).toFixed(3)})`;
  }

  svg.querySelector('defs').insertAdjacentHTML('beforeend', stickDefs());
  const layer = document.createElementNS(SVG_NS, 'g');
  layer.setAttribute('class', 'kit-sticks');
  layer.setAttribute('aria-hidden', 'true');
  layer.innerHTML = ['left', 'right'].map((hand) =>
    `<g class="stick-pose" data-hand="${hand}"><g class="stick-spin">${drawStick('classic')}</g></g>`).join('');
  svg.querySelector('.kit-effects').after(layer);

  const hands = {};
  for (const hand of ['left', 'right']) {
    const pose = layer.querySelector(`[data-hand=${hand}]`);
    pose.style.transform = poseFor(geo.rest[hand]);
    hands[hand] = { pose, spin: pose.querySelector('.stick-spin') };
  }

  let visible = false;
  let twirlTimer = 0;
  let nextTwirl = 'right';

  function twirl() {
    if (!visible || reduced.matches) return;
    hands[nextTwirl].spin.animate([{ transform: 'rotate(0deg)' }, { transform: 'rotate(360deg)' }],
      { duration: TWIRL_MS, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' });
    nextTwirl = nextTwirl === 'right' ? 'left' : 'right';
    twirlTimer = setTimeout(twirl, TWIRL_GAP[0] + Math.random() * (TWIRL_GAP[1] - TWIRL_GAP[0]));
  }

  // Any hit cancels a twirl and restarts the wait: sticks only twirl when you pause.
  function waitThenTwirl() {
    clearTimeout(twirlTimer);
    if (visible) twirlTimer = setTimeout(twirl, PAUSE_BEFORE_TWIRL);
  }

  return {
    /** Draws both sticks as another type (classic, nylon, rods, brushes, mallets, glow) with their accessories. */
    setLook(type, extras) {
      Object.values(hands).forEach(({ spin }) => { spin.innerHTML = drawStick(type, extras); });
    },
    setVisible(on) {
      visible = on;
      layer.style.display = on ? '' : 'none';
      waitThenTwirl();
    },
    hit(id) {
      const pad = byId.get(id);
      if (!visible || !pad) return;
      // On the kit the kick is played with the foot: no stick moves, but it still counts as playing (no twirl yet).
      // On the Pad grid every pad, the kick too, is a tile struck with a stick.
      if (id === 'kick' && !pad.grid) return waitThenTwirl();
      const hand = pad.x < geo.seat.x ? 'left' : 'right';
      const { pose, spin } = hands[hand];
      // Aim a little in from the edge nearest the drummer: the bow of a cymbal, the middle of a drum head.
      // On a tile: its middle.
      const towardSeat = pad.art === 'cymbal' || pad.art === 'hihat' ? 0.5 : 0.15;
      const dx = geo.seat.x - pad.x;
      const dy = geo.seat.y - pad.y;
      const distance = Math.hypot(dx, dy);
      const reach = pad.grid ? 0 : pad.r * towardSeat;
      const target = { x: pad.x + (dx / distance) * reach, y: pad.y + (dy / distance) * reach };
      if (!reduced.matches) {
        const from = getComputedStyle(pose).transform;
        spin.getAnimations().forEach((animation) => animation.cancel());
        pose.getAnimations().forEach((animation) => animation.cancel());
        pose.animate([
          { transform: from === 'none' ? poseFor(geo.rest[hand]) : from },
          { transform: poseFor(target, 1.06), offset: 0.1 },
          { transform: poseFor(target), offset: 0.2 },
          { transform: poseFor(geo.rest[hand]) },
        ], { duration: STRIKE_MS, easing: 'ease-out' });
      }
      waitThenTwirl();
    },
  };
}

// Motion: how each piece moves when hit (drums thump, cymbals wobble, the kick beater swings, the hi-hat lifts or closes),
// plus a one-time entrance. Art layer only; off when the device asks for reduced motion.

// How far each cymbal wobbles (1 = a crash). Seen from above, a tilting cymbal looks slightly squashed, so the wobble
// mixes a small turn with a squash that swaps direction as it settles.
const WOBBLE = { crashLeft: 1, crashRight: 1, splash: 1.3, ride: 0.55, openHihat: 0.8, hihat: 0.3 };
const SETTLE = [0, -1, 0.7, -0.45, 0.25, -0.1, 0];
const OPEN_RINGS_FOR = 900; // ms an open hi-hat counts as still ringing (a closed hit then visibly shuts it)
const ENTRANCE_KEY = 'drumkit-entrance-shown';

function cymbalFrames(size) {
  return SETTLE.map((k, i) => ({
    transform: `rotate(${(k * 2.5 * size).toFixed(2)}deg) scale(${(1 - k * 0.025 * size).toFixed(4)}, ${(1 + k * 0.018 * size).toFixed(4)})`,
    offset: i / (SETTLE.length - 1),
  }));
}

const THUMP = [{ transform: 'scale(1)' }, { transform: 'scale(0.975)', offset: 0.25 }, { transform: 'scale(1)' }];
const BEATER = [{ transform: 'translateY(0)' }, { transform: 'translateY(-8px)', offset: 0.3 }, { transform: 'translateY(0)' }];
const LIFT = [{ transform: 'scale(1)' }, { transform: 'scale(1.05)', offset: 0.25 }, { transform: 'scale(1)' }];
const CHICK = [{ transform: 'scale(1)' }, { transform: 'scale(0.96)', offset: 0.3 }, { transform: 'scale(1)' }];

// Restarts a movement instead of stacking it on the last one.
function play(element, frames, options) {
  if (!element) return;
  element.getAnimations().forEach((animation) => animation.cancel());
  element.animate(frames, { easing: 'ease-out', ...options });
}

/**
 * @param {SVGSVGElement} svg the kit drawing (each piece in a [data-art-pad] group)
 * @param {Array<{id: string}>} pads in drawing order
 * @returns {{hit: (id: string) => void, entrance: () => void}}
 */
export function createMotion(svg, pads) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const pieces = new Map(pads.map((pad) => [pad.id, svg.querySelector(`[data-art-pad="${pad.id}"]`)]));
  let openHitAt = -Infinity;

  return {
    hit(id) {
      const piece = pieces.get(id);
      if (!piece || reduced.matches) return;
      const size = WOBBLE[id];
      if (size === undefined) play(piece, THUMP, { duration: 170 });
      else play(piece, cymbalFrames(size), { duration: id === 'hihat' ? 280 : 800 });

      if (id === 'kick') play(piece.querySelector('.kick-beater'), BEATER, { duration: 170 });
      if (id === 'openHihat') {
        openHitAt = performance.now();
        play(piece.querySelector('.hihat-top'), LIFT, { duration: 320 });
      }
      if (id === 'hihat') {
        play(piece.querySelector('.hihat-top'), CHICK, { duration: 130 });
        // A closed hit while the open hi-hat still rings: that one visibly shuts too.
        if (performance.now() - openHitAt < OPEN_RINGS_FOR) {
          play(pieces.get('openHihat')?.querySelector('.hihat-top'), CHICK, { duration: 200 });
          openHitAt = -Infinity;
        }
      }
    },
    /** Pieces settle into place one after another: once per visit, or every time when always is true (a kit change). */
    entrance(always = false) {
      if (reduced.matches) return;
      try {
        if (!always && sessionStorage.getItem(ENTRANCE_KEY)) return;
        sessionStorage.setItem(ENTRANCE_KEY, '1');
      } catch {
        // Storage blocked: show the entrance anyway.
      }
      [...pieces.values()].forEach((piece, index) => piece?.animate(
        [{ opacity: 0, transform: 'translateY(-14px) scale(0.96)' }, { opacity: 1, transform: 'none' }],
        { duration: 450, delay: 60 + index * 40, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)', fill: 'backwards' },
      ));
    },
  };
}

// Atmosphere: the moving light over each background, drawn in its own small layer above the kit so animating it does
// not redraw the kit. Window light drifting over the wood floor, a slow light sweep over concrete, a lamp glow that
// breathes beside the rug, and dust floating in the spotlight. Still under reduced motion.

const glow = (id, color, opacity) => `<radialGradient id="${id}">
    <stop offset="0" stop-color="${color}" stop-opacity="${opacity}"/><stop offset="1" stop-color="${color}" stop-opacity="0"/>
  </radialGradient>`;

// Two slanted patches of daylight, as if from a window on the left.
const windowLight = () => `<linearGradient id="at-window" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#fff4dc" stop-opacity="0.09"/><stop offset="1" stop-color="#fff4dc" stop-opacity="0"/>
  </linearGradient>
  <g class="window-light">
    <path d="M-260 60 L60 60 L-120 700 L-440 700 Z" fill="url(#at-window)"/>
    <path d="M120 60 L330 60 L150 700 L-60 700 Z" fill="url(#at-window)"/>
  </g>`;

// A wide, soft band of light that slides across now and then.
const lightSweep = () => `<linearGradient id="at-sweep" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="0.5" stop-color="#fff" stop-opacity="0.07"/>
    <stop offset="1" stop-color="#fff" stop-opacity="0"/>
  </linearGradient>
  <g transform="rotate(-18 800 450)"><rect class="light-sweep" x="-500" y="-900" width="320" height="2700" fill="url(#at-sweep)"/></g>`;

// A warm glow around the floor lamp in the top-left corner.
const lampGlow = () => `${glow('at-lamp', '#ffcf8a', 0.24)}<circle class="lamp-glow" cx="120" cy="110" r="420" fill="url(#at-lamp)"/>`;

// Dust drifting up through the spotlight; each speck has its own path, speed and start time.
const motes = () => Array.from({ length: 18 }, (_, i) => {
  const x = 420 + ((i * 97) % 760);
  const y = 520 + ((i * 53) % 330);
  const style = `--dx: ${((i % 5) - 2) * 18}px; --dur: ${9 + (i % 6) * 1.5}s; --delay: ${-(i * 1.3) % 12}s`;
  return `<circle class="mote" cx="${x}" cy="${y}" r="${1.6 + (i % 3) * 0.7}" fill="#ffe9c2" style="${style}"/>`;
}).join('');

/** What moves over each background. */
export const ATMOSPHERES = {
  wood: windowLight,
  concrete: lightSweep,
  rug: lampGlow,
  spotlight: motes,
};

/**
 * The stage's footlights (Spotlight background) glow softly on a hit: a slow rise and fall, never a sharp flash.
 * Whether a light may react at all is decided in ui/flash-lights.js.
 * @param {Element} layer the atmosphere layer
 */
export function glowFootlights(layer) {
  layer?.querySelectorAll('.foot-flash').forEach((light) => light.animate(
    [{ opacity: 0 }, { opacity: 0.45, offset: 0.25 }, { opacity: 0 }], { duration: 900, easing: 'ease-in-out' }));
}

// Moving props over each background, drawn in the atmosphere layer: the amp's power light and steam from a mug
// (rehearsal room), a swaying plant (loft studio), a spinning record and a swaying plant (lounge), and footlights with
// drifting haze (stage). Positions match the still props in backdrop-props.js. Still under reduced motion.

const ampLight = (x, y) => `<circle class="led-blink" cx="${x}" cy="${y}" r="5" fill="#ff3b30"/>
  <circle class="led-blink" cx="${x}" cy="${y}" r="14" fill="#ff3b30" opacity="0.25"/>`;

const steam = (x, y) => [0, 1, 2].map((i) => `<path class="steam" d="M${x - 10 + i * 10} ${y} c-10 -14 10 -24 0 -40 c-8 -12 6 -22 0 -34"
  fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" style="--delay: ${-i * 1.1}s"/>`).join('');

// A potted plant whose leaves sway gently around the pot. size scales the leaves.
function plant(x, y, size = 1) {
  const leaves = Array.from({ length: 8 }, (_, i) => `<ellipse cx="${x}" cy="${y - 50 * size}" rx="${17 * size}" ry="${48 * size}" fill="${i % 2 ? '#3f7d4a' : '#2f6b3c'}"
    transform="rotate(${i * 45} ${x} ${y})"/>`).join('');
  return `<ellipse cx="${x + 6}" cy="${y + 10}" rx="46" ry="46" fill="#000" opacity="0.3"/>
    <circle cx="${x}" cy="${y}" r="40" fill="#b5653a" stroke="#7a3f20" stroke-width="3"/><circle cx="${x}" cy="${y}" r="32" fill="#4a3424"/>
    <g class="sway" style="transform-origin: ${x}px ${y}px">${leaves}<circle cx="${x}" cy="${y}" r="12" fill="#264f2f"/></g>`;
}

// A record turning on the turntable, with its tone arm resting on it.
const record = (x, y) => `<g class="spin" style="transform-origin: ${x}px ${y}px">
    <circle cx="${x}" cy="${y}" r="62" fill="#141414"/>
    ${[54, 46, 38, 30].map((r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#2a2a2a" stroke-width="1.5"/>`).join('')}
    <path d="M${x} ${y - 60} A60 60 0 0 1 ${x + 42} ${y - 42}" fill="none" stroke="#fff" stroke-opacity="0.18" stroke-width="6"/>
    <circle cx="${x}" cy="${y}" r="20" fill="#c4231d"/><rect x="${x - 2}" y="${y - 18}" width="4" height="12" fill="#e9b949"/>
    <circle cx="${x}" cy="${y}" r="3" fill="#d6dade"/>
  </g>
  <path d="M${x + 104} ${y + 56} L${x + 70} ${y - 30} L${x + 34} ${y - 22}" fill="none" stroke="#d6dade" stroke-width="5" stroke-linecap="round"/>
  <rect x="${x + 22}" y="${y - 30}" width="18" height="12" rx="2" fill="#2a2c30"/>`;

// A row of small footlights along the front of the stage (the top edge), each with a glow that rises softly on hits.
const footlights = () => Array.from({ length: 6 }, (_, i) => {
  const x = 380 + i * 168;
  return `<circle cx="${x}" cy="34" r="60" fill="url(#at-foot)" class="foot-glow"/>
    <circle cx="${x}" cy="34" r="90" fill="url(#at-foot)" class="foot-flash" opacity="0"/>
    <rect x="${x - 16}" y="20" width="32" height="20" rx="5" fill="#141416" stroke="#3a3b3f"/><rect x="${x - 10}" y="34" width="20" height="5" rx="2" fill="#ffe9c2"/>`;
}).join('');

const haze = () => [[300, 520, 380], [1250, 420, 420], [800, 760, 460]].map(([x, y, r], i) =>
  `<ellipse class="haze" cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.45}" fill="url(#at-haze)" style="--delay: ${-i * 7}s"/>`).join('');

const defs = `<radialGradient id="at-foot"><stop offset="0" stop-color="#ffe2a8" stop-opacity="0.45"/><stop offset="1" stop-color="#ffe2a8" stop-opacity="0"/></radialGradient>
  <radialGradient id="at-haze"><stop offset="0" stop-color="#d8dcff" stop-opacity="0.08"/><stop offset="1" stop-color="#d8dcff" stop-opacity="0"/></radialGradient>`;

/** Moving props per background. */
export const MOVING_PROPS = {
  wood: () => ampLight(1532, 73) + steam(1480, 768),
  concrete: () => plant(105, 852, 0.8),
  rug: () => record(1428, 130) + plant(1480, 805),
  spotlight: () => defs + haze() + footlights(),
};

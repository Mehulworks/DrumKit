// Kit gear: the real things around a kit that are not instruments, drawn under the drums and never tappable (taps go
// straight through to the drums). Tripod stands under the cymbals and hi-hats (with the hi-hat pedal), the drummer's
// stool at the bottom edge, a tablet clamped beside the hi-hat, and a spare-stick holder by the floor tom. Works on
// every kit; the electronic kit's pads sit on its rack, so it has no stands.
import { n } from './shared.js';

const LEG = (x, y, length, angle, width) => `<g transform="rotate(${angle} ${x} ${y})">
  <line x1="${x}" y1="${y}" x2="${x}" y2="${n(y - length)}" style="stroke: var(--metal-solid)" stroke-width="${width}" stroke-linecap="round"/>
  <line x1="${x}" y1="${y}" x2="${x}" y2="${n(y - length)}" stroke="#fff" stroke-opacity="0.35" stroke-width="${n(width * 0.3)}" stroke-linecap="round"/>
  <circle cx="${x}" cy="${n(y - length)}" r="${n(width * 0.9)}" fill="#1d1e21"/>
</g>`;

/** A tripod stand seen from above: three legs reaching past the cymbal's edge and the centre post. */
function stand({ x, y, r }, turn = 0) {
  const length = r * 1.18;
  return `${[30, 150, 270].map((angle) => LEG(x, y, length, angle + turn, 9)).join('')}
    <circle cx="${x}" cy="${y}" r="13" fill="url(#chrome)" stroke="#2b2e33"/>`;
}

/** The hi-hat pedal, reaching from the stand toward the drummer. */
const hihatPedal = ({ x, y, r }) => `<g transform="rotate(-20 ${x} ${y})">
  <line x1="${x}" y1="${y}" x2="${x}" y2="${n(y + r * 1.05)}" style="stroke: var(--metal-solid)" stroke-width="8"/>
  <rect x="${x - 20}" y="${n(y + r * 1.05)}" width="40" height="${n(r * 0.6)}" rx="8" fill="url(#dark-metal)" stroke="#000" stroke-opacity="0.6"/>
  ${[0.2, 0.32, 0.44].map((k) => `<line x1="${x - 13}" y1="${n(y + r * (1.05 + k))}" x2="${x + 13}" y2="${n(y + r * (1.05 + k))}" stroke="#6b7076" stroke-width="1.5"/>`).join('')}
</g>`;

/** The drummer's stool, mostly below the bottom edge: a padded round seat with a stitched rim. */
const stool = (x) => `<ellipse cx="${x + 10}" cy="975" rx="120" ry="110" fill="url(#shadow)"/>
  <circle cx="${x}" cy="958" r="96" fill="#1e1f23" stroke="#000" stroke-opacity="0.6"/>
  <circle cx="${x}" cy="958" r="84" fill="none" stroke="#3a3c42" stroke-width="2" stroke-dasharray="5 5"/>
  <ellipse cx="${x - 28}" cy="906" rx="34" ry="10" fill="#fff" opacity="0.06"/>`;

/** A tablet on a clamp arm, its screen showing a little drum grid. */
function tablet(x, y, turn) {
  const dots = [[0, 0], [2, 0], [4, 0], [6, 0], [1, 1], [5, 1], [0, 2], [4, 2]]
    .map(([col, row]) => `<circle cx="${x - 34 + col * 11}" cy="${y - 14 + row * 14}" r="3.5" style="fill: var(--color-accent)"/>`).join('');
  const lines = [0, 1, 2].map((row) => `<line x1="${x - 40}" y1="${y - 14 + row * 14}" x2="${x + 40}" y2="${y - 14 + row * 14}" stroke="#fff" stroke-opacity="0.12"/>`).join('');
  return `<g transform="rotate(${turn} ${x} ${y})">
    <rect x="${x - 56}" y="${y - 38}" width="112" height="76" rx="9" fill="#111214" stroke="#3a3c41" stroke-width="3"/>
    <rect x="${x - 48}" y="${y - 30}" width="96" height="60" rx="4" fill="#1b2230"/>${lines}${dots}
  </g>`;
}

/** A tube holding spare sticks, three tips showing. */
const stickHolder = (x, y) => `<g transform="rotate(-18 ${x} ${y})">
  <rect x="${x - 15}" y="${y - 36}" width="30" height="72" rx="10" fill="#26272b" stroke="#000" stroke-opacity="0.5"/>
  ${[-7, 0, 7].map((dx, i) => `<circle cx="${x + dx}" cy="${y - 38 - (i % 2) * 4}" r="5" style="fill: var(--stick-tip)" stroke="#5a4630" stroke-width="0.8"/>`).join('')}
</g>`;

const arm = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="stroke: var(--metal-solid)" stroke-width="6" stroke-linecap="round"/>
  <circle cx="${x1}" cy="${y1}" r="7" fill="url(#chrome)" stroke="#2b2e33"/>`;

/**
 * All the gear for a kit, as SVG markup drawn under the pads.
 * @param {Array<{id: string, art: string, x: number, y: number, r?: number, w?: number, h?: number}>} pads
 */
export function drawGear(pads) {
  const find = (id) => pads.find((pad) => pad.id === id);
  const parts = [];
  pads.filter((pad) => pad.art === 'cymbal').forEach((pad, i) => parts.push(stand(pad, i * 17)));
  pads.filter((pad) => pad.art === 'hihat').forEach((pad) => parts.push(stand(pad, 40)));
  const hihat = find('hihat');
  if (hihat?.art === 'hihat') parts.push(hihatPedal(hihat));
  const kick = find('kick');
  if (kick) parts.push(stool(kick.x));

  // Tablet beside the hi-hat, toward the outer edge.
  if (hihat) {
    const tx = Math.max(90, hihat.x - hihat.r * 0.95);
    const ty = hihat.y + hihat.r * 1.25;
    parts.push(arm(hihat.x - hihat.r * 0.25, hihat.y + hihat.r * 0.45, tx + 30, ty - 30), tablet(tx, ty, -14));
  }
  // Spare sticks below the floor tom.
  const floorTom = find('floorTom');
  if (floorTom) parts.push(stickHolder(floorTom.x + floorTom.r * 0.45, floorTom.y + floorTom.r * 1.22));
  return `<g class="kit-gear" aria-hidden="true">${parts.join('')}</g>`;
}

// Stick accessories (part of the removable drumsticks feature): real things drummers put on sticks: grip tape or a
// rubber grip sleeve, a rubber practice tip that covers the tip, a ball chain wrapped round the shaft, a small vinyl
// sticker, something hanging from the butt (a wrist strap, a keychain charm or a ribbon), and a clip-on LED light.
// Drawn along the y axis like the sticks (butt at 0, tip near -270).
import { sticker } from './accessories/stickers.js';

export const EXTRAS = {
  grip: [
    { id: 'none', label: 'None' }, { id: 'tape', label: 'Black tape' }, { id: 'candy', label: 'Candy tape' }, { id: 'sleeve', label: 'Rubber sleeve' },
  ],
  tip: [{ id: 'none', label: 'None' }, { id: 'black', label: 'Black practice tip' }, { id: 'red', label: 'Red practice tip' }],
  chain: [{ id: 'none', label: 'None' }, { id: 'silver', label: 'Silver chain' }, { id: 'gold', label: 'Gold chain' }],
  sticker: [{ id: 'none', label: 'None' }, { id: 'star', label: 'Star' }, { id: 'skull', label: 'Skull' }, { id: 'heart', label: 'Heart' }],
  hang: [
    { id: 'none', label: 'None' }, { id: 'strap', label: 'Wrist strap' }, { id: 'charm', label: 'Keychain charm' }, { id: 'ribbon', label: 'Ribbon' },
  ],
  light: [{ id: 'none', label: 'None' }, { id: 'cyan', label: 'Cyan LED' }, { id: 'pink', label: 'Pink LED' }],
};

/** The names shown above each group of chips. */
export const EXTRA_TITLES = {
  grip: 'Grip', tip: 'Tip cover', chain: 'Chain', sticker: 'Sticker', hang: 'Hanging from the end', light: 'Clip-on light',
};

const grip = (id) => {
  if (id === 'sleeve') {
    const ribs = Array.from({ length: 11 }, (_, i) => `<line x1="-6.5" y1="${-6 - i * 6}" x2="6.5" y2="${-6 - i * 6}" stroke="#000" stroke-opacity="0.35"/>`).join('');
    return `<rect x="-6.8" y="-74" width="13.6" height="74" rx="4.5" style="fill: var(--color-accent)"/>${ribs}
      <rect x="-4.5" y="-72" width="2.2" height="70" rx="1" fill="#fff" opacity="0.3"/>`;
  }
  const fill = { tape: '#1b1b1e', candy: 'url(#grip-candy)' }[id];
  return fill ? `<rect x="-5.8" y="-66" width="11.6" height="66" rx="2.5" style="fill: ${fill}"/>
    <rect x="-5.8" y="-66" width="11.6" height="66" rx="2.5" fill="url(#grip-wrap)"/>` : '';
};

// A rubber practice tip pushed over the tip, with a rolled rim.
const tip = (id) => {
  const color = { black: '#202124', red: '#c4231d' }[id];
  return color ? `<ellipse cx="0" cy="-263" rx="6.2" ry="12" fill="${color}"/><rect x="-5.2" y="-253" width="10.4" height="4" rx="2" fill="${color}"
    stroke="#000" stroke-opacity="0.3"/><ellipse cx="-2" cy="-267" rx="1.6" ry="4.5" fill="#fff" opacity="0.25"/>` : '';
};

// A ball chain wound round the shaft in five turns, with a short loop hanging off the side. Big enough beads to read at
// the kit's normal size.
const chain = (id) => {
  const color = { silver: '#e6e9ec', gold: '#f0c95e' }[id];
  if (!color) return '';
  const turns = Array.from({ length: 5 }, (_, i) => `M -7 ${-92 - i * 16} L 7 ${-104 - i * 16}`).join(' ');
  const loop = 'M 6 -112 C 22 -110 30 -128 22 -142 C 16 -152 8 -150 6 -144';
  const beads = (d, width, gap, extra = '') =>
    `<path d="${d}" fill="none" stroke="#000" stroke-opacity="0.4" stroke-width="${width + 0.8}" stroke-dasharray="0 ${gap}" stroke-linecap="round" transform="translate(1 1.5)"/>
    <path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" stroke-dasharray="0 ${gap}" stroke-linecap="round" ${extra}/>
    <path d="${d}" fill="none" stroke="#fff" stroke-opacity="0.7" stroke-width="${(width * 0.35).toFixed(1)}" stroke-dasharray="0 ${gap}" stroke-linecap="round"
      transform="translate(-0.6 -0.6)"/>`;
  return beads(turns, 4.6, 5.4) + beads(loop, 4.2, 5.2);
};

const stickerOn = (id) => (id === 'none' || !id ? '' : sticker(id, 0, -186, 5.5, 0));

const hang = (id) => {
  if (id === 'strap') {
    return `<path d="M -2 3 C -16 26 -10 44 0 46 C 10 44 16 26 2 3" fill="none" stroke="#2a2b30" stroke-width="3.4" stroke-linecap="round"/>
      <rect x="-4" y="-2" width="8" height="7" rx="2" fill="url(#chrome)"/>`;
  }
  if (id === 'charm') {
    return `<path d="M 0 2 L 4 28" stroke="#d6dade" stroke-width="2.2" stroke-dasharray="0 3" stroke-linecap="round"/>
      <circle cx="0" cy="1" r="2.6" fill="none" stroke="#d6dade" stroke-width="1.4"/>${sticker('star', 5, 35, 6, 10)}`;
  }
  if (id === 'ribbon') {
    return ['#e63946', '#f4b400', '#3ddc84', '#4d8dff'].map((color, i) => {
      const spread = (i - 1.5) * 5;
      return `<path d="M ${spread * 0.4} 2 C ${spread - 8} 18 ${spread + 8} 30 ${spread - 2} 54" fill="none" stroke="${color}" stroke-width="3.2"
        stroke-linecap="round"/>`;
    }).join('');
  }
  return '';
};

// A small clip-on LED light gripping the shaft, with its glow.
const light = (id) => {
  const color = { cyan: '#2ff3ff', pink: '#ff4fd8' }[id];
  return color ? `<circle cx="8" cy="-92" r="9" fill="${color}" opacity="0.3"/><rect x="-6.5" y="-98" width="13" height="12" rx="3" fill="#1d1e21"
    stroke="#3a3c41"/><circle cx="8" cy="-92" r="3.2" fill="${color}"/>` : '';
};

/**
 * The accessories for one stick, drawn over it.
 * @param {{grip?: string, tip?: string, chain?: string, sticker?: string, hang?: string, light?: string}} extras
 */
export const drawExtras = (extras = {}) =>
  hang(extras.hang) + grip(extras.grip) + chain(extras.chain) + stickerOn(extras.sticker) + light(extras.light) + tip(extras.tip);

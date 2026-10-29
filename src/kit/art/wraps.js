// Theme artwork: wrap patterns for the shells (sparkle, wood grain, filigree, dragon scales) and graphics painted on
// the kick (sunburst, flames, crest, neon stripes, dragon). Original designs drawn in code.

// A fixed number sequence, so "random" sparkles and flames look the same on every visit.
function seeded(seed) {
  let value = seed;
  return () => (value = (value * 16807) % 2147483647) / 2147483647;
}

const pattern = (width, height, body) =>
  `<pattern id="shell-wrap" patternUnits="userSpaceOnUse" width="${width}" height="${height}">${body}</pattern>`;

/** The shell wrap pattern for a theme (empty when the theme has none). @param {string | undefined} id */
export function wrapPattern(id) {
  if (id === 'sparkle') {
    const random = seeded(7);
    const flakes = Array.from({ length: 14 }, () =>
      `<circle cx="${(random() * 36).toFixed(1)}" cy="${(random() * 36).toFixed(1)}" r="${(0.6 + random()).toFixed(2)}"
        fill="#fff" fill-opacity="${(0.35 + random() * 0.55).toFixed(2)}"/>`).join('');
    return pattern(36, 36, flakes);
  }
  if (id === 'grain') {
    const lines = [6, 14, 23, 31, 40].map((y, i) =>
      `<path d="M0 ${y} C35 ${y - 3 - i % 2}, 70 ${y + 4}, 140 ${y}" fill="none" stroke="#3a2410" stroke-opacity="0.22" stroke-width="1.1"/>`).join('');
    return pattern(140, 46, `${lines}<ellipse cx="96" cy="27" rx="7" ry="2.5" fill="none" stroke="#3a2410" stroke-opacity="0.25"/>`);
  }
  if (id === 'filigree') {
    return pattern(90, 90, `<path d="M45 8 C62 8 66 28 52 34 C42 38 36 28 44 24 M45 8 C28 8 24 28 38 34 C48 38 54 28 46 24
      M45 52 L45 82 M33 66 L57 66 M45 52 C52 58 52 62 45 66 C38 62 38 58 45 52" fill="none" stroke="#c9ccd4"
      stroke-opacity="0.3" stroke-width="1.4" stroke-linecap="round"/>`);
  }
  if (id === 'scales') {
    // Overlapping dragon scales: rows of arcs, every other row shifted by half a scale.
    return pattern(24, 14, `<path d="M0 14 A12 12 0 0 1 24 14 M-12 7 A12 12 0 0 1 12 7 M12 7 A12 12 0 0 1 36 7"
      fill="none" stroke="#e0b04a" stroke-opacity="0.32" stroke-width="1.2"/>`);
  }
  return pattern(10, 10, '');
}

/**
 * The graphic painted on the kick for a theme (empty when the theme has none). The kick is seen from above,
 * lying on its side: the drummer's end is at the bottom.
 * @param {string | undefined} id
 * @param {{x: number, y: number, w: number, h: number}} kick
 */
export function kickGraphic(id, { x, y, w, h }) {
  const left = x - w / 2;
  const top = y - h / 2;
  const bottom = y + h / 2;

  if (id === 'sunburst') {
    return `<linearGradient id="kick-burst" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#1a0d05" stop-opacity="0.85"/><stop offset="0.3" stop-color="#1a0d05" stop-opacity="0"/>
        <stop offset="0.7" stop-color="#1a0d05" stop-opacity="0"/><stop offset="1" stop-color="#1a0d05" stop-opacity="0.85"/>
      </linearGradient><rect x="${left}" y="${top}" width="${w}" height="${h}" fill="url(#kick-burst)"/>`;
  }
  if (id === 'flames') {
    // Flame tongues rising from the drummer's end towards the front of the drum.
    const random = seeded(11);
    const base = bottom - 24;
    const tongue = (cx, width, height, fill) => `<path d="M${cx - width / 2} ${base} C${cx - width / 2} ${base - height * 0.45},
      ${cx - width * 0.1} ${base - height * 0.6}, ${cx + width * 0.18} ${base - height} C${cx + width * 0.05} ${base - height * 0.55},
      ${cx + width / 2} ${base - height * 0.45}, ${cx + width / 2} ${base} Z" fill="${fill}"/>`;
    let flames = '';
    for (let i = 0; i < 7; i++) {
      const cx = left + ((i + 0.5) * w) / 7;
      const height = (h - 50) * (0.32 + random() * 0.32);
      flames += tongue(cx, (w / 7) * 1.3, height, 'url(#flame-outer)') + tongue(cx, (w / 7) * 0.65, height * 0.6, 'url(#flame-inner)');
    }
    flames = `<g opacity="0.88">${flames}</g>`;
    return `<linearGradient id="flame-outer" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0" stop-color="#e52d00"/><stop offset="0.6" stop-color="#ff8a00"/><stop offset="1" stop-color="#ffc94d"/>
      </linearGradient>
      <linearGradient id="flame-inner" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0" stop-color="#ffb000"/><stop offset="1" stop-color="#fff1b0"/>
      </linearGradient>${flames}`;
  }
  if (id === 'crest') {
    const s = w / 380;
    return `<g fill="none" stroke="#c9ccd4" stroke-opacity="0.55" stroke-width="${2.4 * s}" stroke-linecap="round">
      <line x1="${x - w * 0.34}" y1="${top}" x2="${x - w * 0.34}" y2="${bottom}"/>
      <line x1="${x + w * 0.34}" y1="${top}" x2="${x + w * 0.34}" y2="${bottom}"/>
      <g transform="translate(${x} ${y}) scale(${s})">
        <path d="M0 -70 L14 -14 L70 0 L14 14 L0 70 L-14 14 L-70 0 L-14 -14 Z"/>
        <circle r="22"/><circle r="6" fill="#c9ccd4" fill-opacity="0.5"/>
        <path d="M-40 -60 C-70 -60 -74 -30 -56 -24 M40 -60 C70 -60 74 -30 56 -24 M-40 60 C-70 60 -74 30 -56 24 M40 60 C70 60 74 30 56 24"/>
      </g></g>`;
  }
  if (id === 'neon') {
    const stripe = (sx, color) => `<line x1="${sx}" y1="${top}" x2="${sx}" y2="${bottom}" stroke="${color}" stroke-opacity="0.22" stroke-width="16"/>
      <line x1="${sx}" y1="${top}" x2="${sx}" y2="${bottom}" stroke="${color}" stroke-width="3.5"/>`;
    return stripe(x - w * 0.18, '#2ff3ff') + stripe(x + w * 0.18, '#ff4fd8');
  }
  if (id === 'dragon') {
    // A coiled dragon emblem: an S-shaped body with scales, claws, a horned head with whiskers, and a flame-tipped tail.
    const s = w / 380;
    const body = 'M-150 40 C-110 120 -20 110 0 30 C20 -50 110 -70 150 -10 C175 30 150 80 110 76';
    const claw = (cx, cy, turn) => `<path transform="translate(${cx} ${cy}) rotate(${turn})" d="M0 0 L-8 16 M0 0 L0 18 M0 0 L8 16"
      stroke="#e0b04a" stroke-width="3.5" stroke-linecap="round" fill="none"/>`;
    return `<g transform="translate(${x} ${y + 6}) scale(${s})">
      <path d="${body}" fill="none" stroke="#2a0606" stroke-width="30" stroke-linecap="round"/>
      <path d="${body}" fill="none" stroke="#e0b04a" stroke-width="22" stroke-linecap="round"/>
      <path d="${body}" fill="none" stroke="#9a6a1a" stroke-width="22" stroke-linecap="round" stroke-dasharray="3 9"/>
      <path d="${body}" fill="none" stroke="#fff2c4" stroke-opacity="0.5" stroke-width="3" stroke-linecap="round" transform="translate(-3 -6)"/>
      ${claw(-95, 98, 20)}${claw(-30, 80, -10)}${claw(40, -48, 160)}${claw(120, -40, 200)}
      <path d="M110 76 C96 92 118 112 132 96 C122 100 112 96 116 84 Z" fill="#ff7a1a"/>
      <g transform="translate(-150 40)">
        <path d="M0 0 L-46 -22 L-58 -6 L-40 4 L-62 18 L-34 22 L-6 14 Z" fill="#e0b04a" stroke="#2a0606" stroke-width="3" stroke-linejoin="round"/>
        <path d="M-14 -10 C-22 -34 -10 -50 4 -56 M-26 -14 C-40 -32 -34 -52 -22 -60" fill="none" stroke="#e0b04a" stroke-width="4" stroke-linecap="round"/>
        <path d="M-56 -4 C-80 -10 -96 6 -110 -6 M-58 16 C-82 22 -94 40 -110 34" fill="none" stroke="#e0b04a" stroke-width="2" stroke-linecap="round"/>
        <circle cx="-30" cy="-6" r="4" fill="#ff3d00"/>
      </g>
    </g>`;
  }
  return '';
}

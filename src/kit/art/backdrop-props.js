// Background props: still objects around the edges of each background, in corner spots that stay clear of the drums
// on every kit. A rehearsal room (mic stand, amp, cable, taped set list, mug), a loft studio (two monitor speakers,
// taped cable, water bottle), a lounge (floor lamp, turntable plinth, record crate) and a stage (two floor wedges).
// Their moving parts (steam, a spinning record, plants, lights) are drawn in atmosphere-props.js.

const shadow = (x, y, rx, ry) => `<ellipse cx="${x + 6}" cy="${y + 10}" rx="${rx}" ry="${ry}" fill="#000" opacity="0.35"/>`;

const micStand = (x, y) => `${shadow(x, y, 46, 46)}<circle cx="${x}" cy="${y}" r="44" fill="#1d1e21" stroke="#3a3c41" stroke-width="3"/>
  <circle cx="${x}" cy="${y}" r="7" fill="#55595f"/><line x1="${x}" y1="${y}" x2="${x - 70}" y2="${y - 80}" stroke="#7a7f86" stroke-width="7" stroke-linecap="round"/>
  <rect x="${x - 92}" y="${y - 104}" width="30" height="46" rx="14" fill="#2a2c30" transform="rotate(-42 ${x - 77} ${y - 81})"/>
  <circle cx="${x - 84}" cy="${y - 96}" r="12" fill="#6b7076" stroke="#2a2c30" stroke-width="2"/>`;

const amp = (x, y) => `${shadow(x, y, 100, 64)}<rect x="${x - 98}" y="${y - 58}" width="196" height="116" rx="10" fill="#1b1b1e" stroke="#000" stroke-opacity="0.6"/>
  <rect x="${x - 86}" y="${y - 30}" width="172" height="76" rx="6" fill="#2b2a26"/>
  <rect x="${x - 86}" y="${y - 30}" width="172" height="76" rx="6" fill="url(#bd-cloth)"/>
  <rect x="${x - 98}" y="${y - 58}" width="196" height="22" rx="8" fill="#26272b"/>
  ${[0, 1, 2, 3, 4, 5].map((i) => `<circle cx="${x - 70 + i * 24}" cy="${y - 47}" r="6" fill="#d6dade" stroke="#2b2e33"/>`).join('')}
  <pattern id="bd-cloth" patternUnits="userSpaceOnUse" width="6" height="6"><path d="M0 6 L6 0" stroke="#000" stroke-opacity="0.35"/></pattern>`;

const cable = (d) => `<path d="${d}" fill="none" stroke="#0e0f11" stroke-width="7" stroke-linecap="round"/>
  <path d="${d}" fill="none" stroke="#fff" stroke-opacity="0.08" stroke-width="2" transform="translate(-1 -2)"/>`;

const setList = (x, y) => `<g transform="rotate(-8 ${x} ${y})">${shadow(x - 4, y - 6, 62, 78)}
  <rect x="${x - 60}" y="${y - 80}" width="120" height="160" fill="#f1ede3"/>
  ${Array.from({ length: 8 }, (_, i) => `<rect x="${x - 44}" y="${y - 56 + i * 16}" width="${60 + ((i * 23) % 30)}" height="5" rx="2" fill="#2a2a2a" opacity="0.55"/>`).join('')}
  <rect x="${x - 30}" y="${y - 90}" width="60" height="20" fill="#3a3b3f" opacity="0.85"/></g>`;

const mug = (x, y) => `${shadow(x, y, 34, 34)}<circle cx="${x}" cy="${y}" r="32" fill="#e8e3d8" stroke="#b9b2a3" stroke-width="2"/>
  <circle cx="${x}" cy="${y}" r="25" fill="#4a2c18"/><ellipse cx="${x - 7}" cy="${y - 8}" rx="9" ry="4" fill="#fff" opacity="0.18"/>
  <path d="M${x + 30} ${y - 12} q22 12 0 24" fill="none" stroke="#e8e3d8" stroke-width="8"/>`;

const monitor = (x, y, turn) => `<g transform="rotate(${turn} ${x} ${y})">${shadow(x, y, 80, 62)}
  <rect x="${x - 76}" y="${y - 58}" width="152" height="116" rx="10" fill="#1c1d20" stroke="#000" stroke-opacity="0.6"/>
  <circle cx="${x}" cy="${y + 10}" r="36" fill="#111214" stroke="#3a3c41" stroke-width="4"/><circle cx="${x}" cy="${y + 10}" r="12" fill="#2b2d31"/>
  <circle cx="${x}" cy="${y - 38}" r="10" fill="#111214" stroke="#3a3c41" stroke-width="3"/></g>`;

const bottle = (x, y) => `<g transform="rotate(28 ${x} ${y})">${shadow(x, y, 22, 64)}
  <rect x="${x - 20}" y="${y - 62}" width="40" height="118" rx="16" fill="#9fd3ff" opacity="0.55" stroke="#cfe8ff" stroke-opacity="0.7"/>
  <rect x="${x - 10}" y="${y + 52}" width="20" height="18" rx="4" fill="#2e6fb5"/><rect x="${x - 14}" y="${y - 20}" width="28" height="34" fill="#fff" opacity="0.35"/></g>`;

const lamp = (x, y) => `${shadow(x, y, 40, 40)}<circle cx="${x}" cy="${y}" r="38" fill="#2a2420"/><circle cx="${x}" cy="${y}" r="60" fill="#f3e2bf" opacity="0.92"/>
  <circle cx="${x}" cy="${y}" r="60" fill="none" stroke="#c9a77a" stroke-width="3"/><circle cx="${x}" cy="${y}" r="16" fill="#fff6dc"/>`;

const turntable = (x, y) => `${shadow(x, y, 110, 86)}<rect x="${x - 104}" y="${y - 80}" width="208" height="160" rx="8" fill="#6b4a2e" stroke="#3a2614" stroke-width="2"/>
  <rect x="${x - 104}" y="${y - 80}" width="208" height="160" rx="8" fill="url(#bd-planks)" opacity="0.25"/>
  <circle cx="${x - 22}" cy="${y}" r="66" fill="#1a1a1a" stroke="#9097a0" stroke-width="3"/>
  <circle cx="${x + 82}" cy="${y + 56}" r="7" fill="#d6dade"/>`;

const crate = (x, y) => `${shadow(x, y, 80, 54)}<rect x="${x - 78}" y="${y - 52}" width="156" height="104" rx="6" fill="#8a5a32" stroke="#4a2c14" stroke-width="3"/>
  ${Array.from({ length: 9 }, (_, i) => `<rect x="${x - 66 + i * 15}" y="${y - 44}" width="9" height="88" rx="2" fill="${['#c4231d', '#1f2a44', '#e9b949', '#2f6b4f'][i % 4]}"/>`).join('')}`;

const wedge = (x, y, turn) => `<g transform="rotate(${turn} ${x} ${y})">${shadow(x, y, 92, 52)}
  <path d="M${x - 90} ${y + 46} L${x + 90} ${y + 46} L${x + 70} ${y - 46} L${x - 70} ${y - 46} Z" fill="#141416" stroke="#000"/>
  <path d="M${x - 72} ${y + 34} L${x + 72} ${y + 34} L${x + 58} ${y - 34} L${x - 58} ${y - 34} Z" fill="url(#bd-mesh)"/>
  <pattern id="bd-mesh" patternUnits="userSpaceOnUse" width="5" height="5"><circle cx="2.5" cy="2.5" r="1" fill="#3a3b3f"/></pattern></g>`;

/** Still props per background, drawn above its floor. */
export const PROPS = {
  wood: () => cable('M1440 180 C1400 300 1520 380 1480 520 S1420 700 1540 760') + micStand(160, 160) + amp(1460, 120)
    + setList(180, 820) + mug(1480, 800),
  concrete: () => cable('M40 230 C300 210 520 260 800 240 S1300 220 1560 250') + monitor(150, 125, -14) + monitor(1450, 125, 14)
    + bottle(1480, 800),
  rug: () => lamp(120, 110) + turntable(1450, 130) + crate(170, 828),
  spotlight: () => wedge(140, 810, 18) + wedge(1460, 810, -18),
};

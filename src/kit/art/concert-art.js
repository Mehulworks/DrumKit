// Concert scene (desktop only), drawn behind the kit and seen from above like the kit itself: a dark venue, the crowd
// (concert-crowd.js), a crowd barrier, a lighting truss whose lamps cast slowly swaying beams in blue, green, magenta
// and saffron, a disco ball whose specks sweep the room, and coloured pools roaming the floor. Shapes drawn in code.
import { crowd } from './concert-crowd.js';

// The disco ball hangs between the crowd barrier and the truss, where no cymbal ever covers it.
const BALL = { x: 800, y: 240, r: 16 };
// The stage's own light colours (not the theme's): blue, green, magenta and saffron.
const LIGHTS = ['#4d8dff', '#3ddc84', '#ff4fd8', 'var(--color-accent)', '#4d8dff', '#3ddc84'];

// A lighting truss across the front of the stage, with six lamps. Each lamp casts a soft beam that sways slowly, has a
// halo that blinks gently in a chase to the tempo (concert.css), and a glow that rises on the kick (concert-mode.js).
const truss = () => {
  const zigzag = Array.from({ length: 28 }, (_, i) => `${120 + i * 50} ${i % 2 ? 272 : 258}`).join(' L');
  const lamps = Array.from({ length: 6 }, (_, i) => {
    const x = 240 + i * 224;
    const color = LIGHTS[i];
    return `<linearGradient id="cs-beam-${i}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color: ${color}; stop-opacity: 0.22"/>
        <stop offset="1" style="stop-color: ${color}; stop-opacity: 0"/></linearGradient>
      <path class="beam" d="M${x - 10} 272 L${x + 10} 272 L${x + 120} 760 L${x - 120} 760 Z" fill="url(#cs-beam-${i})"
        style="transform-origin: ${x}px 272px; --sway: ${9 + (i % 3) * 2}s; --delay: ${-i * 1.7}s"/>
      <circle class="lamp-halo" cx="${x}" cy="270" r="28" style="fill: ${color}; --i: ${i}" opacity="0.15"/>
      <circle class="lamp-flash" cx="${x}" cy="270" r="40" style="fill: ${color}" opacity="0"/>
      <rect x="${x - 16}" y="252" width="32" height="26" rx="5" fill="#141416" stroke="#3a3b3f"/>
      <circle cx="${x}" cy="270" r="7" style="fill: ${color}"/>`;
  }).join('');
  return `<path d="M110 258 H1490 M110 272 H1490" stroke="#55585e" stroke-width="4"/>
    <path d="M${zigzag}" fill="none" stroke="#55585e" stroke-width="2"/>${lamps}`;
};

// The disco ball: a faceted silver sphere with a twinkling glint, a halo that pulses gently, and a glow for crashes.
const discoBall = () => {
  const { x, y, r } = BALL;
  const tiles = [];
  for (let row = -3; row <= 3; row++) {
    for (let col = -3; col <= 3; col++) {
      const tx = x + col * 5.5;
      const ty = y + row * 5.5;
      if (Math.hypot(tx - x, ty - y) < r - 3) {
        tiles.push(`<rect x="${tx - 2.4}" y="${ty - 2.4}" width="4.8" height="4.8" fill="${(row + col + 6) % 3 ? '#cfd5dc' : '#8f979f'}"/>`);
      }
    }
  }
  return `<circle class="ball-halo" cx="${x}" cy="${y}" r="${r + 16}" fill="#ffffff" opacity="0.08"/>
    <circle class="ball-flash" cx="${x}" cy="${y}" r="${r + 34}" fill="#ffffff" opacity="0"/>
    <line x1="${x}" y1="${y - r - 12}" x2="${x}" y2="${y - r}" stroke="#55585e" stroke-width="3"/>
    <circle cx="${x}" cy="${y}" r="${r}" fill="#9aa2aa"/>${tiles.join('')}
    <circle class="ball-glint" cx="${x - 6}" cy="${y - 6}" r="5" fill="#fff"/>`;
};

// Light specks thrown by the disco ball; the whole group turns slowly around the ball.
const specks = () => {
  const colors = ['#ffffff', '#ffffff', '#4d8dff', '#3ddc84', '#ffffff', '#ff4fd8'];
  const dots = Array.from({ length: 44 }, (_, i) => {
    const angle = i * 2.4;
    const distance = 120 + ((i * 97) % 760);
    const dx = Math.round(Math.cos(angle) * distance * 1.4);
    const dy = Math.round(Math.sin(angle) * distance * 0.7);
    return `<circle cx="${BALL.x + dx}" cy="${BALL.y + dy}" r="${3 + (i % 3)}" style="fill: ${colors[i % colors.length]}" opacity="0.55"/>`;
  }).join('');
  return `<g class="disco-specks" style="transform-origin: ${BALL.x}px ${BALL.y}px">${dots}</g>`;
};

// Light pools: soft coloured spots that roam the stage floor (their paths are in concert.css).
const pools = () => ['#4d8dff', '#3ddc84', '#ff4fd8', '#fff1d6'].map((color, i) => `
  <radialGradient id="cs-pool-${i}"><stop offset="0" style="stop-color: ${color}; stop-opacity: 0.32"/>
    <stop offset="1" style="stop-color: ${color}; stop-opacity: 0"/></radialGradient>
  <ellipse class="pool pool-${i}" cx="${380 + i * 280}" cy="${520 + (i % 2) * 140}" rx="230" ry="150" fill="url(#cs-pool-${i})"/>`).join('');

/** The whole scene, in a 1600 × 900 drawing that fills the kit area. */
export const concertScene = () => `
  <defs>
    <linearGradient id="cs-venue" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#07070a"/><stop offset="0.3" stop-color="#0e0e13"/><stop offset="1" stop-color="#15151a"/>
    </linearGradient>
    <pattern id="cs-boards" patternUnits="userSpaceOnUse" width="520" height="40">
      <rect width="520" height="40" fill="#18181c"/><path d="M0 0.5 H520 M300 0 V40" stroke="#0c0c0e" stroke-width="1.5"/>
    </pattern>
  </defs>
  <rect x="-800" y="-400" width="3200" height="1800" fill="url(#cs-venue)"/>
  <rect x="-800" y="285" width="3200" height="1200" fill="url(#cs-boards)"/>
  ${crowd()}
  <path d="M-800 226 H2400" stroke="#6b7076" stroke-width="5"/>
  ${Array.from({ length: 34 }, (_, i) => `<rect x="${-40 + i * 50}" y="220" width="4" height="12" fill="#6b7076"/>`).join('')}
  <rect x="-800" y="282" width="3200" height="6" fill="#2a2a30"/>
  ${pools()}
  ${truss()}${discoBall()}${specks()}`;

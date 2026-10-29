// Concert crowd, seen from above and facing the stage (down the screen): bright shirts, a mix of hairstyles (short,
// long, ponytails, buns, hair clips, caps), the face on the stage side, arms that reach toward the stage when they cheer, and things in their hands
// (picture signs, glow sticks, phone lights) plus a beach ball bouncing over them. Simple shapes, no faces drawn.

const ROWS = [58, 116, 172]; // back to front
const SPACING = 58;
const SHIRTS = ['#d6334a', '#f08a3c', '#2a9d8f', '#3f7bd6', '#e9c46a', '#8a4fe0', '#e0408e', '#25b88a', '#f25c2a', '#5bc0eb'];
const HAIR = ['#1a1512', '#3b2a1e', '#5a4632', '#141414', '#7a5c3a', '#b58a4c', '#c8642f', '#e3c07a'];
const CLIPS = ['#ff6fae', '#ffd23f', '#7fe0ff', '#b6ff4a'];
const SKIN = ['#e8c4a0', '#c99a72', '#8d5b3a', '#f1d3b5', '#a8754f'];
const GLOW = ['#2ff3ff', '#ff4fd8', '#b6ff4a', '#ffd23f'];

// A small pseudo-random sequence, so the crowd looks the same on every visit.
function seeded(seed) {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

// Simple pictures for the signs: a heart, a star, a drum and a music note.
const SIGN_PICTURES = [
  (x, y) => `<path d="M${x} ${y + 9} c-16 -10 -12 -22 0 -14 c12 -8 16 4 0 14z" fill="#e63946"/>`,
  (x, y) => `<path d="M${x} ${y - 10} l3 7 7 0 -5.5 5 2 7.5 -6.5 -4 -6.5 4 2 -7.5 -5.5 -5 7 0z" fill="#f4b400"/>`,
  (x, y) => `<ellipse cx="${x}" cy="${y - 4}" rx="10" ry="4" fill="#d6dade" stroke="#333" stroke-width="1.5"/>
    <path d="M${x - 10} ${y - 4} v9 a10 4 0 0 0 20 0 v-9" fill="#d6334a" stroke="#333" stroke-width="1.5"/>`,
  (x, y) => `<path d="M${x - 4} ${y + 6} v-15 l10 -3 v15" fill="none" stroke="#3a3a3a" stroke-width="2.5"/>
    <circle cx="${x - 7}" cy="${y + 6}" r="3.5" fill="#3a3a3a"/><circle cx="${x + 3}" cy="${y + 3}" r="3.5" fill="#3a3a3a"/>`,
];

// What a fan holds out toward the stage, if anything.
function held(x, y, index) {
  const hy = y + 34; // in front of them, over the stage side
  if (index % 9 === 3) {
    const picture = SIGN_PICTURES[(index / 9) % SIGN_PICTURES.length | 0];
    return `<g transform="rotate(${(index % 3) * 5 - 5} ${x} ${hy})">
      <rect x="${x - 26}" y="${hy - 16}" width="52" height="34" rx="3" fill="#fbf7ee" stroke="#d9d2c2"/>${picture(x, hy + 1)}</g>`;
  }
  if (index % 7 === 2) {
    const color = GLOW[index % GLOW.length];
    return `<g class="glow-stick"><line x1="${x + 18}" y1="${hy - 10}" x2="${x + 30}" y2="${hy + 8}" stroke="${color}" stroke-width="13"
      stroke-linecap="round" opacity="0.3"/><line x1="${x + 18}" y1="${hy - 10}" x2="${x + 30}" y2="${hy + 8}" stroke="${color}"
      stroke-width="5" stroke-linecap="round"/></g>`;
  }
  if (index % 11 === 5) {
    return `<circle class="phone" cx="${x - 22}" cy="${hy}" r="10" fill="#e8f1ff" opacity="0.25"/>
      <rect x="${x - 26}" y="${hy - 6}" width="8" height="12" rx="1.5" fill="#1a1b1e" stroke="#e8f1ff" stroke-width="1"/>`;
  }
  return '';
}

// A head seen from above, facing the stage: hair at the back, the face (a skin-tone patch) toward the stage. The
// style follows the fan's place in the crowd: short hair, long hair, a ponytail, a bun, a cap, or long hair with a clip.
function head(x, y, index, skin) {
  const hair = HAIR[index % HAIR.length];
  const face = `<ellipse cx="${x}" cy="${y + 9}" rx="8" ry="5" fill="${skin}"/>`;
  const top = `<circle cx="${x}" cy="${y + 3}" r="12.5" fill="${hair}"/>`;
  const long = `<path d="M${x - 14} ${y + 4} C${x - 17} ${y - 14} ${x - 8} ${y - 22} ${x} ${y - 22} C${x + 8} ${y - 22} ${x + 17} ${y - 14} ${x + 14} ${y + 4} Z" fill="${hair}"/>`;
  switch (index % 6) {
    case 1: return long + top + face;
    case 2: return `<ellipse cx="${x}" cy="${y - 15}" rx="5" ry="10" fill="${hair}"/>${top}<circle cx="${x}" cy="${y - 8}" r="2.6" fill="${CLIPS[index % CLIPS.length]}"/>${face}`;
    case 3: return `${top}<circle cx="${x}" cy="${y - 9}" r="6.5" fill="${hair}" stroke="#000" stroke-opacity="0.25"/>${face}`;
    case 4: {
      const cap = SHIRTS[(index + 4) % SHIRTS.length];
      return `<circle cx="${x}" cy="${y + 2}" r="12.5" fill="${cap}"/><ellipse cx="${x}" cy="${y + 13}" rx="11" ry="6" fill="${cap}" stroke="#000"
        stroke-opacity="0.25"/><circle cx="${x}" cy="${y + 1}" r="2" fill="#000" opacity="0.3"/>`;
    }
    case 5: return long + top + face + `<circle cx="${x + 9}" cy="${y - 3}" r="3.2" fill="${CLIPS[index % CLIPS.length]}"/>`;
    default: return top + face;
  }
}

function fan(x, y, random, index) {
  const shirt = SHIRTS[index % SHIRTS.length];
  const skin = SKIN[(index * 3) % SKIN.length];
  const item = held(x, y, index);
  const arms = (raised) => `<g class="${raised ? 'arms-up' : 'arms'}">
      <path d="M${x - 20} ${y + 2} L${x - 26} ${y + 32} M${x + 20} ${y + 2} L${x + 26} ${y + 32}" stroke="${shirt}" stroke-width="9" stroke-linecap="round"/>
      <circle cx="${x - 26}" cy="${y + 34}" r="5.5" fill="${skin}"/><circle cx="${x + 26}" cy="${y + 34}" r="5.5" fill="${skin}"/>
    </g>`;
  return `<g class="fan${index % 2 ? ' fan-alt' : ''}" style="--delay: ${(-random()).toFixed(2)}s">
    <ellipse cx="${x}" cy="${y}" rx="27" ry="13" fill="${shirt}"/>
    <ellipse cx="${x}" cy="${y - 4}" rx="27" ry="6" fill="#000" opacity="0.18"/>
    ${arms(Boolean(item))}
    ${head(x, y, index, skin)}
    ${item}
  </g>`;
}

export function crowd() {
  const random = seeded(7);
  let index = 0;
  const rows = ROWS.map((y, row) => {
    const people = [];
    for (let x = -20 + (row % 2) * (SPACING / 2); x < 1640; x += SPACING) {
      people.push(fan(Math.round(x + (random() - 0.5) * 14), Math.round(y + (random() - 0.5) * 10), random, index++));
    }
    return people.join('');
  }).join('');
  const ball = `<g class="beach-ball"><circle cx="0" cy="0" r="22" fill="#fbf7ee"/>
    <path d="M0 -22 A22 22 0 0 1 19 11 L0 0Z" fill="#e63946"/><path d="M19 11 A22 22 0 0 1 -19 11 L0 0Z" fill="#3f7bd6"/>
    <path d="M-19 11 A22 22 0 0 1 0 -22 L0 0Z" fill="#f4b400"/><circle r="5" fill="#fbf7ee"/>
    <ellipse cx="-7" cy="-9" rx="6" ry="3" fill="#fff" opacity="0.6"/></g>`;
  return `<g class="crowd">${rows}${ball}</g>`;
}

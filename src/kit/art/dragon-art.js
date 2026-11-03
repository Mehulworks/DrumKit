// The Dragon look's coiled dragon tattoo in gold line work, drawn across the Pad grid. Original design drawn in code.

const n = (v) => +v.toFixed(1);

// Teeth along a jaw line from (x0, y0) to (x1, y1), pointing up (-1) or down (1), with a longer fang at the front.
function teeth(x0, y0, x1, y1, dir, count) {
  return Array.from({ length: count }, (_, i) => {
    const t = (i + 0.6) / count;
    const x = x0 + (x1 - x0) * t;
    const y = y0 + (y1 - y0) * t;
    const long = i === count - 1 ? 9 : 5;
    return `M${n(x - 2.5)} ${n(y)} L${n(x)} ${n(y + dir * long)} L${n(x + 2.5)} ${n(y)} Z`;
  }).join(' ');
}

// The head, seen from the side and facing right, about 130 wide. Each part's role sets how it is drawn.
const HEAD = [
  ['horn', 'M-14 -30 C-30 -44 -50 -50 -70 -46 C-52 -42 -38 -34 -28 -24 Z'],
  ['horn', 'M-2 -31 C-14 -48 -30 -58 -46 -60 C-32 -50 -22 -40 -16 -30 Z'],
  ['ridge', 'M-30 -40 l-3 6 M-42 -44 l-2 6 M-20 -46 l-4 5 M-32 -53 l-3 5'],
  ['mane', 'M-42 -4 L-64 -12 L-48 2 L-68 8 L-48 14 L-64 24 L-40 24 Z'],
  ['mouth', 'M8 2 L54 -2 L46 12 Z'],
  ['tooth', teeth(12, 1.6, 52, -1.8, 1, 5) + ' ' + teeth(10, 2.5, 44, 11.4, -1, 4)],
  ['skin', 'M-42 -6 C-38 -26 -16 -34 4 -30 C22 -27 40 -22 54 -14 C60 -10 60 -4 54 -2 L8 2 L46 12 C50 14 48 20 42 20 L2 20 C-10 22 -24 24 -34 30 L-46 24 C-50 12 -46 2 -42 -6 Z'],
  ['shade', 'M-34 26 C-20 21 0 18 40 18 L42 20 L2 20 C-10 22 -24 24 -34 30 Z'],
  ['shine', 'M-30 -18 C-20 -28 0 -31 22 -24 C0 -27 -16 -25 -30 -18 Z'],
  ['eye', 'M-2 -18 C2 -24 12 -24 16 -18 C10 -14 2 -14 -2 -18 Z'],
  ['pupil', 'M7 -22 C9 -19 9 -17 7 -14 C5 -17 5 -19 7 -22 Z'],
  ['line', 'M-8 -24 C2 -31 14 -29 22 -22 M46 -11 C48 -14 52 -13 51 -10 M-24 -6 C-14 2 -12 12 -20 22 M10 16 C20 15 30 16 40 17'],
  ['line', 'M22 -22 c3 3 6 3 8 0 M32 -19 c3 3 6 3 8 0 M24 -13 c3 3 6 3 8 0 M-30 4 c3 3 6 3 8 0 M-34 14 c3 3 6 3 8 0'],
  ['spike', 'M14 20 L18 28 L22 20 Z M26 20 L29 27 L32 20 Z'],
  ['whisker', 'M44 -2 C34 22 12 36 -10 38 C-24 39 -30 32 -24 28 M40 20 C38 34 28 44 14 48'],
];

// How each part is drawn as line work in one colour (the shading parts are left out).
function style(role, color) {
  if (role === 'shade' || role === 'shine') return null;
  const fill = { pupil: color, tooth: color, mouth: color }[role];
  const width = { line: 2.5, ridge: 2, whisker: 2, tooth: 0 }[role] ?? 3.5;
  return `fill="${fill ?? 'none'}" ${role === 'mouth' ? 'fill-opacity="0.25"' : ''} stroke="${color}" stroke-width="${width}"`;
}

const head = (color) => HEAD.map(([role, d]) => {
  const look = style(role, color);
  return look ? `<path d="${d}" ${look}/>` : '';
}).join('');

// A hooked talon at (x, y), pointing along (dx, dy).
function talon(x, y, dx, dy, look) {
  const angle = n((Math.atan2(dy, dx) * 180) / Math.PI);
  return `<path transform="translate(${x} ${y}) rotate(${angle})" d="M0 -3 C6 -3 11 0 12 6 C9 2 5 2 0 3 Z" ${look}/>`;
}

// The tattoo's body: three curves from the neck (left) to the tail (right).
const BODY = [[-120, -20], [-70, -20], [-50, 70], [0, 40], [50, 10], [60, -60], [110, -40], [150, -24], [140, 40], [100, 40]];

// Points along the body, with the direction it runs and its half-width (thick at the neck, thin at the tail).
function bodyPoints(count) {
  return Array.from({ length: count + 1 }, (_, i) => {
    const u = (i / count) * 3;
    const k = Math.min(2, Math.floor(u));
    const t = u - k;
    const [a, b, c, d] = BODY.slice(k * 3, k * 3 + 4);
    const m = 1 - t;
    const at = (j) => m * m * m * a[j] + 3 * m * m * t * b[j] + 3 * m * t * t * c[j] + t * t * t * d[j];
    const dt = (j) => 3 * m * m * (b[j] - a[j]) + 6 * m * t * (c[j] - b[j]) + 3 * t * t * (d[j] - c[j]);
    const len = Math.hypot(dt(0), dt(1)) || 1;
    return { x: at(0), y: at(1), tx: dt(0) / len, ty: dt(1) / len, w: 13 - 10.5 * (i / count) };
  });
}

/**
 * A coiled dragon in fine gold line work, like a tattoo: a scaled body with spikes along its back, two clawed legs, a
 * finned tail and a horned head with open jaws. Centred on (cx, cy) and about size wide.
 * @param {number} cx @param {number} cy @param {number} size @param {string} [color]
 */
export function dragonTattoo(cx, cy, size, color = '#e0b04a') {
  const s = size / 340;
  const pts = bodyPoints(48);
  const side = (p, k) => `${n(p.x - p.ty * p.w * k)} ${n(p.y + p.tx * p.w * k)}`; // k = 1 belly side, -1 back side
  const outline = `M${pts.map((p) => side(p, 1)).join(' L')} L${[...pts].reverse().map((p) => side(p, -1)).join(' L')} Z`;
  const bands = pts.filter((_, i) => i > 1 && i % 2 === 0).map((p) =>
    `M${side(p, 1)} Q${n(p.x + p.tx * p.w * 0.7)} ${n(p.y + p.ty * p.w * 0.7)} ${side(p, -1)}`).join(' ');
  const spikes = pts.filter((_, i) => i > 0 && i < 46 && i % 3 === 0).map((p) => {
    const at = (along, out) => `${n(p.x + p.tx * along + p.ty * out)} ${n(p.y + p.ty * along - p.tx * out)}`;
    return `M${at(-p.w * 0.5, p.w)} L${at(p.w * 0.6, p.w * 1.9 + 3)} L${at(p.w * 0.5, p.w)}`;
  }).join(' ');
  const legs = [10, 30].map((i) => {
    const p = pts[i];
    const at = (along, out) => [n(p.x + p.tx * along - p.ty * out), n(p.y + p.ty * along + p.tx * out)];
    const [kx, ky] = at(10, p.w + 14);
    const [fx, fy] = at(-2, p.w + 26);
    const toes = [[-0.6, 1], [0, 1], [0.6, 1]].map(([a, o]) => {
      const dx = p.tx * a * 8 - p.ty * o * 8;
      const dy = p.ty * a * 8 + p.tx * o * 8;
      return `<path d="M${fx} ${fy} l${n(dx)} ${n(dy)}" stroke-width="3"/>` + talon(n(fx + dx), n(fy + dy), dx, dy, `fill="${color}" stroke="none"`);
    }).join('');
    return `<path d="M${side(p, 1)} Q${kx} ${ky} ${fx} ${fy}" stroke-width="4"/>${toes}`;
  }).join('');
  const end = pts[pts.length - 1];
  const fin = (along, out) => `${n(end.x + end.tx * along - end.ty * out)} ${n(end.y + end.ty * along + end.tx * out)}`;
  return `<g class="tattoo" transform="translate(${n(cx)} ${n(cy)}) scale(${n(s * 1000) / 1000}) translate(20 0)" fill="none" stroke="${color}"
    stroke-linecap="round" stroke-linejoin="round">
    <path d="${outline}" fill="${color}" fill-opacity="0.12" stroke-width="4"/>
    <path d="${bands}" stroke-width="2.2" stroke-opacity="0.8"/>
    <path d="${spikes}" fill="${color}" fill-opacity="0.3" stroke-width="2.5"/>
    ${legs}
    <path d="M${fin(0, 0)} Q${fin(14, 12)} ${fin(26, 0)} Q${fin(14, -12)} ${fin(0, 0)} M${fin(2, 0)} L${fin(20, 0)}" stroke-width="3"/>
    <g transform="translate(-120 -20) scale(-0.7 0.7) translate(40 -10)">${head(color)}</g></g>`;
}

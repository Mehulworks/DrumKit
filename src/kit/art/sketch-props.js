// Sketched props for the Plain background: a music stand with a sheet, a side table with a glass and a phone, a guitar
// on its stand and a small practice amp, seen from above like the kit. They are line drawings
// in the page's text colour (like the doodles, a little stronger), so they suit both themes and never compete with the
// drums. Placed in the four corners, which stay clear of the drums on every kit.

const LINE = 'fill="none" style="stroke: var(--color-text)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"';

// A music stand seen from above: the tilted desk with a sheet of music, the post and three feet.
const musicStand = (x, y) => `<g transform="translate(${x} ${y}) rotate(-12)">
  <path d="M -62 -34 H 62 L 56 22 H -56 Z"/>
  <path d="M -48 -24 H 48 M -48 -14 H 48 M -48 -4 H 48 M -48 6 H 48"/>
  <circle cx="-30" cy="-14" r="3"/><circle cx="-6" cy="-4" r="3"/><circle cx="20" cy="-24" r="3"/>
  <path d="M 0 22 V 44 M 0 44 L -34 66 M 0 44 L 34 66 M 0 44 V 78"/>
</g>`;

// A small round side table with a glass of water and a phone on it.
const sideTable = (x, y) => `<g transform="translate(${x} ${y})">
  <circle r="58"/><circle r="50"/>
  <circle cx="-18" cy="-14" r="13"/><circle cx="-18" cy="-14" r="8"/>
  <rect x="6" y="-4" width="26" height="42" rx="5" transform="rotate(18 19 17)"/>
</g>`;

// An acoustic guitar resting on a low stand: body, sound hole, neck and head.
const guitar = (x, y) => `<g transform="translate(${x} ${y}) rotate(-35)">
  <path d="M 0 -30 C 24 -30 30 -10 22 4 C 36 16 36 52 0 56 C -36 52 -36 16 -22 4 C -30 -10 -24 -30 0 -30 Z"/>
  <circle cy="8" r="11"/>
  <path d="M -5 -30 V -104 M 5 -30 V -104 M -9 -104 H 9 L 7 -126 H -7 Z M -12 34 H 12"/>
  <path d="M -30 48 L -44 64 M 30 48 L 44 64"/>
</g>`;

// A small practice amp: the cabinet, the speaker grille and a row of knobs.
const practiceAmp = (x, y) => `<g transform="translate(${x} ${y}) rotate(8)">
  <rect x="-58" y="-42" width="116" height="84" rx="8"/>
  <circle cy="8" r="26"/><circle cy="8" r="12"/>
  ${[-36, -18, 0, 18, 36].map((kx) => `<circle cx="${kx}" cy="-30" r="4"/>`).join('')}
</g>`;

/** All the sketched props for the Plain background. */
export const sketchProps = () => `<g class="sketch-props" ${LINE} vector-effect="non-scaling-stroke" opacity="0.16">
  ${musicStand(140, 120)}${sideTable(1470, 125)}${guitar(88, 840)}${practiceAmp(1475, 800)}
</g>`;

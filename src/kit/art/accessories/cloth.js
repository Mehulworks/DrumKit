// Cloth accessories: a towel draped over a drum's rim and a stick bag hanging on its side.

/**
 * A towel draped over a drum's rim, at the drum's lower right.
 * @param {{x: number, y: number, r: number}} pad
 */
export function towel({ x, y, r }, color = '#9aa0a8', stripe = '#e9e6df') {
  return `<g transform="rotate(135 ${x} ${y})">
    <path d="M${x - 34} ${y - r * 1.2} L${x + 34} ${y - r * 1.2} L${x + 30} ${y - r * 0.78} L${x - 30} ${y - r * 0.78} Z" fill="${color}"/>
    <path d="M${x - 33} ${y - r * 1.1} L${x + 33} ${y - r * 1.1} M${x - 31} ${y - r * 0.9} L${x + 31} ${y - r * 0.9}" stroke="${stripe}" stroke-width="5"/>
  </g>`;
}

/**
 * A stick bag hanging on the outside of a drum (its right side, away from the kick), with two stick ends poking out.
 * @param {{x: number, y: number, r: number}} pad
 */
export function stickBag({ x, y, r }, color = '#2b2b30') {
  const bx = x + r * 1.2;
  return `<g transform="rotate(15 ${bx} ${y})">
    <rect x="${bx - 22}" y="${y - 70}" width="44" height="140" rx="10" fill="${color}" stroke="#000" stroke-opacity="0.5"/>
    <rect x="${bx - 22}" y="${y - 70}" width="44" height="22" rx="8" fill="#000" fill-opacity="0.25"/>
    <circle cx="${bx - 8}" cy="${y - 78}" r="6" fill="#dcbc8c"/><circle cx="${bx + 8}" cy="${y - 80}" r="6" fill="#dcbc8c"/></g>`;
}

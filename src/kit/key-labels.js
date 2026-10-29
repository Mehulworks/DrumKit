// Key labels: small key names (Space, S, J...) drawn over each pad; shown only when "Show keys" is on.

/** A KeyboardEvent.code as people know it ("KeyS" → "S"). */
export const keyName = (code) => (code === 'Space' ? 'Space' : code.replace('Key', ''));

// A Pad grid tile's key: a small badge in its bottom-right corner, sized in screen pixels (11 px text).
function gridBadge(pad, name) {
  const u = pad.unit ?? 1;
  const width = (12 + name.length * 7) * u;
  const height = 18 * u;
  const x = pad.x + pad.w / 2 - 12 * u - width;
  const y = pad.y + pad.h / 2 - 12 * u - height;
  return `
    <g class="key-label">
      <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${5 * u}"/>
      <text x="${x + width / 2}" y="${y + height / 2}" text-anchor="middle" dominant-baseline="central" style="font-size: ${11 * u}px">${name}</text>
    </g>`;
}

/**
 * Draws one label per pad into the layer.
 * @param {SVGGElement} layer
 * @param {Array<{x: number, y: number, r?: number, w?: number, key: string}>} pads
 */
export function drawKeyLabels(layer, pads) {
  layer.innerHTML = pads.map((pad) => {
    const name = keyName(pad.key);
    const width = 26 + name.length * 16;
    // Below the centre on round pieces, so the label does not hide the wing nut or clutch; in the bottom-right corner of
    // a Pad grid tile, so it does not cover the drawing.
    if (pad.grid) return gridBadge(pad, name);
    const x = pad.x;
    const y = pad.w ? pad.y : pad.y + pad.r * 0.5;
    return `
    <g class="key-label">
      <rect x="${x - width / 2}" y="${y - 20}" width="${width}" height="40" rx="10"/>
      <text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central">${name}</text>
    </g>`;
  }).join('');
}

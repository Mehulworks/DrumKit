// Key labels: small key names (Space, S, J...) drawn over each pad; shown only when "Show keys" is on.

/** A KeyboardEvent.code as people know it ("KeyS" → "S"). */
export const keyName = (code) => (code === 'Space' ? 'Space' : code.replace('Key', ''));

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
    const x = pad.grid ? pad.x + pad.w / 2 - 24 - width / 2 : pad.x;
    const y = pad.grid ? pad.y + pad.h / 2 - 40 : pad.w ? pad.y : pad.y + pad.r * 0.5;
    return `
    <g class="key-label">
      <rect x="${x - width / 2}" y="${y - 20}" width="${width}" height="40" rx="10"/>
      <text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central">${name}</text>
    </g>`;
  }).join('');
}

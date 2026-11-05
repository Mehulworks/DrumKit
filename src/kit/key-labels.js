// Pad labels: small badges over each pad with its key (Space, S, J...), its name (Snare), or both (Snare · S); CSS shows
// the one the "Show keys" and "Show instrument names" switches ask for. A Pad grid tile gets only the key (it shows its own name).

/** A KeyboardEvent.code as people know it ("KeyS" → "S"). */
export const keyName = (code) => (code === 'Space' ? 'Space' : code.replace('Key', ''));

// A Pad grid tile's key: a small badge in its bottom-right corner, inside the tile's padding (11 px text).
function gridBadge(pad, name) {
  if (pad.showKey === false) return ''; // phones: no keyboard, no badge
  const u = pad.unit ?? 1;
  const width = (12 + name.length * 7) * u;
  const height = 18 * u;
  const inset = pad.inset ?? 20 * u;
  const x = pad.x + pad.w / 2 - inset - width;
  const y = pad.y + pad.h / 2 - inset - height;
  return `
    <g class="key-label is-key">
      <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${5 * u}"/>
      <text x="${x + width / 2}" y="${y + height / 2}" text-anchor="middle" dominant-baseline="central" style="font-size: ${11 * u}px">${name}</text>
    </g>`;
}

const badge = (x, y, text, width, kind) => `
    <g class="key-label ${kind}">
      <rect x="${x - width / 2}" y="${y - 20}" width="${width}" height="40" rx="10"/>
      <text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central">${text}</text>
    </g>`;

/**
 * Draws the labels for every pad into the layer.
 * @param {SVGGElement} layer
 * @param {Array<{x: number, y: number, r?: number, w?: number, key: string, label: string}>} pads
 */
export function drawKeyLabels(layer, pads) {
  layer.innerHTML = pads.map((pad) => {
    const name = keyName(pad.key);
    const width = 26 + name.length * 16;
    // Below the centre on round pieces, so the label does not hide the wing nut or clutch; low on the kick, clear of the
    // stickers some Looks put in its middle; in the bottom-right corner of a Pad grid tile, so it does not cover the drawing.
    if (pad.grid) return gridBadge(pad, name);
    const y = pad.w ? pad.y + pad.h * 0.3 : pad.y + pad.r * 0.5;
    return badge(pad.x, y, name, width, 'is-key') + badge(pad.x, y, pad.label, 26 + pad.label.length * 12.5, 'is-name')
      + badge(pad.x, y, `${pad.label} · ${name}`, 26 + (pad.label.length + 3) * 12.5 + name.length * 3.5, 'is-both');
  }).join('');
}

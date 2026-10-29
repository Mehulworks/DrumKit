// Kit previews: a small drawing of any kit in any theme, for the cards in the Kit drawer. Simplified shapes in the
// theme's real colours (hoops and LED glow included), on the page background, drawn at the kit's own positions.
import { themeColors } from '../kit/art/themes.js';

/**
 * @param {import('../kit/kits/index.js').Kit} kit
 * @param {typeof import('../kit/art/themes.js').THEMES[number]} theme
 */
export function kitPreview(kit, theme) {
  const { shell, cymbals, metal, heads } = themeColors(theme);
  const { width, height } = kit.view;
  const piece = (pad) => {
    if (pad.w) {
      const x = pad.x - pad.w / 2;
      const y = pad.y - pad.h / 2;
      const isTower = pad.art === 'ekick';
      return `<rect x="${x}" y="${y}" width="${pad.w}" height="${pad.h - (isTower ? 24 : 0)}" rx="${isTower ? 14 : 6}" fill="${shell.mid}"/>
        ${theme.accent && !isTower ? `<rect x="${pad.x - pad.w * 0.2}" y="${y + 20}" width="${pad.w * 0.4}" height="${pad.h - 40}" rx="8" fill="${theme.accent}" opacity="0.75"/>` : ''}
        ${isTower ? `<rect x="${x + 14}" y="${y + 14}" width="${pad.w - 28}" height="10" rx="5" fill="${theme.led}"/>` : ''}`;
    }
    if (pad.art === 'cymbal' || pad.art === 'hihat') {
      return `<circle cx="${pad.x}" cy="${pad.y}" r="${pad.r}" fill="${cymbals.bronze[1]}"/><circle cx="${pad.x}" cy="${pad.y}" r="${pad.r * 0.22}" fill="${cymbals.bell[0]}"/>`;
    }
    if (pad.art === 'ecymbal') {
      return `<circle cx="${pad.x}" cy="${pad.y}" r="${pad.r}" fill="#1d1e21" stroke="#3a3c41" stroke-width="10"/>`;
    }
    if (pad.art === 'epad') {
      return `<circle cx="${pad.x}" cy="${pad.y}" r="${pad.r}" fill="${shell.mid}"/>
        <circle cx="${pad.x}" cy="${pad.y}" r="${pad.r * 0.87}" fill="#25272b" stroke="${theme.led}" stroke-width="12"/>`;
    }
    return `<circle cx="${pad.x}" cy="${pad.y + pad.r * 0.05}" r="${pad.r * 1.04}" fill="${shell.mid}"/>
      <circle cx="${pad.x}" cy="${pad.y}" r="${pad.r * 0.96}" fill="${heads[1]}" stroke="${theme.hoop ?? metal.tones[0]}" stroke-width="14"/>
      ${theme.glow ? `<circle cx="${pad.x}" cy="${pad.y}" r="${pad.r * 0.9}" fill="${theme.glow}" opacity="0.35"/>` : ''}`;
  };
  return `<svg viewBox="0 0 ${width} ${height}" aria-hidden="true">
    <rect width="${width}" height="${height}" style="fill: var(--color-bg)"/>
    <rect width="${width}" height="${height}" fill="${theme.light}" opacity="0.06"/>
    ${kit.pads.map(piece).join('')}
  </svg>`;
}

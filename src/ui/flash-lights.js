// Flashing lights: one place that decides whether a light may flash on a hit. Safe by design: never more than two
// light reactions a second however fast you play (well under the three-a-second limit in accessibility guidelines),
// none at all for reduced motion, and none when the "Flashing lights" setting is off.
import { settings } from './storage.js';

const MIN_GAP = 500; // ms between light reactions: at most two a second
let last = -Infinity;

/** True if a light may react to this hit (and counts it). */
export function canFlash() {
  if (!settings.flashLights || matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  const now = performance.now();
  if (now - last < MIN_GAP) return false;
  last = now;
  return true;
}

/** Applies the setting to the page: with it off, blinking lights hold still (see concert.css and atmosphere.css). */
export function applyFlashSetting() {
  document.body.classList.toggle('no-flash', !settings.flashLights);
}

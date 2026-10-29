// Pointer and touch input: presses play the pad underneath (several fingers at once), and in Hover mode moving onto a pad plays it.
import { getMode } from './modes.js';

/**
 * Starts listening for presses and, in Hover mode, movement over the hit areas.
 * @param {Element} layer element that holds the hit areas (each has a data-pad attribute); the kit area works too,
 *   and keeps working when the kit inside it is swapped
 * @param {(id: string, point: {x: number, y: number}) => void} onHit point is where on screen the pad was hit
 */
export function listenToPointers(layer, onHit) {
  // The pad each pointer (mouse, or each finger) is currently over, so moving within a pad does not repeat it.
  const padUnder = new Map();
  const padAt = (x, y) => document.elementFromPoint(x, y)?.closest('[data-pad]')?.dataset.pad ?? null;

  // A press always plays, in both modes. pointerdown fires once per finger, so one finger cannot double-hit.
  layer.addEventListener('pointerdown', (event) => {
    const area = event.target.closest('[data-pad]');
    if (!area) return;
    event.preventDefault();
    padUnder.set(event.pointerId, area.dataset.pad);
    onHit(area.dataset.pad, { x: event.clientX, y: event.clientY });
  });

  // Hover mode: the mouse plays a pad when it moves onto it; a finger does the same while sliding.
  window.addEventListener('pointermove', (event) => {
    if (getMode() !== 'hover') return;
    const id = padAt(event.clientX, event.clientY);
    if (id === (padUnder.get(event.pointerId) ?? null)) return;
    padUnder.set(event.pointerId, id);
    if (id) onHit(id, { x: event.clientX, y: event.clientY });
  });

  const forget = (event) => padUnder.delete(event.pointerId);
  window.addEventListener('pointerup', (event) => {
    if (event.pointerType !== 'mouse') forget(event);
  });
  window.addEventListener('pointercancel', forget);

  // Stop the long-press menu on phones.
  layer.addEventListener('contextmenu', (event) => event.preventDefault());
}

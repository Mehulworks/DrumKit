// Pad grid layout: the same kit (its pads, keys and sounds) laid out as a grid of big rectangles, grouped by role:
// cymbals on top, toms in the middle, hi-hats, snare and kick at the bottom. It is drawn to the exact shape of the kit
// area (wide rows on landscape screens, more, shorter rows on upright ones), so the tiles fill it on phones; on big
// screens they stop growing and the grid sits centred. Each kit shows only its own pieces (Jazz has fewer, bigger pads).

const GAP = 24;
const MARGIN = 40;
const ROLE = {
  crashLeft: 'cymbal', splash: 'cymbal', crashRight: 'cymbal', ride: 'cymbal',
  tom1: 'tom', tom2: 'tom', floorTom: 'tom', hihat: 'hat', openHihat: 'hat', snare: 'snare', kick: 'kick',
};
// Rows of pad ids, top to bottom. The bottom row is a little taller, and the kick and snare a little wider.
const WIDE = [['crashLeft', 'splash', 'crashRight', 'ride'], ['tom1', 'tom2', 'floorTom'], ['hihat', 'openHihat', 'snare', 'kick']];
const TALL = [['crashLeft', 'crashRight'], ['splash', 'ride'], ['tom1', 'tom2', 'floorTom'], ['hihat', 'openHihat'], ['snare', 'kick']];
const ROW_WEIGHT = (index, rows) => (index === rows - 1 ? 1.15 : 1);
const PAD_WEIGHT = { kick: 1.3, snare: 1.15 };
// On big screens tiles stop growing at about this size (screen pixels), and the grid sits centred with room around it.
const MAX_TILE = { width: 300, height: 220 };
// Upright screens: the grid takes this share of the height and sits at the bottom, so the top row stays within the
// thumb's reach (Fitts's law); the space above stays empty.
const UPRIGHT_SHARE = 0.78;

/**
 * @param {{pads: Array<{id: string}>}} kit
 * @param {{width: number, height: number}} size the kit area in screen pixels
 * @returns {object} the kit with grid pads (each has x, y, w, h, role, unit, art 'gridpad' and grid: true) and its view size;
 *   unit is drawing units per screen pixel, so text can be sized in pixels
 */
export function gridKit(kit, size) {
  const shape = Math.min(3, Math.max(0.4, size.width / size.height || 16 / 9));
  const upright = shape < 0.9;
  const width = upright ? 900 : 1600;
  const view = { width, height: Math.round(width / shape) };
  const perPixel = width / Math.max(1, size.width); // drawing units per screen pixel
  const byId = new Map(kit.pads.map((pad) => [pad.id, pad]));
  const plan = (upright ? TALL : WIDE).map((row) => row.filter((id) => byId.has(id)));
  // Any piece a kit has that the plan does not name joins the middle row.
  const named = new Set(plan.flat());
  plan[1].push(...kit.pads.map((pad) => pad.id).filter((id) => !named.has(id)));
  const rows = plan.filter((row) => row.length);

  const totalWeight = rows.reduce((sum, _, i) => sum + ROW_WEIGHT(i, rows.length), 0);
  const usable = upright ? view.height * UPRIGHT_SHARE : view.height;
  const free = usable - MARGIN * 2 - GAP * (rows.length - 1);
  const rowHeights = rows.map((_, i) => Math.min((free * ROW_WEIGHT(i, rows.length)) / totalWeight, MAX_TILE.height * perPixel * ROW_WEIGHT(i, rows.length)));
  const gridHeight = rowHeights.reduce((a, b) => a + b, 0) + GAP * (rows.length - 1);
  // One width for every row (the widest row's, capped on big screens), so rows with fewer tiles stretch them end to end.
  const rowNeed = (row) => row.reduce((sum, id) => sum + (PAD_WEIGHT[id] ?? 1), 0) * MAX_TILE.width * perPixel + GAP * (row.length - 1);
  const rowWidth = Math.min(view.width - MARGIN * 2, Math.max(...rows.map(rowNeed)));
  const pads = [];
  let top = upright ? view.height - MARGIN - gridHeight : (view.height - gridHeight) / 2;
  rows.forEach((row, i) => {
    const rowHeight = rowHeights[i];
    const weights = row.map((id) => PAD_WEIGHT[id] ?? 1);
    const sum = weights.reduce((a, b) => a + b, 0);
    const width = rowWidth - GAP * (row.length - 1);
    let left = (view.width - rowWidth) / 2;
    row.forEach((id, j) => {
      const w = (width * weights[j]) / sum;
      pads.push({ ...byId.get(id), art: 'gridpad', grid: true, unit: perPixel, role: ROLE[id] ?? 'tom', x: left + w / 2, y: top + rowHeight / 2, w, h: rowHeight, r: undefined });
      left += w + GAP;
    });
    top += rowHeight + GAP;
  });
  return { ...kit, view, pads, decor: undefined, grid: true };
}

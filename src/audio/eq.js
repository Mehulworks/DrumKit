// Master EQ: bass, mid and treble filters in a chain, ending in a soft limiter so boosts cannot clip.

/** The three bands: filter type and the frequency (Hz) each one works around. */
export const BANDS = [
  { id: 'bass', label: 'Bass', type: 'lowshelf', frequency: 200 },
  { id: 'mid', label: 'Mid', type: 'peaking', frequency: 1000 },
  { id: 'treble', label: 'Treble', type: 'highshelf', frequency: 4000 },
];

/** Each band can cut or boost by up to this many dB. */
export const EQ_RANGE = 12;

/** Ready-made settings (dB per band), named like the presets in common music players. The first is the default. */
export const PRESETS = [
  { id: 'normal', label: 'Normal', gains: { bass: 0, mid: 0, treble: 0 } },
  { id: 'rock', label: 'Rock', gains: { bass: 5, mid: -3, treble: 5 } },
  { id: 'pop', label: 'Pop', gains: { bass: -3, mid: 6, treble: 4 } },
  { id: 'jazz', label: 'Jazz', gains: { bass: 3, mid: 2, treble: -6 } },
  { id: 'hiphop', label: 'Hip-Hop', gains: { bass: 8, mid: -2, treble: -2 } },
  { id: 'bassboost', label: 'Bass Boost', gains: { bass: 10, mid: 0, treble: 0 } },
];

// Levels up to this stay untouched; louder peaks are rounded off smoothly and never pass 1.0.
const CLEAN_LIMIT = 0.6;
// The limiter handles peaks up to this level (twice full scale) before flattening completely.
const HEADROOM = 2;

/**
 * Soft limiter: a fixed curve (not a compressor), so normal levels pass through exactly as they are.
 * @param {BaseAudioContext} context
 */
function createSoftLimiter(context) {
  // A WaveShaper only reads input between -1 and 1, so the signal is scaled down first and the curve scales it back.
  const scaleDown = context.createGain();
  scaleDown.gain.value = 1 / HEADROOM;
  const shaper = context.createWaveShaper();
  const curve = new Float32Array(2049);
  for (let i = 0; i < curve.length; i++) {
    const level = ((i / (curve.length - 1)) * 2 - 1) * HEADROOM;
    const size = Math.abs(level);
    const shaped = size <= CLEAN_LIMIT ? size : CLEAN_LIMIT + (1 - CLEAN_LIMIT) * Math.tanh((size - CLEAN_LIMIT) / (1 - CLEAN_LIMIT));
    curve[i] = Math.sign(level) * shaped;
  }
  shaper.curve = curve;
  // No oversampling: its smoothing filter can overshoot the curve and push peaks slightly past 1.0.
  shaper.oversample = 'none';
  scaleDown.connect(shaper);
  return { input: scaleDown, output: shaper };
}

/**
 * Builds the EQ chain: bass -> mid -> treble -> soft limiter.
 * @param {BaseAudioContext} context
 * @param {Record<string, number>} [gains] starting gain in dB for each band id
 * @returns {{input: AudioNode, output: AudioNode, setGain: (id: string, db: number) => void}}
 */
export function createEq(context, gains = {}) {
  const filters = new Map();
  let previous = null;
  for (const band of BANDS) {
    const filter = context.createBiquadFilter();
    filter.type = band.type;
    filter.frequency.value = band.frequency;
    // A wide mid band (low Q) so it reaches the snare and toms, not just a narrow slice around 1 kHz.
    if (band.type === 'peaking') filter.Q.value = 0.4;
    filter.gain.value = gains[band.id] ?? 0;
    previous?.connect(filter);
    previous = filter;
    filters.set(band.id, filter);
  }

  const limiter = createSoftLimiter(context);
  previous.connect(limiter.input);

  return {
    input: filters.get(BANDS[0].id),
    output: limiter.output,
    setGain(id, db) {
      // A short glide avoids clicks while a slider moves.
      filters.get(id)?.gain.setTargetAtTime(db, context.currentTime, 0.02);
    },
  };
}

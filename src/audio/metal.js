// Metallic tone source: square waves at uneven pitch ratios, the base of hi-hat and cymbal sounds.
const RATIOS = [2, 3, 4.16, 5.43, 6.79, 8.21];

/**
 * Starts a bank of square oscillators and returns their mixed output.
 * @param {AudioContext} context
 * @param {number} base base pitch in Hz (each oscillator is a multiple of it)
 * @param {number} start start time in seconds
 * @param {number} stop stop time in seconds
 * @returns {GainNode}
 */
export function createMetal(context, base, start, stop) {
  const mix = context.createGain();
  mix.gain.value = 1 / RATIOS.length;
  for (const ratio of RATIOS) {
    const tone = context.createOscillator();
    tone.type = 'square';
    tone.frequency.value = base * ratio;
    tone.connect(mix);
    tone.start(start);
    tone.stop(stop);
  }
  return mix;
}

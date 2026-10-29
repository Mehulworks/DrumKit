// White noise source: one shared noise buffer, played through a new source node per hit.
let buffer = null;

/**
 * Starts a looping white noise source and returns it, ready to connect.
 * @param {AudioContext} context
 * @param {number} start start time in seconds
 * @param {number} stop stop time in seconds
 * @returns {AudioBufferSourceNode}
 */
export function createNoise(context, start, stop) {
  if (!buffer || buffer.sampleRate !== context.sampleRate) {
    buffer = context.createBuffer(1, context.sampleRate, context.sampleRate);
    const samples = buffer.getChannelData(0);
    for (let i = 0; i < samples.length; i++) {
      samples[i] = Math.random() * 2 - 1;
    }
  }
  const source = context.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  source.start(start);
  source.stop(stop);
  return source;
}

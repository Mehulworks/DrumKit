// Renders a recording to sound (offline, faster than real time) with the current kit, volume and EQ, ready to save.
import { createEq } from './eq.js';
import { currentSounds } from './drums.js';
import { mixSettings } from './engine.js';

const SAMPLE_RATE = 44100; // CD quality
const TAIL = 2.5; // seconds after the recording, so the longest cymbal (2.2 s) rings out instead of being cut off
const LEAD = 0.01; // a tiny lead-in, so the first hit's attack is not clipped at time zero
const STEP = 1; // hits are booked one second ahead
const RING = 3; // a hit is unplugged this long after it starts (every sound has faded by then)

/**
 * Plays every hit of the recording (all layers, once through) into an offline audio context. Each hit plays into its
 * own small "voice" that is unplugged once it has faded: left plugged in, every finished hit would still be processed
 * and a long recording would take many times longer to render.
 * @param {{events: {id: string, at: number}[], length: number}} pattern
 * @returns {Promise<AudioBuffer>} stereo sound
 */
export function renderRecording({ events, length }) {
  const total = length + TAIL;
  const context = new OfflineAudioContext(2, Math.ceil(total * SAMPLE_RATE), SAMPLE_RATE);
  const { level, eqGains } = mixSettings();
  const master = context.createGain();
  master.gain.value = level;
  const eq = createEq(context, eqGains);
  master.connect(eq.input);
  eq.output.connect(context.destination);

  const sounds = currentSounds();
  const hits = [...events].sort((a, b) => a.at - b.at);
  const voices = []; // { voice, end }
  let next = 0;
  const book = (until) => {
    for (; next < hits.length && hits[next].at + LEAD < until; next++) {
      const { id, at } = hits[next];
      const voice = context.createGain();
      voice.connect(master);
      sounds[id]?.(context, voice, at + LEAD);
      voices.push({ voice, end: at + LEAD + RING });
    }
  };
  const unplug = (now) => {
    for (let i = voices.length - 1; i >= 0; i--) {
      if (voices[i].end <= now) voices.splice(i, 1)[0].voice.disconnect();
    }
  };

  // Pause the render every second to unplug faded hits and book the next second's. A browser that cannot pause an
  // offline render gets every hit booked up front instead (slower for long recordings, same sound).
  try {
    book(STEP);
    for (let time = STEP; time < total; time += STEP) {
      context.suspend(time).then(() => {
        unplug(time);
        book(time + STEP);
        context.resume();
      });
    }
  } catch {
    book(Infinity);
  }
  return context.startRendering();
}

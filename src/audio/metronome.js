// Metronome: a steady click to play in time with (the first of every 4 beats is higher). It is never recorded.
import { getAudio, decayEnvelope } from './engine.js';
import { startScheduler } from './scheduler.js';

const BEATS_PER_BAR = 4;

let tempo = 100;
let stop = null;
let nextBeat = 0;
let beatCount = 0;
// The last few booked beats, so the display can flash in step with what is heard.
const recentBeats = [];
const tempoListeners = new Set();

function click(context, output, time, accent) {
  const tone = context.createOscillator();
  const volume = context.createGain();
  tone.frequency.value = accent ? 1600 : 1100;
  decayEnvelope(volume.gain, time, accent ? 0.5 : 0.32, 0.035);
  tone.connect(volume).connect(output);
  tone.start(time);
  tone.stop(time + 0.05);
}

/**
 * One click on its own, booked at an audio-clock time (lessons count in and keep time with it).
 * @param {number} time
 * @param {boolean} accent the higher click, for the first beat of a bar
 */
export function playClick(time, accent) {
  const { context, master } = getAudio();
  click(context, master, time, accent);
}

/** @param {number} bpm beats per minute */
export function setTempo(bpm) {
  tempo = bpm;
  tempoListeners.forEach((listener) => listener(bpm));
}

/** Calls listener now and whenever the tempo changes. @param {(bpm: number) => void} listener */
export function onTempoChange(listener) {
  tempoListeners.add(listener);
  listener(tempo);
}

/** Length of one beat in seconds. */
export const beatLength = () => 60 / tempo;

export const isMetronomeOn = () => stop !== null;

export function startMetronome() {
  if (stop) return;
  const { context, master } = getAudio();
  nextBeat = context.currentTime + 0.05;
  beatCount = 0;
  stop = startScheduler(context, (until) => {
    while (nextBeat < until) {
      const accent = beatCount % BEATS_PER_BAR === 0;
      click(context, master, nextBeat, accent);
      recentBeats.push({ time: nextBeat, accent });
      if (recentBeats.length > 8) recentBeats.shift();
      nextBeat += beatLength();
      beatCount++;
    }
  });
}

export function stopMetronome() {
  stop?.();
  stop = null;
  recentBeats.length = 0;
}

/** The most recent beat heard at this audio-clock time, or null. @returns {{time: number, accent: boolean} | null} */
export function lastBeat(time) {
  for (let i = recentBeats.length - 1; i >= 0; i--) {
    if (recentBeats[i].time <= time) return recentBeats[i];
  }
  return null;
}

/** The latest beat at or before this audio-clock time (while the metronome runs). */
function beatBefore(time) {
  let beat = nextBeat;
  while (beat > time) beat -= beatLength();
  return beat;
}

/** The first beat at or after this audio-clock time (while the metronome runs). */
export function beatAfter(time) {
  let beat = beatBefore(time);
  if (beat < time) beat += beatLength();
  return beat;
}

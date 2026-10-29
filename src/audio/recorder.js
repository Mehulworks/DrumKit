// Recorder: captures which pads are hit and when (drums only, in memory only), plays the pattern back, and adds layers on top.
import { getAudio } from './engine.js';
import { startScheduler } from './scheduler.js';
import { isMetronomeOn, beatLength, beatAfter, playClick } from './metronome.js';

const MIN_LENGTH = 0.25; // shortest pattern (seconds), so a loop can never spin too fast
const MAX_LENGTH = 120; // longest recording (seconds): 2 minutes, so a download stays around 20 MB
const MAX_HITS = 2000; // most hits kept across all layers
/** Most layers on top of the first take (keeps the recording panel to four readable rows). */
export const MAX_LAYERS = 3;
const COUNT_IN_BEATS = 4; // count-in clicks before recording (metronome on)
const QUICK_COUNT = 3; // without the metronome: a 3, 2, 1 countdown with quiet clicks
const QUICK_BEAT = 0.8; // seconds per count of that countdown
// While recording, the first-take row spans the first of these (seconds) that fits, so marks stay where they land and
// only move when the row steps up to the next size.
const VIEW_STEPS = [15, 30, 60, 120];
const EARLY_GRACE = 0.08; // a hit this early (seconds) before the start still counts as the first hit

/**
 * @typedef {'idle' | 'counting' | 'recording' | 'playing' | 'overdubbing'} Mode
 * @typedef {{mode: Mode, loop: boolean, hasRecording: boolean, layers: number}} RecorderState
 * @param {(id: string, time: number) => void} play plays a pad at an audio-clock time
 * @param {(state: RecorderState) => void} onChange called whenever the state changes
 */
export function createRecorder(play, onChange) {
  let events = []; // { id, at, layer }: at = seconds into the pattern; layer 0 = first take, 1+ = overdubs
  let take = []; // hits of a fresh recording in progress
  let length = 0;
  let layers = 0;
  let mode = 'idle';
  let loop = false;
  let startedAt = 0;
  let timer = null; // count-in start or the 2-minute stop
  let countBeat = QUICK_BEAT; // length of one count of the countdown in progress
  let countBeats = QUICK_COUNT;
  // Playback position: the current loop's start, the next event to book, and how far ahead sounds are booked.
  let playStart = 0;
  let cycleStart = 0;
  let next = 0;
  let bookedUntil = 0;
  let stopScheduler = null;
  let layerHits = 0;
  let version = 0; // goes up whenever the hits change, so the display knows when to redraw the pattern

  const clock = () => getAudio().context.currentTime;
  const notify = () => onChange({ mode, loop, hasRecording: events.length > 0, layers });
  const isPlaying = () => mode === 'playing' || mode === 'overdubbing';

  // After events change mid-playback, point at the first event not yet booked (events stay sorted by time).
  function resync() {
    next = events.filter((event) => cycleStart + event.at < bookedUntil).length;
  }

  function startRecording() {
    take = [];
    const now = clock();
    const begin = () => {
      mode = 'recording';
      timer = setTimeout(stopRecording, (startedAt + MAX_LENGTH - clock()) * 1000);
      notify();
    };
    // With the metronome: its own clicks count in 4 beats. Without: a 3, 2, 1 with quiet clicks of its own.
    const metronome = isMetronomeOn();
    countBeat = metronome ? beatLength() : QUICK_BEAT;
    countBeats = metronome ? COUNT_IN_BEATS : QUICK_COUNT;
    startedAt = (metronome ? beatAfter(now + 0.05) : now + 0.1) + countBeats * countBeat;
    if (!metronome) {
      for (let i = 0; i < countBeats; i++) playClick(startedAt - (countBeats - i) * countBeat, i === 0);
    }
    mode = 'counting';
    timer = setTimeout(begin, (startedAt - now) * 1000);
    notify();
  }

  function cancelCountIn() {
    clearTimeout(timer);
    mode = 'idle';
    notify();
  }

  function stopRecording() {
    clearTimeout(timer);
    // Within a moment of the limit counts as the full length (the stop timer can fire a few ms early).
    const elapsed = clock() - startedAt;
    let duration = elapsed > MAX_LENGTH - 0.1 ? MAX_LENGTH : elapsed;
    if (isMetronomeOn()) {
      const beat = beatLength();
      duration = Math.min(Math.max(1, Math.round(duration / beat)), Math.floor(MAX_LENGTH / beat)) * beat;
    }
    // A take with no hits is dropped, so the previous recording stays.
    if (take.length) {
      length = Math.max(duration, MIN_LENGTH);
      events = take.filter((event) => event.at < length).map((event) => ({ ...event, layer: 0 }));
      layers = 0;
      version++;
    }
    mode = 'idle';
    notify();
  }

  function startPlaying() {
    if (!events.length) return;
    const context = getAudio().context;
    playStart = isMetronomeOn() ? beatAfter(context.currentTime + 0.03) : context.currentTime + 0.05;
    cycleStart = playStart;
    next = 0;
    bookedUntil = 0;
    mode = 'playing';
    notify();
    stopScheduler = startScheduler(context, (until) => {
      for (;;) {
        if (!events.length) return stopPlaying();
        if (next >= events.length) {
          if (!loop) {
            if (context.currentTime >= cycleStart + length) stopPlaying();
            break;
          }
          cycleStart += length;
          next = 0;
        }
        const time = cycleStart + events[next].at;
        if (time >= until) break;
        play(events[next].id, time);
        next++;
      }
      bookedUntil = until;
    });
  }

  function stopPlaying() {
    stopScheduler?.();
    stopScheduler = null;
    if (mode === 'overdubbing') stopOverdub();
    if (isPlaying()) {
      mode = 'idle';
      notify();
    }
  }

  // Overdub: while playing, new hits are added to the pattern as a new layer (loop turns on so you can keep adding).
  function startOverdub() {
    loop = true;
    layers++;
    layerHits = 0;
    version++; // the new, still empty layer is drawn straight away
    mode = 'overdubbing';
    notify();
  }

  function stopOverdub() {
    if (layerHits === 0) {
      layers--;
      version++;
    }
    mode = 'playing';
    notify();
  }

  return {
    /** Rec button: always a fresh recording (count-in with the metronome on); pressed again, it stops or cancels. */
    toggleRecord() {
      if (mode === 'counting') cancelCountIn();
      else if (mode === 'recording') stopRecording();
      else {
        stopPlaying();
        startRecording();
      }
    },
    /** Layer button: plays the recording (if needed) and adds what you play on top; pressed again, stops adding. */
    toggleLayer() {
      if (mode === 'overdubbing') return stopOverdub();
      if (!events.length || mode === 'counting' || mode === 'recording' || layers >= MAX_LAYERS) return;
      if (mode === 'idle') startPlaying();
      startOverdub();
    },
    /** The hits for drawing: each with its time in the pattern and its layer. While recording: the take so far. */
    pattern() {
      if (mode !== 'recording') return { events, length, layers, version };
      const take0 = take.map((event) => ({ ...event, layer: 0 }));
      const elapsed = clock() - startedAt;
      return { events: take0, length: VIEW_STEPS.find((step) => step >= elapsed) ?? MAX_LENGTH, layers: 0, version };
    },
    /** Play button: play from the start, or stop. Ends a recording or count-in first. */
    togglePlay() {
      if (mode === 'counting') cancelCountIn();
      if (mode === 'recording') stopRecording();
      if (isPlaying()) stopPlaying();
      else startPlaying();
    },
    /** @param {boolean} on */
    setLoop(on) {
      loop = on;
      notify();
    },
    /** Removes the most recent overdub layer (the first take stays). */
    undoLayer() {
      if (layers === 0) return;
      if (mode === 'overdubbing') mode = 'playing';
      events = events.filter((event) => event.layer !== layers);
      layers--;
      version++;
      if (isPlaying()) resync();
      notify();
    },
    /** Deletes the whole recording. */
    deleteRecording() {
      if (mode === 'counting') cancelCountIn();
      if (mode === 'recording') clearTimeout(timer);
      stopPlaying();
      events = [];
      take = [];
      layers = 0;
      length = 0;
      version++;
      mode = 'idle';
      notify();
    },
    /** Call for every live hit; kept while recording or overdubbing. */
    recordHit(id) {
      if (events.length + take.length >= MAX_HITS) return;
      const now = clock();
      if (mode === 'counting' || mode === 'recording') {
        const at = now - startedAt;
        if (at >= -EARLY_GRACE) {
          take.push({ id, at: Math.max(0, at) });
          version++;
        }
      } else if (mode === 'overdubbing' && now >= playStart) {
        const at = (now - playStart) % length;
        const index = events.findIndex((event) => event.at > at);
        events.splice(index === -1 ? events.length : index, 0, { id, at, layer: layers });
        layerHits++;
        version++;
        resync();
      }
    },
    /** Live timing for the display. */
    status() {
      // Idle needs no clock, so the display never starts the audio before the first click.
      if (mode === 'idle') return { mode, length: events.length ? length : 0 };
      const now = clock();
      if (mode === 'counting') {
        const left = Math.ceil((startedAt - now) / countBeat);
        return { mode, beatsLeft: Math.min(countBeats, Math.max(1, left)) };
      }
      if (mode === 'recording') return { mode, elapsed: Math.max(0, now - startedAt), limit: MAX_LENGTH };
      return { mode, position: now < playStart ? 0 : (now - playStart) % length, length };
    },
  };
}

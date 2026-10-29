// Transport: the Rec button in the toolbar (with the time used out of the limit while recording, and the countdown in
// the middle of the kit before it) and the metronome chip: it shows only while the metronome is on (switched on in
// the ⋮ menu) and a tap on it turns the metronome off.
import { ICONS, METRONOME_PICTURE } from './icons.js';
import { attachTooltip } from './tooltip.js';
import { confirmToast } from './confirm-toast.js';
import { getAudio } from '../audio/engine.js';
import { startMetronome, stopMetronome, isMetronomeOn, lastBeat, onTempoChange } from '../audio/metronome.js';
import { createCountdown } from './countdown.js';

const FLASH = 0.15; // seconds the beat light stays lit after each click
const WARN_LAST = 10; // seconds before the recording limit when the timer starts blinking

const formatTime = (seconds) => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;

/**
 * Fills the transport area and keeps its timer and beat light up to date.
 * @param {HTMLElement} area the empty toolbar element
 * @param {ReturnType<typeof import('../audio/recorder.js').createRecorder>} recorder
 * @returns {{render: (state: import('../audio/recorder.js').RecorderState) => void}}
 */
export function setupTransport(area, recorder) {
  area.innerHTML = `
  <div class="recorder-group" role="group" aria-label="Recorder">
    <button type="button" class="transport-button record-button" data-transport="record">
      <span class="record-dot" aria-hidden="true"></span><span class="record-label">Rec</span>
    </button>
  </div>
  <button type="button" class="metronome-button" data-transport="metronome" aria-label="Metronome">
    ${ICONS.metronome}<span class="tempo-label"></span><span class="beat-light" aria-hidden="true"></span>
  </button>`;

  const part = (selector) => area.querySelector(selector);
  const [record, metronome] = ['record', 'metronome'].map((id) => part(`[data-transport=${id}]`));
  let state = { mode: 'idle', loop: false, hasRecording: false, layers: 0 };
  let frame = 0;
  const countdown = createCountdown();

  // Rec asks first when a recording already exists, so it is never overwritten by accident.
  let closeAsk = () => {};
  record.addEventListener('click', () => {
    if (state.hasRecording && !['counting', 'recording'].includes(state.mode)) {
      closeAsk = confirmToast(record, 'Start a new recording? It replaces the one you have.', 'Yes, record', () => {
        recorder.toggleRecord();
        tick();
      });
    } else {
      recorder.toggleRecord();
    }
    tick();
  });
  metronome.addEventListener('click', () => {
    if (isMetronomeOn()) stopMetronome();
    else startMetronome();
    metronome.setAttribute('aria-pressed', String(isMetronomeOn()));
    document.dispatchEvent(new CustomEvent('metronome-change'));
    tick();
  });
  onTempoChange((bpm) => {
    part('.tempo-label').textContent = String(bpm);
    metronome.setAttribute('aria-label', `Metronome, ${bpm} BPM`);
  });
  attachTooltip(record, { title: 'Record', lines: ['Records the drums you play: your hits only, never your voice or any sound around you.', 'Up to 2 minutes. It stays on this device.'] });
  attachTooltip(metronome, { title: 'Metronome', picture: METRONOME_PICTURE, lines: ['A steady tick that helps you keep time; Rec counts in 4 clicks while it is on.', 'Tap to turn it off. Turn it on and set the speed in the ⋮ menu.'] });
  // The ⋮ menu switches the metronome too: the chip follows.
  document.addEventListener('metronome-change', () => {
    metronome.setAttribute('aria-pressed', String(isMetronomeOn()));
    tick();
  });

  // Runs every animation frame while something is moving: the count-in, the recording timer or the beat light.
  function tick() {
    cancelAnimationFrame(frame);
    const status = recorder.status();
    countdown.update(status);
    record.classList.toggle('is-near-limit', status.mode === 'recording' && status.limit - status.elapsed <= WARN_LAST);
    const label = part('.record-label');
    if (status.mode === 'counting') label.textContent = String(status.beatsLeft);
    else if (status.mode === 'recording') label.textContent = `Stop ${formatTime(status.elapsed)} / ${formatTime(status.limit)}`;
    else label.textContent = 'Rec';

    const now = isMetronomeOn() ? getAudio().context.currentTime : 0;
    const beat = isMetronomeOn() ? lastBeat(now) : null;
    const glow = beat ? Math.max(0, 1 - (now - beat.time) / FLASH) : 0;
    // Dim between beats while the metronome runs, so the light is visibly "on"; hidden when it is off.
    part('.beat-light').style.opacity = isMetronomeOn() ? String(0.2 + 0.8 * glow) : '0';
    // The stage light over the kit pulses with the beat too (read by kit.css).
    document.documentElement.style.setProperty('--beat-glow', glow.toFixed(3));
    part('.beat-light').classList.toggle('is-accent', Boolean(beat?.accent));

    if (status.mode === 'counting' || status.mode === 'recording' || isMetronomeOn()) frame = requestAnimationFrame(tick);
  }

  function render(next) {
    state = next;
    const busy = state.mode === 'counting' || state.mode === 'recording';
    record.classList.toggle('is-recording', state.mode === 'recording');
    record.classList.toggle('is-counting', state.mode === 'counting');
    record.setAttribute('aria-pressed', String(busy));
    record.setAttribute('aria-label', busy ? 'Stop recording' : state.hasRecording ? 'New recording (replaces the current one)' : 'Record');
    if (busy) closeAsk();
    tick();
  }

  metronome.setAttribute('aria-pressed', 'false');
  render(state);
  return { render };
}

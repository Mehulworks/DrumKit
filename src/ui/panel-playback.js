// Panel playback: the play time ("0:01 / 0:04"), Play/Stop beside it, then Loop, at the top of the recording panel. While
// recording, the same button stops the recording.
import { ICONS } from './icons.js';

const formatTime = (seconds) => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
const formatLength = (seconds) => formatTime(Math.max(1, Math.round(seconds)));

/**
 * @param {HTMLElement} group the empty playback element in the panel
 * @param {ReturnType<typeof import('../audio/recorder.js').createRecorder>} recorder
 */
export function setupPanelPlayback(group, recorder) {
  group.innerHTML = `
    <span class="panel-time" aria-hidden="true"></span>
    <button type="button" class="panel-button play-button" data-panel="play"></button>
    <button type="button" class="panel-button icon-only loop-button" data-panel="loop" aria-label="Loop" title="Loop">${ICONS.loop}</button>`;
  const play = group.querySelector('[data-panel=play]');
  const loop = group.querySelector('[data-panel=loop]');
  const time = group.querySelector('.panel-time');
  let state = { mode: 'idle', loop: false, hasRecording: false, layers: 0 };

  const busy = () => state.mode === 'counting' || state.mode === 'recording';
  // While recording (or counting in), the button stops the recording instead.
  play.addEventListener('click', () => (busy() ? recorder.toggleRecord() : recorder.togglePlay()));
  loop.addEventListener('click', () => recorder.setLoop(!state.loop));

  return {
    /** @param {import('../audio/recorder.js').RecorderState} next */
    render(next) {
      state = next;
      const playing = state.mode === 'playing' || state.mode === 'overdubbing';
      const stopLabel = busy() ? 'Stop recording' : 'Stop';
      play.innerHTML = playing || busy() ? `${ICONS.stop}<span class="panel-button-text">Stop</span>` : `${ICONS.play}<span class="panel-button-text">Play</span>`;
      play.setAttribute('aria-label', playing || busy() ? stopLabel : 'Play');
      play.title = playing || busy() ? stopLabel : 'Play';
      play.classList.toggle('is-playing', playing);
      play.classList.toggle('is-recording', busy());
      play.disabled = !state.hasRecording && !busy();
      loop.disabled = !state.hasRecording || busy();
      loop.setAttribute('aria-pressed', String(state.loop));
    },
    /** Called every frame while playing (and on each change): the play position, or just the length when stopped. */
    showTime(status) {
      const playing = status.mode === 'playing' || status.mode === 'overdubbing';
      time.textContent = playing ? `${formatTime(status.position)} / ${formatLength(status.length)}`
        : status.length ? formatLength(status.length) : '';
    },
  };
}

// Panel playback: the play time ("0:01 / 0:04"), Play/Pause beside it, then Loop, at the top of the recording panel. Pause
// keeps the place, so Play carries on from there. While recording (the take or a layer) it is a greyed Play: the red
// Stop under the layers stops recording.
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

  const recording = () => ['counting', 'recording', 'overdubbing'].includes(state.mode);
  play.addEventListener('click', () => recorder.togglePlay());
  loop.addEventListener('click', () => recorder.setLoop(!state.loop));

  return {
    /** @param {import('../audio/recorder.js').RecorderState} next */
    render(next) {
      state = next;
      const playing = state.mode === 'playing';
      play.innerHTML = playing ? `${ICONS.pause}<span class="panel-button-text">Pause</span>` : `${ICONS.play}<span class="panel-button-text">Play</span>`;
      play.setAttribute('aria-label', playing ? 'Pause' : state.paused ? 'Play from where it paused' : 'Play');
      play.title = playing ? 'Pause' : 'Play';
      play.classList.toggle('is-playing', playing);
      play.disabled = !state.hasRecording || recording();
      loop.disabled = !state.hasRecording || state.mode === 'counting' || state.mode === 'recording';
      loop.setAttribute('aria-pressed', String(state.loop));
    },
    /** Called every frame while playing (and on each change): the play position, or just the length when stopped. */
    showTime(status) {
      const playing = status.mode === 'playing' || status.mode === 'overdubbing';
      time.textContent = playing || status.position ? `${formatTime(status.position)} / ${formatLength(status.length)}`
        : status.length ? formatLength(status.length) : '';
    },
  };
}

// Download: renders the recording (all layers) and saves it as a WAV file on this device. Nothing is uploaded.
import { renderRecording } from '../audio/render-recording.js';
import { toWav } from '../audio/wav.js';
import { showToast } from './toast.js';

const fileName = () => `drum-recording-${new Date().toISOString().slice(0, 10)}.wav`;

/**
 * @param {HTMLButtonElement} button the Download button (shows "Saving…" while the file is made)
 * @param {{events: {id: string, at: number}[], length: number}} pattern
 */
export async function downloadRecording(button, pattern) {
  if (!pattern.events.length || button.classList.contains('is-saving')) return;
  const label = button.querySelector('.panel-button-text');
  button.classList.add('is-saving');
  button.setAttribute('aria-busy', 'true');
  if (label) label.textContent = 'Saving…';
  try {
    const url = URL.createObjectURL(toWav(await renderRecording(pattern)));
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName();
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 10000); // freed once the browser has taken the file
  } catch {
    showToast('Sorry, the recording could not be saved on this browser.');
  } finally {
    button.classList.remove('is-saving');
    button.removeAttribute('aria-busy');
    if (label) label.textContent = 'Download';
  }
}

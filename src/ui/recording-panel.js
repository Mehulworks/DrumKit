// Recording panel: under the toolbar once something is recorded, with a caret pointing at Rec. Top row: title, the
// time / Loop / Play, Download and Delete, help. Then a labelled timeline (one row per layer), and Add layer / Undo. After a
// recording is deleted it shrinks to a short note.
import { ICONS } from './icons.js';
import { attachTooltip } from './tooltip.js';
import { confirmToast } from './confirm-toast.js';
import { showTipOnce } from './tip.js';
import { downloadRecording } from './download-recording.js';
import { setupPanelPlayback } from './panel-playback.js';
import { recordingPanelMarkup } from './recording-panel-markup.js';
import { createPanelCaret } from './panel-caret.js';
import { markPositions, glideMarks } from './timeline-glide.js';

const layerWord = (count) => (count === 1 ? '1 layer' : `${count} layers`);
const formatTime = (seconds) => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;

/**
 * Fills the panel and keeps it in step with the recorder.
 * @param {HTMLElement} panel the empty panel element
 * @param {ReturnType<typeof import('../audio/recorder.js').createRecorder>} recorder
 * @param {number} maxLayers most layers allowed on top of the first take
 * @param {() => void} showLayerHelp opens the guide at the layers section
 * @returns {{render: (state: import('../audio/recorder.js').RecorderState) => void, fold: () => void}}
 */
export function setupRecordingPanel(panel, recorder, maxLayers, showLayerHelp) {
  panel.innerHTML = recordingPanelMarkup();

  const part = (selector) => panel.querySelector(selector);
  const [layer, undo, save, del, help] = ['layer', 'undo', 'download', 'delete', 'help'].map((id) => part(`[data-panel=${id}]`));
  const fold = part('.panel-fold:not(.panel-close)');
  const playback = setupPanelPlayback(part('.panel-playback'), recorder);
  const aimCaret = createPanelCaret(panel, () => document.querySelector('[data-transport=record]'));
  let closeAsk = () => {};
  let state = { mode: 'idle', loop: false, hasRecording: false, layers: 0 };
  let showDeletedNote = false;
  let drawnVersion = -1;
  let drawnLength = 0;
  let frame = 0;

  function setFolded(folded) {
    panel.classList.toggle('is-folded', folded);
    fold.setAttribute('aria-expanded', String(!folded));
    fold.setAttribute('aria-label', folded ? 'Open the recording panel' : 'Fold the recording panel');
  }

  layer.addEventListener('click', () => recorder.toggleLayer());
  undo.addEventListener('click', () => recorder.undoLayer());
  save.addEventListener('click', () => downloadRecording(save, recorder.pattern()));
  del.addEventListener('click', () => {
    closeAsk = confirmToast(del, 'Delete the whole recording, with all its layers?', 'Yes, delete', () => recorder.deleteRecording());
  });
  help.addEventListener('click', () => showLayerHelp());
  fold.addEventListener('click', () => setFolded(!panel.classList.contains('is-folded')));
  part('.panel-close').addEventListener('click', () => {
    showDeletedNote = false;
    panel.hidden = true;
  });
  // Folded: the whole bar opens the panel (the chevron stays the keyboard control).
  panel.addEventListener('click', (event) => {
    if (panel.classList.contains('is-folded') && !event.target.closest('button')) setFolded(false);
  });
  // The row being recorded can be clicked to stop adding; the next empty row, to start adding.
  part('.timeline-rows').addEventListener('click', (event) => {
    if (event.target.closest('.is-recording-row, .is-next-row')) recorder.toggleLayer();
  });
  attachTooltip(layer, { title: 'Add a layer', lines: ['Plays your recording and adds what you play on top, like a second drummer.', `Press again to stop. Up to ${maxLayers} layers.`] });

  // One row per layer: the first take, then Layer 1, 2, 3, each with a tick for every hit. Every row is there from the
  // start (empty ones dashed), so the panel never grows and the kit never moves again; the next empty row says "Tap to
  // add a layer". While a layer is being added, its row is highlighted and says what to do until the first hit.
  function drawRows({ events, length, layers }, glide = false) {
    const canAdd = state.hasRecording && (state.mode === 'idle' || state.mode === 'playing');
    const adding = state.mode === 'overdubbing';
    const rows = [];
    const firstTake = state.mode === 'counting' && !state.hasRecording ? 'Get ready…'
      : state.mode === 'recording' ? 'Play the drums…' : '';
    for (let row = 0; row <= maxLayers; row++) {
      const recording = (adding && row === layers) || (firstTake !== '' && row === 0);
      const empty = !recording && (row > layers || !state.hasRecording);
      const next = empty && canAdd && row === layers + 1;
      const hits = events.filter((event) => event.layer === row);
      const ticks = hits.map((event) => `<i style="left:${((event.at / length) * 100).toFixed(2)}%"></i>`).join('');
      const hintText = firstTake || 'Play the drums to fill this layer…';
      const hint = recording && !hits.length ? `<span class="row-hint">${hintText}</span>`
        : next ? '<span class="row-hint">Tap to add a layer</span>' : '';
      const kind = recording ? ' is-recording-row' : empty ? ` is-empty-row${next ? ' is-next-row' : ''}` : '';
      rows.push(`<div class="timeline-row row-${row}${kind}"
        ${recording ? 'title="Recording this layer: click to stop"' : next ? 'title="Add a layer"' : ''}>
        <span class="row-label"><span class="label-long">${row === 0 ? 'First take' : `Layer ${row}`}</span><span class="label-short" aria-hidden="true">${row === 0 ? 'Take' : `L${row}`}</span></span>
        <span class="row-track">${ticks}${hint}</span></div>`);
    }
    const before = glide ? markPositions(part('.timeline-rows')) : null;
    part('.timeline-rows').innerHTML = rows.join('');
    if (before) glideMarks(part('.timeline-rows'), before);
    showMeta({ events, length, layers });
  }

  // "2 layers", or while adding: "recording layer 2…", with "play now" until its first hit. The length shows by Play.
  function showMeta({ events, layers }) {
    const adding = state.mode === 'overdubbing';
    const empty = adding && !events.some((event) => event.layer === layers);
    part('.panel-meta').textContent = adding
      ? `Recording layer ${layers}${empty ? ': play now' : '…'}`
      : layers ? layerWord(layers) : 'No layers yet';
  }

  // Runs every animation frame while playing or recording: moves the playback line and adds new hits as they come.
  // While recording, the first-take row is redrawn every frame (it stretches as the take grows); while counting in
  // with no recording yet, its empty row says "Get ready…".
  function tick() {
    cancelAnimationFrame(frame);
    const pattern = recorder.pattern();
    const status = recorder.status();
    const busy = status.mode === 'counting' || status.mode === 'recording';
    if ((pattern.version !== drawnVersion || pattern.length !== drawnLength) && (pattern.length || busy)) {
      // A new time scale (the take outgrew its view, or a stopped take fits its real length): the marks glide.
      drawRows(pattern, drawnLength > 0 && pattern.length > 0 && pattern.length !== drawnLength);
      drawnVersion = pattern.version;
      drawnLength = pattern.length;
    }
    playback.showTime(status);
    if (status.mode === 'counting') part('.panel-meta').textContent = 'Get ready…';
    if (status.mode === 'recording') part('.panel-meta').textContent = `Recording… ${formatTime(status.elapsed)} / ${formatTime(status.limit)}`;
    const playing = status.mode === 'playing' || status.mode === 'overdubbing';
    // The moving line: the play position, or while recording the "now" point sweeping left to right.
    const taking = status.mode === 'recording';
    const position = playing ? status.position / status.length : taking ? Math.min(1, status.elapsed / pattern.length) : 0;
    panel.style.setProperty('--position', String(position));
    panel.classList.toggle('is-playing', playing || taking);
    if (busy) aimCaret(); // Rec's label changes width while counting and recording
    if (playing || busy) frame = requestAnimationFrame(tick);
  }

  function render(next) {
    const hadRecording = state.hasRecording;
    state = next;
    const busy = state.mode === 'counting' || state.mode === 'recording';
    const adding = state.mode === 'overdubbing';
    const full = state.layers >= maxLayers;

    // After Delete, the panel shrinks to a short note until a new recording starts or it is closed.
    if (hadRecording && !state.hasRecording) showDeletedNote = true;
    if (state.hasRecording || busy) showDeletedNote = false;
    panel.hidden = !state.hasRecording && !showDeletedNote && !busy;
    panel.classList.toggle('is-empty', !state.hasRecording && showDeletedNote);
    if (!state.hasRecording) {
      closeAsk();
      setFolded(false);
    }

    showMeta(recorder.pattern());
    playback.render(state);

    layer.classList.toggle('is-recording', adding);
    panel.classList.toggle('is-rec-live', busy || adding);
    layer.disabled = busy || (full && !adding);
    part('.layer-button .panel-button-text').textContent = adding ? 'Stop adding' : 'Add layer';
    layer.setAttribute('aria-label', adding ? 'Stop adding the layer' : full ? `Add layer (the limit of ${maxLayers} is reached)` : 'Add a layer');
    layer.title = full && !adding ? `Up to ${maxLayers} layers` : '';
    undo.disabled = busy || state.layers === 0;
    del.disabled = busy;
    save.disabled = busy || adding;
    drawnVersion = -1; // redraw the rows: the highlighted one depends on whether a layer is being added
    tick();
    aimCaret();

    // First recording ever: point at Add layer once.
    if (!hadRecording && state.hasRecording && state.mode === 'idle') {
      showTipOnce('layer', layer, `Tip: press <strong>Add layer</strong> to play more drums on top of your recording, or ${ICONS.download} to save it as a sound file.`,
        { label: 'How layers work →', onClick: showLayerHelp });
    }
  }

  render(state);
  return {
    render,
    /** Folds the panel to its one line (phones, while a lesson is open); the recording itself is kept. */
    fold: () => { if (!panel.hidden && state.hasRecording) setFolded(true); },
  };
}

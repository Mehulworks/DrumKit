// Recording panel markup: the title and status, the player, Download / Delete / help, the layer timeline, Add layer and
// Undo, the fold button and the close button of the note after Delete.
import { ICONS } from './icons.js';

export const recordingPanelMarkup = () => `
  <div class="panel-info">
    <p class="recording-title">Your recording <span class="rec-badge" aria-hidden="true">REC</span></p>
    <p class="panel-meta"></p>
  </div>
  <div class="panel-playback" role="group" aria-label="Playback"></div>
  <p class="panel-empty-text">Recording deleted. Press <strong>● Rec</strong> to start a new one.</p>
  <button type="button" class="panel-button icon-only save-button" data-panel="download" aria-label="Download as a WAV file" title="Download as a WAV file">
    ${ICONS.download}
  </button>
  <button type="button" class="panel-button icon-only delete-button" data-panel="delete" aria-label="Delete recording" title="Delete recording">
    ${ICONS.trash}
  </button>
  <button type="button" class="panel-button icon-only help-button" data-panel="help" aria-label="How layers work" title="How layers work">
    ${ICONS.help}
  </button>
  <div class="panel-timeline">
    <div class="timeline-rows"></div>
    <span class="timeline-playhead" aria-hidden="true"></span>
  </div>
  <div class="panel-footer">
    <div class="panel-layer-actions">
      <button type="button" class="panel-button layer-button" data-panel="layer">
        <span class="record-dot" aria-hidden="true"></span>${ICONS.plus}<span class="panel-button-text">Add layer</span>
      </button>
      <button type="button" class="panel-button" data-panel="undo" aria-label="Undo last layer" title="Undo last layer">
        ${ICONS.undo}<span class="panel-button-text">Undo layer</span>
      </button>
    </div>
  </div>
  <button type="button" class="panel-fold" aria-expanded="true" aria-label="Fold the recording panel">${ICONS.chevron}</button>
  <button type="button" class="panel-fold panel-close" aria-label="Close">${ICONS.close}</button>`;

// Lesson bar markup: the name and info line, the beat grid, the mode switch, Start, the extras (Demo, click, speed;
// a ⋮ dropdown on phones), the result buttons, and the corner with ⋮ and ✕.
import { ICONS } from './icons.js';

export const learnPanelMarkup = () => `
  <div class="learn-info">
    <p class="learn-title"></p>
    <p class="learn-meta" aria-live="polite"></p>
  </div>
  <div class="beat-grid"></div>
  <div class="learn-actions">
    <div class="segmented learn-mode" role="group" aria-label="Mode">
      <button type="button" data-learn-mode="time" aria-pressed="true">In time</button>
      <button type="button" data-learn-mode="steps" aria-pressed="false">Step by step</button>
    </div>
    <button type="button" class="learn-primary" data-learn="start"></button>
    <div class="learn-extras" id="learn-extras">
      <button type="button" class="learn-secondary" data-learn="demo">${ICONS.sticks}<span class="panel-button-text">Demo</span></button>
      <div class="learn-tertiary in-time-only">
        <button type="button" class="learn-ghost learn-click" data-learn="click" aria-pressed="true" aria-label="Metronome click">${ICONS.metronome}<span class="extras-label">Click</span><span class="extras-switch" aria-hidden="true"></span></button>
        <span class="extras-label extras-speed">Speed</span>
        <button type="button" class="learn-ghost" data-learn="slower" aria-label="Slower">−</button>
        <output class="learn-speed-value"></output>
        <button type="button" class="learn-ghost" data-learn="faster" aria-label="Faster">+</button>
      </div>
    </div>
    <button type="button" class="learn-secondary learn-next" data-learn="push" hidden>10% faster →</button>
    <button type="button" class="learn-secondary learn-next" data-learn="next" hidden>Next →</button>
  </div>
  <div class="learn-corner">
    <button type="button" class="learn-ghost learn-more-button" data-learn-more aria-expanded="false" aria-controls="learn-extras"
      aria-label="More: demo, click and speed">${ICONS.more}</button>
    <button type="button" class="panel-fold" data-learn="close" aria-label="Leave the lesson">${ICONS.close}</button>
  </div>`;

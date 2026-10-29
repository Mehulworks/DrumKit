// Help pictures: small live drawings of the real UI for the guide (Rec turning red, Add layer, layer rows filling in,
// the metronome light) and a keyboard map. Made in code, so they match the theme and stay up to date.
import { keyName } from '../kit/key-labels.js';
import { METRONOME_PICTURE } from './icons.js';

const ticks = (spots) => spots.map((at) => `<i style="left:${at}%"></i>`).join('');
const BEAT = [6, 31, 56, 81];

/** Rec: idle, then red with a running timer, on a loop. */
export const recordPicture = () => `
  <div class="mock-stage">
    <span class="mock-pill mock-record">
      <span class="mock-dot"></span><span class="mock-idle">Rec</span><span class="mock-live">0:03 / 2:00</span>
    </span>
  </div>`;

/** The recording panel after a first take, with Add layer pulsing. */
export const addLayerPicture = () => `
  <div class="mock-stage mock-panel">
    <span class="mock-panel-title">Your recording</span>
    <span class="mock-track mock-row-0">${ticks(BEAT)}</span>
    <span class="mock-pill mock-add">+ Add layer</span>
  </div>`;

/** A layer being recorded: its red row fills with hits as the playback line passes. */
export const layeringPicture = () => `
  <div class="mock-stage mock-timeline">
    <span class="mock-label">First take</span><span class="mock-track mock-row-0">${ticks(BEAT)}</span>
    <span class="mock-label mock-recording">● Layer 1</span>
    <span class="mock-track mock-row-1 mock-filling"><span class="mock-reveal">${ticks([18, 43, 68, 93])}</span></span>
    <span class="mock-playhead"></span>
  </div>`;

/** A finished beat: the first take plus three layers, each in its own colour. */
export const stackPicture = () => `
  <div class="mock-stage mock-timeline">
    <span class="mock-label">First take</span><span class="mock-track mock-row-0">${ticks(BEAT)}</span>
    <span class="mock-label">Layer 1</span><span class="mock-track mock-row-1">${ticks([18, 43, 68, 93])}</span>
    <span class="mock-label">Layer 2</span><span class="mock-track mock-row-2">${ticks([6, 12, 18, 25, 31, 37, 43, 50, 56, 62, 68, 75, 81, 87, 93])}</span>
    <span class="mock-label">Layer 3</span><span class="mock-track mock-row-3">${ticks([6, 56])}</span>
  </div>`;

/** A swinging metronome beside four beats (the first one gold); the arm swings once per beat. */
export const metronomePicture = () => `
  <div class="mock-stage mock-beats">
    <span class="mock-metronome">${METRONOME_PICTURE}</span>
    ${[0, 1, 2, 3].map((beat) => `<span class="mock-beat${beat === 0 ? ' is-first' : ''}" style="--beat:${beat}"></span>`).join('')}
  </div>`;

// Short names so the labels fit under the keys.
const SHORT = { 'Crash Left': 'Crash L', 'Crash Right': 'Crash R', 'Open Hi-Hat': 'Open', 'Floor Tom': 'Floor' };

/**
 * A keyboard map with the drum keys lit and labelled.
 * @param {Array<{label: string, key: string}>} pads
 */
export function keyboardPicture(pads) {
  const byKey = new Map(pads.map((pad) => [keyName(pad.key), SHORT[pad.label] ?? pad.label]));
  const key = (letter) => {
    const drum = byKey.get(letter);
    return drum ? `<span class="kb-key is-drum"><b>${letter}</b><small>${drum}</small></span>`
      : `<span class="kb-key"><b>${letter}</b></span>`;
  };
  const rows = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM']
    .map((row, index) => `<div class="kb-row" style="--indent:${index}">${[...row].map(key).join('')}</div>`).join('');
  return `<div class="kb">${rows}<div class="kb-row kb-space"><span class="kb-key is-drum"><b>Space</b><small>${byKey.get('Space')}</small></span></div></div>`;
}

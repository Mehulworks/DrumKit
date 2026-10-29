// Starts the app: puts the chosen kit on stage in its theme, connects touch, mouse and keys to the sounds, and sets up
// the toolbar, recorder, panels and drawers. Plays a short intro sting on load (or on the first touch, where the
// browser needs one); kits, themes and backgrounds can be swapped live from the Customize drawer.
import './styles.js';
import { getKit } from './kit/kits/index.js';
import { gridKit } from './kit/grid-layout.js';
import { getTheme, applyTheme } from './kit/art/themes.js';
import { applyBackdrop, glowBackdropLights } from './kit/art/backdrops.js';
import { canFlash } from './ui/flash-lights.js';
import { createStage } from './kit/stage.js';
import { createSticks } from './kit/sticks.js'; // sticks
import { playDrum, useSounds } from './audio/drums.js';
import { getAudio, unlockAudioOnFirstGesture } from './audio/engine.js';
import { playIntro } from './audio/intro.js';
import { createRecorder, MAX_LAYERS } from './audio/recorder.js';
import { listenToPointers } from './input/pointer.js';
import { listenToKeys } from './input/keyboard.js';
import { setupToolbar } from './ui/toolbar.js';
import { setupTransport } from './ui/transport.js';
import { setupRecordingPanel } from './ui/recording-panel.js';
import { setupEqPanel } from './ui/eq-panel.js';
import { setupMenuSettings, setupResetAll } from './ui/menu-settings.js';
import { setupHelpDrawer } from './ui/help-drawer.js';
import { setupKitDrawer } from './ui/kit-drawer.js';
import { setupSticksSettings } from './ui/sticks-settings.js'; // sticks
import { setupBackdropPicker } from './ui/backdrop-picker.js';
import { setupCredits, setupMenuCredit } from './ui/credits.js';
import { setupRotateNotice } from './ui/rotate-notice.js';
import { setupFocusMode } from './ui/focus-mode.js';
import { setupMoreMenu } from './ui/more-menu.js';
import { showTipOnce } from './ui/tip.js';
import { setupConcertMode } from './ui/concert-mode.js';
import { createCues } from './kit/cues.js';
import { createLessonFocus } from './kit/lesson-focus.js';
import { setupLearn } from './learn-setup.js';
import { settings } from './ui/storage.js';

const byId = (id) => document.getElementById(id);
const stage = createStage(byId('kit'));
let sticks = null; // sticks
let concert = null;
let cues = null; // the lesson glow on the kit on stage
let learn = null; // lessons and beats (learn-setup.js)
let lessonFocus = null; // names and keys on the drums a lesson uses

/**
 * Puts a kit on stage: its drawing, sounds and keys, in the chosen theme and on the chosen background.
 * @param {string} id kit id
 * @param {boolean} [changed] true when switching from another kit (the pieces settle in again)
 */
// The kit area's size in pixels: the Pad grid is drawn to fit it.
function areaSize() {
  const area = byId('kit');
  const pad = getComputedStyle(area);
  const width = area.clientWidth - parseFloat(pad.paddingLeft) - parseFloat(pad.paddingRight);
  const height = area.clientHeight - parseFloat(pad.paddingTop) - parseFloat(pad.paddingBottom);
  return { width, height };
}
const areaShape = () => { const { width, height } = areaSize(); return height > 0 ? width / height : 16 / 9; };
let gridShape = 0;
let gridWidth = 0;
function mountKit(id, changed = false) {
  // The Pad grid is the same kit (pads, keys, sounds) drawn as tiles: no theme art, floor or sticks there.
  const grid = settings.view === 'grid';
  gridShape = areaShape();
  gridWidth = areaSize().width;
  const kit = grid ? gridKit(getKit(id), areaSize()) : getKit(id);
  useSounds(kit.sounds);
  const { svg, motion } = stage.mount(kit);
  if (!grid) {
    applyTheme(svg, getTheme(settings.kitTheme), kit);
    applyBackdrop(svg, settings.background);
  }
  svg.classList.toggle('show-keys', settings.showKeys);
  sticks = grid ? null : createSticks(svg, kit.pads); // sticks
  sticks?.setVisible(settings.showSticks); // sticks
  sticks?.setLook(settings.look.stickType, settings.look); // sticks
  concert?.attach();
  learn?.stop(); // a lesson stops when the kit changes
  cues = createCues(svg, kit.pads, () => settings.flashLights && !matchMedia('(prefers-reduced-motion: reduce)').matches);
  lessonFocus = createLessonFocus(svg, kit.pads);
  learn?.refresh(); // the grid and labels follow the kit's drums
  motion.entrance(changed);
  help?.setPads(kit.pads);
}

/**
 * What the eye sees on every hit. Live hits flash white; the recording playing back glows gold.
 * @param {string} id
 * @param {{point?: {x: number, y: number}, playback?: boolean}} [options]
 */
function showHit(id, options = {}) {
  stage.showHit(id, options);
  // Lights answer hits at most twice a second, and never when flashing lights are off.
  const lights = canFlash();
  if (lights) glowBackdropLights(stage.current.svg);
  concert?.hit(id, lights);
  sticks?.hit(id); // sticks
}

// A hit booked at an exact audio-clock time (playback, the intro): the glow and movement follow when that time arrives.
function bookHit(id, time, options = {}) {
  playDrum(id, time);
  const delay = (time - getAudio().context.currentTime) * 1000;
  setTimeout(() => showHit(id, options), Math.max(0, delay));
}

const recorder = createRecorder((id, time) => bookHit(id, time, { playback: true }), (state) => {
  transport.render(state);
  panel.render(state);
  byId('kit').classList.toggle('is-recording', state.mode === 'recording' || state.mode === 'overdubbing');
});

let help = null;
mountKit(settings.kit);
// The Pad grid is redrawn when the kit area changes shape or size (the screen turns, a panel opens), but not while a
// lesson bar is open, so a lesson is never interrupted; it catches up once the lesson closes.
let refit = 0;
new ResizeObserver(() => {
  clearTimeout(refit);
  refit = setTimeout(() => {
    const changed = Math.abs(areaShape() - gridShape) / gridShape > 0.04 || Math.abs(areaSize().width - gridWidth) / gridWidth > 0.08;
    if (settings.view === 'grid' && changed && byId('learn-panel').hidden) mountKit(settings.kit);
  }, 150);
}).observe(byId('kit'));

unlockAudioOnFirstGesture();
playIntro((id, time) => bookHit(id, time));
listenToPointers(byId('kit'), hitPad);
// A tap that misses every drum still gets a faint ring on the floor.
byId('kit').addEventListener('pointerdown', (event) => {
  if (!event.target.closest('[data-pad]')) stage.floorTap({ x: event.clientX, y: event.clientY });
});
listenToKeys(() => stage.current.kit.pads, hitPad);

setupToolbar();
setupMoreMenu(byId('more-button'), byId('more-menu'));
setupCredits(byId('credits'));
setupMenuCredit(byId('menu-credit'));
setupRotateNotice();
// Focus mode closes any open drawer before the toolbar hides.
concert = setupConcertMode(byId('concert-button'), byId('kit'));
setupFocusMode(byId('focus-button'), byId('focus-exit'),
  () => document.querySelectorAll('.drawer.is-open [data-close]').forEach((close) => close.click()));
const transport = setupTransport(byId('transport'), recorder);
// The guide's "Try it" buttons make these real controls glow.
help = setupHelpDrawer(byId('help-button'), byId('help-drawer'), stage.current.kit.pads, MAX_LAYERS, {
  record: () => document.querySelector('[data-transport=record]'),
  layer: () => document.querySelector('[data-panel=layer]'),
  metronome: () => byId('more-button'), // the Metronome switch is in the ⋮ menu
  // Tools inside the closed More menu cannot glow, so the menu button glows for them.
  eq: () => byId('more-button'),
  focus: () => byId('more-button'),
  learn: () => byId('learn-button'),
  concert: () => byId('concert-button'),
  kit: () => byId('kit-button'),
});
const panel = setupRecordingPanel(byId('recording-panel'), recorder, MAX_LAYERS, () => help.open('layers'));

// Learn: lessons and beats, the lesson bar, scoreboard, lesson lock and phone turns (learn-setup.js).
learn = setupLearn({
  stage,
  bookHit,
  cues: () => cues,
  lessonFocus: () => lessonFocus,
  sticks: () => sticks, // sticks
  concert,
  panel,
});
const kitDrawer = setupKitDrawer(byId('kit-button'), byId('kit-drawer'), {
  onTheme: (id) => { if (!stage.current.kit.grid) applyTheme(stage.current.svg, getTheme(id), stage.current.kit); },
  onKit: (id) => mountKit(id, true),
  onView: () => mountKit(settings.kit, true),
  onReset: (tab) => tabResets[tab]?.reset(),
});
const tabResets = {}; // the EQ, Background and Sticks tabs each know how to reset themselves
tabResets.eq = setupEqPanel(kitDrawer.eq);
byId('eq-button').addEventListener('click', () => kitDrawer.openTab('eq')); // a shortcut to Customize > EQ
tabResets.backdrop = setupBackdropPicker(kitDrawer.backdrops, (id) => { if (!stage.current.kit.grid) applyBackdrop(stage.current.svg, id); });
tabResets.sticks = setupSticksSettings(kitDrawer.sticks, { // sticks
  setVisible: (on) => sticks?.setVisible(on), // sticks
  setLook: (type, extras) => sticks?.setLook(type, extras), // sticks
}); // sticks
setupMenuSettings(byId('menu-settings'), (show) => stage.current.svg.classList.toggle('show-keys', show));
setupResetAll(byId('reset-all'));

// Every live hit (touch, mouse, Hover or keyboard) goes through here, so all of them can be recorded.
// point is where on screen it was hit (keys have none, so their ripple starts in the middle).
let hitsSoFar = 0;
function hitPad(id, point) {
  if (!learn.allows(id)) return; // a drum the running lesson does not use stays silent
  // After a first visitor's first few hits, point out Learn and Concert once.
  if (++hitsSoFar === 6) {
    showTipOnce('discover', byId('learn-button'), 'New here? Try <strong>Learn</strong> to play real beats, or <strong>Concert</strong> to play to a crowd.');
  }
  playDrum(id);
  showHit(id, { point });
  recorder.recordHit(id);
  learn.hit(id);
}

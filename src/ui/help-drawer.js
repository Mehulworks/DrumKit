// Help drawer: an illustrated guide that starts by pointing to Learn (learn-drawer.js), then leads with layers (step
// cards with live pictures and "Try it" buttons), then kits and themes, recording, metronome, EQ, Focus & Concert,
// settings, privacy, a keyboard map and About (credit and links); quick-jump chips at the top.
import { ICONS } from './icons.js';
import { createDrawer } from './drawer.js';
import { spotlight } from './spotlight.js';
import { creditLine, repoLink } from './credits.js';
import { recordPicture, addLayerPicture, layeringPicture, stackPicture, metronomePicture, keyboardPicture } from './help-visuals.js';

const icon = (name) => `<span class="help-icon" aria-hidden="true">${ICONS[name]}</span>`;
const JUMPS = [['learn', 'Learn'], ['layers', 'Layers'], ['record', 'Record'], ['kits', 'Kits'], ['metronome', 'Metronome'], ['eq', 'EQ'], ['modes', 'Focus & Concert'], ['keys', 'Keys']];

function section(id, title, body) {
  return `<section class="help-section" id="help-${id}"><h3>${title}</h3>${body}</section>`;
}

function step(number, title, text, picture, tryTarget) {
  return `<li class="help-step">
    <div class="step-head"><span class="step-number">${number}</span><p class="step-title">${title}</p></div>
    <p>${text}</p>
    <div class="help-picture" aria-hidden="true">${picture}</div>
    ${tryTarget ? `<button type="button" class="try-button" data-try="${tryTarget}">Try it</button>` : ''}
  </li>`;
}

/**
 * Fills the Help drawer and connects it to its button.
 * @param {HTMLButtonElement} button the How to play button in the toolbar
 * @param {HTMLElement} panel the empty drawer element
 * @param {Array<{label: string, key: string}>} pads for the keyboard map
 * @param {number} maxLayers
 * @param {Record<string, () => HTMLElement | null>} targets real controls that "Try it" can point at
 * @returns {{open: (sectionId?: string) => void, setPads: (pads: Array<{label: string, key: string}>) => void}}
 *   open shows the guide (scrolled to a section if given); setPads updates the keyboard map for another kit
 */
export function setupHelpDrawer(button, panel, pads, maxLayers, targets) {
  panel.innerHTML = `
  <div class="drawer-header">
    <h2 class="drawer-title">How to play</h2>
    <button type="button" class="icon-button" data-close aria-label="Close the guide">${ICONS.close}</button>
  </div>
  <nav class="help-jumps" aria-label="Guide sections">
    ${JUMPS.map(([id, label]) => `<button type="button" class="chip" data-jump="${id}">${label}</button>`).join('')}
  </nav>
  <div class="help-body">
    ${section('learn', 'Learn to play', `
      <p class="help-lead">${icon('learn')} Press <strong>Learn</strong> in the toolbar for step-by-step <strong>Lessons</strong> and style <strong>Beats</strong> (funk, disco, reggae and more). A grid shows each drum's hits; a line sweeps across in time, and you hit when it reaches a dot. Press <strong>Demo</strong> to hear it first.</p>
      <button type="button" class="try-button" data-try="learn">Try it</button>`)}
    ${section('layers', 'Build a beat in layers', `
      <p class="help-lead">Record a simple beat, then add more drums on top, one layer at a time, like several drummers playing together.</p>
      <ol class="help-steps">
        ${step(1, 'Record a beat', `Press ${icon('record')} <strong>Rec</strong>, play a simple beat (for example kick and snare), then press Rec again. It turns red and counts while recording.`, recordPicture(), 'record')}
        ${step(2, 'Add a layer', `The <strong>recording panel</strong> appears under the toolbar. Press ${icon('plus')} <strong>Add layer</strong>: your beat starts playing.`, addLayerPicture(), 'layer')}
        ${step(3, 'Play on top', 'A new red row appears. Everything you play now fills it in, in time with your beat. Press <strong>Stop adding</strong> (or the red row) when done.', layeringPicture())}
        ${step(4, `Stack up to ${maxLayers} layers`, 'Each layer gets its own row and colour, and they all play together. Try hi-hat, then cymbals.', stackPicture())}
      </ol>
      <p>${icon('undo')} <strong>Undo layer</strong> removes the last layer. ${icon('trash')} <strong>Delete</strong> (click twice) removes the whole recording. ${icon('chevron')} folds the panel.</p>`)}
    ${section('record', 'Record', `
      <p>After you press Rec, a <strong>3, 2, 1</strong> countdown in the middle of the screen (4, 3, 2, 1 with the metronome on) shows when to start, and the recording panel fills in as you play. A recording can be up to 2 minutes. It records <strong>the drums only</strong>: the hits you play, never your voice or any sound around you. No microphone is used.</p>
      <p>In the recording panel, ${icon('play')} <strong>Play</strong> plays it back (its hits glow gold), and ${icon('loop')} <strong>Loop</strong> repeats it. ${icon('download')} <strong>Download</strong> saves it, with all its layers, as a WAV sound file on your device. Pressing Rec again starts a new recording; it asks “Replace?” first.</p>`)}
    ${section('kits', 'Kits and themes', `
      <p>Open <strong>Customize</strong> on the left edge of the screen. <strong>Kit</strong> switches between a Studio kit, an Electronic kit and a small Jazz kit, each with its own sounds; <strong>Look</strong> restyles the kit (colours, hoops, stickers and accessories such as mics and chains) without changing the sound; <strong>Background</strong> puts a floor or a spotlight behind the kit; <strong>View</strong> (at the top of Customize: Drums or Pad grid) switches to a <strong>Pad grid</strong>: the same drums and sounds as big tiles, great on phones (Look, Background and Sticks are for the drawn drums, so they are dimmed there). <strong>Sticks</strong> adds drumsticks that play along: classic, nylon tip, rods, brushes, mallets or light-up, in six colours, with accessories such as a grip sleeve, a practice tip, a ball chain, a sticker, a wrist strap or a clip-on light.</p>
      <p>Your recording stays when you switch kits, so you can hear the same beat on another kit. Pieces a kit does not have are simply silent.</p>
      <button type="button" class="try-button" data-try="kit">Try it</button>`)}
    ${section('metronome', 'Metronome', `
      <div class="help-picture" aria-hidden="true">${metronomePicture()}</div>
      <p>${icon('metronome')} A steady tick that keeps you in time. Its light flashes on every beat, gold on the first of each four, and the stage light pulses with it.</p>
      <p>Turn it on with the <strong>Metronome</strong> switch in the ⋮ menu, where you also set its speed. While it is on, a small metronome button sits next to Rec: tap it to turn the metronome off. With it on, Rec counts in four clicks, and loops line up to whole beats.</p>
      <button type="button" class="try-button" data-try="metronome">Try it</button>`)}
    ${section('eq', 'EQ', `
      <p>${icon('eq')} <strong>Bass</strong>, <strong>Mid</strong> and <strong>Treble</strong> change the low boom, the middle body and the high sizzle of the whole kit. Presets such as Rock or Jazz set all three at once. It lives in Customize, next to the kits, with the volume; the EQ button in the toolbar opens it directly.</p>
      <button type="button" class="try-button" data-try="eq">Try it</button>`)}
    ${section('modes', 'Focus & Concert', `
      <p>${icon('expand')} <strong>Focus</strong> hides everything but the drums so they fill the screen (full screen where the browser allows it). Press <strong>F</strong> to switch it on or off; <strong>Esc</strong> or the faint ✕ in the corner also leaves.</p>
      <button type="button" class="try-button" data-try="focus">Try it</button>
      <p>${icon('crowd')} <strong>Concert</strong> puts a crowd and stage lights behind your kit. They bob to the tempo, raise their hands on your crashes, jump when you play fast and cheer when you stop. The lights glow gently; switch off <strong>Flashing lights</strong> in the ⋮ menu to keep them still. On phones, Learn and Concert take turns so the kit stays big.</p>
      <button type="button" class="try-button" data-try="concert">Try it</button>`)}
    ${section('settings', 'More menu', `
      <p>${icon('more')} The ⋮ button holds EQ, Focus, light or dark mode, the settings (key names on the drums, Flashing lights, the metronome and its tempo), How to play and Reset all.</p>`)}
    ${section('privacy', 'Privacy', `
      <p>Everything stays in this browser. Recordings last until you reload the page; your settings are remembered on this device. Nothing is uploaded.</p>`)}
    ${section('keys', 'Playing and keys', `
      <p>Tap or click a drum; several fingers at once work. In <strong>Hover</strong> mode (top centre) a drum plays as soon as your mouse, or a sliding finger, moves onto it. On a computer, the lit keys play the drums:</p>
      <div class="help-keys-map"></div>`)}
    ${section('about', 'About', `
      <p>${creditLine('about-link')}</p>
      ${repoLink('about-link') ? `<p>${repoLink('about-link')}</p>` : ''}`)}
  </div>`;
  panel.classList.add('drawer-wide');
  const drawer = createDrawer(button, panel);

  // The keyboard map follows the kit on stage: only its keys are lit.
  function setPads(kitPads) {
    panel.querySelector('.help-keys-map').innerHTML = `
      <div class="help-picture" aria-hidden="true">${keyboardPicture(kitPads)}</div>
      <p class="visually-hidden">${kitPads.map((pad) => `${pad.key.replace('Key', '')}: ${pad.label}`).join(', ')}</p>`;
  }
  setPads(pads);

  function scrollTo(sectionId) {
    const target = panel.querySelector(`#help-${sectionId}`);
    const top = target ? target.offsetTop - panel.querySelector('.drawer-header').offsetHeight - 8 : 0;
    panel.scrollTo({ top, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }

  panel.querySelector('.help-jumps').addEventListener('click', (event) => {
    const chip = event.target.closest('[data-jump]');
    if (chip) scrollTo(chip.dataset.jump);
  });

  // "Try it": close the guide and make the real control glow. Add layer only exists after a recording,
  // so until then Rec glows instead.
  panel.addEventListener('click', (event) => {
    const tryButton = event.target.closest('[data-try]');
    if (!tryButton) return;
    let target = targets[tryButton.dataset.try]?.();
    // getClientRects is empty for anything not shown (it also works for fixed elements such as the Kit tab).
    if (!target || target.disabled || !target.getClientRects().length) target = targets.record();
    drawer.setOpen(false, false);
    spotlight(target);
  });

  return {
    open(sectionId) {
      if (!drawer.isOpen()) drawer.setOpen(true);
      if (sectionId) scrollTo(sectionId);
      else panel.scrollTop = 0;
    },
    setPads,
  };
}

// Customize drawer: opens from the left edge (or from the toolbar's EQ button, straight on the EQ tab). Two sound tabs,
// Kit (pieces and sounds) and EQ (filled in by eq-panel.js), then three look tabs, Look (themes), Background (filled
// in by backdrop-picker.js) and Sticks (filled in by sticks-settings.js), each with a one-line hint. Picking a
// card changes the kit on stage straight away; choices and the last tab used are remembered between visits.
import { ICONS } from './icons.js';
import { createDrawer } from './drawer.js';
import { kitPreview } from './kit-previews.js';
import { THEMES, getTheme } from '../kit/art/themes.js';
import { KITS, getKit } from '../kit/kits/index.js';
import { settings, saveSettings, DEFAULTS } from './storage.js';
import { confirmToast } from './confirm-toast.js';

// What each tab changes, shown under the tabs.
const HINTS = {
  kits: 'Changes the pieces and the sound.',
  eq: 'Volume and tone for whichever kit you play.',
  themes: 'Changes only how the kit looks. The sound stays the same.',
  backdrop: 'What sits behind the kit. Only a look.',
  sticks: 'Sticks that strike along with you. Only a look.',
};

const card = (kind, item, selected, picture) => `
  <button type="button" class="kit-card" data-${kind}="${item.id}" aria-pressed="${selected}">
    <span class="kit-card-picture">${picture}</span>
    <span class="kit-card-name">${item.label}</span>
    <span class="kit-card-text">${item.description}</span>
  </button>`;

/**
 * @param {HTMLButtonElement} button the tab on the left edge
 * @param {HTMLElement} panel the empty drawer element
 * @param {{onTheme: (id: string) => void, onKit: (id: string) => void, onView: (view: string) => void,
 *   onReset: (tab: string) => void}} actions onView switches between the drum kit and the Pad grid; onReset
 *   resets the EQ, Background or Sticks tab (Kit and Look are reset here)
 * @returns {{refresh: () => void, openTab: (tab: string) => void, eq: HTMLElement, sticks: HTMLElement,
 *   backdrops: HTMLElement}} refresh redraws the cards; openTab opens the drawer on a tab (or closes it if it is already
 *   open there); eq, sticks and backdrops are the empty areas other files fill in
 */
export function setupKitDrawer(button, panel, { onTheme, onKit, onView, onReset }) {
  button.innerHTML = `${ICONS.chevron}<span class="kit-tab-label">Customize</span><span class="kit-tab-icon">${ICONS.adjust}</span>`;
  panel.innerHTML = `
  <div class="drawer-header">
    <h2 class="drawer-title">Customize</h2>
    <div class="drawer-header-actions">
      <button type="button" class="text-button kit-reset" aria-label="Reset this tab">${ICONS.undo}<span>Reset</span></button>
      <button type="button" class="icon-button" data-close aria-label="Close Customize">${ICONS.close}</button>
    </div>
  </div>
  <div class="kit-view-switch" role="radiogroup" aria-labelledby="kit-view-label">
    <span class="kit-view-label" id="kit-view-label">View</span>
    <label><input type="radio" name="kit-view" data-view="kit" value="kit"><span>Drums</span></label>
    <label><input type="radio" name="kit-view" data-view="grid" value="grid"><span>Pad grid</span></label>
  </div>
  <div class="segmented kit-tabs" role="tablist" aria-label="Customize">
    <button type="button" role="tab" data-tab="kits">${ICONS.drum}<span>Kit</span></button>
    <button type="button" role="tab" data-tab="eq">${ICONS.eq}<span>EQ</span></button>
    <span class="kit-tabs-divider" aria-hidden="true"></span>
    <button type="button" role="tab" data-tab="themes">${ICONS.palette}<span>Look</span></button>
    <button type="button" role="tab" data-tab="backdrop">${ICONS.image}<span>Background</span></button>
    <button type="button" role="tab" data-tab="sticks">${ICONS.sticks}<span>Sticks</span></button>
  </div>
  <p class="kit-hint"></p>
  <div class="kit-grid-note" hidden>
    <p>Look, Background and Sticks are for the drawn drums, so they are off in the Pad grid.</p>
    <button type="button" class="text-button" data-view-switch="kit">${ICONS.drum}<span>Switch to Drums</span></button>
  </div>
  <div class="kit-cards" data-panel="kits" role="tabpanel"></div>
  <div class="eq-panel" data-panel="eq" role="tabpanel"></div>
  <div class="kit-cards" data-panel="themes" role="tabpanel"></div>
  <div class="kit-cards" data-panel="backdrop" role="tabpanel"></div>
  <div class="stick-options slider-group" data-panel="sticks" role="tabpanel"></div>`;
  panel.classList.add('drawer-left', 'drawer-wide');

  // The Pad grid has no theme art, floor or sticks: those tabs stay (dimmed), and opening one says why, with a way back.
  const LOOK_TABS = ['themes', 'backdrop', 'sticks'];
  function showView() {
    const grid = settings.view === 'grid';
    const lookTab = LOOK_TABS.includes(settings.customizeTab);
    panel.querySelectorAll('[data-view]').forEach((input) => { input.checked = input.dataset.view === settings.view; });
    LOOK_TABS.forEach((id) => panel.querySelector(`[data-tab=${id}]`).classList.toggle('is-muted', grid));
    panel.querySelector('.kit-grid-note').hidden = !(grid && lookTab);
    LOOK_TABS.forEach((id) => panel.querySelector(`[data-panel=${id}]`).classList.toggle('is-off', grid));
  }
  function setView(view) {
    if (view === settings.view) return;
    settings.view = view;
    saveSettings();
    showView();
    onView(settings.view);
  }
  panel.querySelector('.kit-view-switch').addEventListener('change', (event) => {
    const choice = event.target.closest('[data-view]');
    if (choice) setView(choice.dataset.view);
  });
  panel.querySelector('[data-view-switch]').addEventListener('click', () => setView('kit'));

  function refresh() {
    const kit = getKit(settings.kit);
    const theme = getTheme(settings.kitTheme);
    panel.querySelector('.kit-cards[data-panel=themes]').innerHTML =
      THEMES.map((item) => card('theme', item, item.id === theme.id, kitPreview(kit, item))).join('');
    panel.querySelector('.kit-cards[data-panel=kits]').innerHTML =
      KITS.map((item) => card('kit', item, item.id === kit.id, kitPreview(item, theme))).join('');
  }

  function showTab(id) {
    const tab = HINTS[id] ? id : 'kits';
    panel.querySelectorAll('[data-tab]').forEach((t) => t.setAttribute('aria-selected', String(t.dataset.tab === tab)));
    panel.querySelectorAll('[data-panel]').forEach((p) => { p.hidden = p.dataset.panel !== tab; });
    panel.querySelector('.kit-hint').textContent = HINTS[tab];
    settings.customizeTab = tab;
    saveSettings();
    showView(); // the Pad grid note shows on the look tabs
  }

  panel.querySelector('.kit-tabs').addEventListener('click', (event) => {
    const tab = event.target.closest('[data-tab]');
    if (tab) showTab(tab.dataset.tab);
  });
  panel.addEventListener('click', (event) => {
    const chosen = event.target.closest('.kit-card[data-theme], .kit-card[data-kit]');
    if (!chosen) return;
    if (chosen.dataset.theme) {
      settings.kitTheme = chosen.dataset.theme;
      saveSettings();
      onTheme(chosen.dataset.theme);
    } else {
      settings.kit = chosen.dataset.kit;
      saveSettings();
      onKit(chosen.dataset.kit);
    }
    refresh();
  });

  // Reset: only the tab on show, after asking in a small message with Cancel and Yes. Recordings and lesson progress
  // are never touched.
  const TAB_NAMES = { kits: 'Kit', eq: 'EQ', themes: 'Look', backdrop: 'Background', sticks: 'Sticks' };
  const resetButton = panel.querySelector('.kit-reset');
  const resetTab = () => {
    const tab = settings.customizeTab;
    if (tab === 'kits' && (settings.kit !== DEFAULTS.kit || settings.view !== DEFAULTS.view)) {
      settings.kit = DEFAULTS.kit;
      settings.view = DEFAULTS.view; // back to the drum kit too
      saveSettings();
      showView();
      onKit(DEFAULTS.kit);
    } else if (tab === 'themes') {
      settings.kitTheme = DEFAULTS.kitTheme;
      saveSettings();
      onTheme(DEFAULTS.kitTheme);
    } else if (tab !== 'kits') {
      onReset(tab);
    }
    refresh();
  };
  resetButton.addEventListener('click', () =>
    confirmToast(resetButton, `Reset the ${TAB_NAMES[settings.customizeTab]} tab to how it started?`, 'Yes, reset', resetTab));

  // The edge tab sits a little way into the drum area, so panels above it (recording, lessons) never cover it.
  const kitArea = document.getElementById('kit');
  // Upright phones: near the top, in the empty space above the Pad grid, so the grid can use the full width.
  const uprightPhone = matchMedia('(orientation: portrait) and (max-width: 499.98px)');
  const placeTab = () => {
    const box = kitArea.getBoundingClientRect();
    const offset = uprightPhone.matches ? 16 : Math.max(24, box.height * 0.18);
    button.style.setProperty('--tab-top', `${Math.round(box.top + offset + button.offsetHeight / 2)}px`);
  };
  uprightPhone.addEventListener('change', placeTab);
  new ResizeObserver(placeTab).observe(kitArea);

  refresh();
  showTab(settings.customizeTab);
  showView();
  const drawer = createDrawer(button, panel);

  function openTab(id) {
    if (drawer.isOpen() && settings.customizeTab === id) {
      drawer.setOpen(false);
      return;
    }
    showTab(id);
    drawer.setOpen(true);
  }

  return {
    refresh,
    openTab,
    eq: panel.querySelector('.eq-panel'),
    sticks: panel.querySelector('.stick-options'),
    backdrops: panel.querySelector('[data-panel=backdrop]'),
  };
}

// Learn drawer: opens from the toolbar's Learn button, with two tabs: Lessons (step-by-step basics) and Beats (style
// grooves such as funk, disco and reggae). Each entry shows its difficulty, its speed and, once played, your best score
// (a tick from 80%). Picking one closes the drawer and opens it in the lesson bar.
import { ICONS } from './icons.js';
import { createDrawer } from './drawer.js';
import { attachTooltip } from './tooltip.js';
import { LESSONS } from '../learn/lessons.js';
import { BEATS } from '../learn/beats.js';
import { settings } from './storage.js';

const HINTS = {
  lessons: 'Step by step, from a steady kick to a full beat with a fill.',
  beats: 'Grooves from different styles of music, written for this app.',
};
const LISTS = { lessons: [LESSONS, 'Lesson'], beats: [BEATS, 'Beat'] };

const dots = (level) => `<span class="lesson-level" aria-label="Difficulty ${level} of 3">${'●'.repeat(level)}${'○'.repeat(3 - level)}</span>`;

/**
 * @param {HTMLButtonElement} button the Learn button in the toolbar
 * @param {HTMLElement} panel the empty drawer
 * @param {(item: object, list: object[], label: string) => void} onPick
 * @returns {{refresh: () => void}} refresh redraws the lists (after a new best score)
 */
export function setupLearnDrawer(button, panel, onPick) {
  button.innerHTML = `${ICONS.learn}<span class="button-label">Learn</span>`;
  button.setAttribute('aria-label', 'Learn');
  attachTooltip(button, { title: 'Learn', lines: ['Lessons and style beats to play along with.', 'The grid shows when to hit each drum.'] });
  panel.innerHTML = `
  <div class="drawer-header">
    <h2 class="drawer-title">Learn</h2>
    <button type="button" class="icon-button" data-close aria-label="Close Learn">${ICONS.close}</button>
  </div>
  <div class="segmented kit-tabs" role="tablist" aria-label="Learn">
    <button type="button" role="tab" data-learn-tab="lessons" aria-selected="true">Lessons</button>
    <button type="button" role="tab" data-learn-tab="beats" aria-selected="false">Beats</button>
  </div>
  <p class="kit-hint learn-hint">${HINTS.lessons}</p>
  <div class="lesson-list" data-list="lessons"></div>
  <div class="lesson-list" data-list="beats" hidden></div>`;
  panel.classList.add('drawer-wide');
  const drawer = createDrawer(button, panel);

  function refresh() {
    Object.entries(LISTS).forEach(([id, [items]]) => {
      panel.querySelector(`[data-list=${id}]`).innerHTML = items.map((item, i) => {
        const best = settings.lessons[item.id];
        const mark = best === undefined ? '' : `<span class="lesson-best${best >= 80 ? ' is-passed' : ''}">${best >= 80 ? '✓ ' : ''}${best}%</span>`;
        return `<button type="button" class="lesson-item" data-pick="${id}:${item.id}">
          <span class="lesson-number">${i + 1}</span>
          <span class="lesson-text"><span class="lesson-name">${item.title}</span><span class="lesson-tip">${item.tip}</span></span>
          <span class="lesson-side">${dots(item.level)}<span class="lesson-bpm">${item.bpm} BPM${item.realBpm ? ` · real ${item.realBpm}` : ''}</span>${mark}</span></button>`;
      }).join('');
    });
  }

  panel.addEventListener('click', (event) => {
    const tab = event.target.closest('[data-learn-tab]');
    if (tab) {
      panel.querySelectorAll('[data-learn-tab]').forEach((t) => t.setAttribute('aria-selected', String(t === tab)));
      panel.querySelectorAll('[data-list]').forEach((list) => { list.hidden = list.dataset.list !== tab.dataset.learnTab; });
      panel.querySelector('.learn-hint').textContent = HINTS[tab.dataset.learnTab];
      return;
    }
    const pick = event.target.closest('[data-pick]');
    if (!pick) return;
    const [listId, itemId] = pick.dataset.pick.split(':');
    const [items, label] = LISTS[listId];
    drawer.setOpen(false, false);
    onPick(items.find((item) => item.id === itemId), items, label);
  });

  refresh();
  return { refresh };
}

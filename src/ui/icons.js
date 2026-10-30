// Interface icons: simple line icons drawn in SVG for this project (no icon pack).

const svg = (body) => `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none"
  stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;

// A cog with eight teeth: the outline alternates between an outer and an inner radius.
function gear() {
  const points = Array.from({ length: 32 }, (_, k) => {
    const angle = ((k * 11.25 - 5.6) * Math.PI) / 180;
    const radius = k % 4 < 2 ? 9.5 : 7.2;
    return `${(12 + radius * Math.cos(angle)).toFixed(2)} ${(12 + radius * Math.sin(angle)).toFixed(2)}`;
  });
  return `<path d="M${points.join(' L')} Z"/><circle cx="12" cy="12" r="3"/>`;
}

export const ICONS = {
  eq: svg(`<path d="M6 4v16M12 4v16M18 4v16"/>
    <circle cx="6" cy="14" r="2.4" fill="currentColor" stroke="none"/>
    <circle cx="12" cy="8" r="2.4" fill="currentColor" stroke="none"/>
    <circle cx="18" cy="16" r="2.4" fill="currentColor" stroke="none"/>`),
  settings: svg(gear()),
  sun: svg(`<circle cx="12" cy="12" r="4"/>
    <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>`),
  moon: svg(`<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>`),
  close: svg(`<path d="M6 6l12 12M18 6L6 18"/>`),
  record: svg(`<circle cx="12" cy="12" r="6" fill="currentColor" stroke="none"/>`),
  play: svg(`<path d="M8 5.5v13l10.5-6.5z" fill="currentColor" stroke="none"/>`),
  pause: svg(`<rect x="7" y="6" width="3.5" height="12" rx="1" fill="currentColor" stroke="none"/><rect x="13.5" y="6" width="3.5" height="12" rx="1" fill="currentColor" stroke="none"/>`),
  stop: svg(`<rect x="7" y="7" width="10" height="10" rx="1.5" fill="currentColor" stroke="none"/>`),
  loop: svg(`<path d="M17 3l3 3-3 3"/><path d="M4 12v-2a4 4 0 0 1 4-4h12"/>
    <path d="M7 21l-3-3 3-3"/><path d="M20 12v2a4 4 0 0 1-4 4H4"/>`),
  metronome: svg(`<path d="M9.5 3h5L19 21H5z"/><path d="M12 16l4.5-9"/><path d="M7 17h10"/>`),
  undo: svg(`<path d="M9 14L4 9l5-5"/><path d="M4 9h10a6 6 0 0 1 0 12h-3"/>`),
  plus: svg(`<path d="M12 5v14M5 12h14"/>`),
  chevron: svg(`<path d="M6 9l6 6 6-6"/>`),
  help: svg(`<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6"/>
    <circle cx="12" cy="17" r="0.6" fill="currentColor"/>`),
  trash: svg(`<path d="M4 7h16"/><path d="M10 11v6M14 11v6"/><path d="M6 7l1 13h10l1-13"/><path d="M9 7V4h6v3"/>`),
  crowd: svg(`<circle cx="12" cy="8" r="2.5"/><circle cx="5.5" cy="10" r="2"/><circle cx="18.5" cy="10" r="2"/>
    <path d="M7.5 20a4.5 4.5 0 0 1 9 0M1.5 20a4 4 0 0 1 6-3.4M22.5 20a4 4 0 0 0-6-3.4"/>`),
  // An open book with a music note on its right page.
  learn: svg(`<path d="M12 6.5C10 5 7 4.5 3 5v13c4-.5 7 0 9 1.5 2-1.5 5-2 9-1.5V5c-4-.5-7 0-9 1.5z"/><path d="M12 6.5v13"/>
    <path d="M17 9.5v4.2"/><circle cx="15.8" cy="14" r="1.3" fill="currentColor" stroke="none"/><path d="M17 9.5l1.8.6"/>`),
  more: svg(`<circle cx="12" cy="5" r="1.6" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none"/>
    <circle cx="12" cy="19" r="1.6" fill="currentColor" stroke="none"/>`),
  expand: svg(`<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>`),
  drum: svg(`<ellipse cx="12" cy="8" rx="8" ry="3"/><path d="M4 8v8c0 1.7 3.6 3 8 3s8-1.3 8-3V8"/><path d="M8 10.8v7.8M16 10.8v7.8"/>`),
  // Customize: horizontal sliders, each knob at a different setting.
  adjust: svg(`<path d="M4 7h3M11 7h9M4 12h9M17 12h3M4 17h2M10 17h10"/><circle cx="9" cy="7" r="2"/><circle cx="15" cy="12" r="2"/><circle cx="8" cy="17" r="2"/>`),
  palette: svg(`<path d="M12 3a9 9 0 1 0 0 18c1.1 0 1.6-.8 1.3-1.7-.4-1.1.3-2.3 1.5-2.3H17a4 4 0 0 0 4-4c0-5.5-4-10-9-10z"/><circle cx="7.5" cy="11" r="1.2"/><circle cx="10.5" cy="7" r="1.2"/><circle cx="15" cy="7.5" r="1.2"/>`),
  image: svg(`<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 16l5-5 4 4 3-3 6 6"/><circle cx="16" cy="9" r="1.5"/>`),
  sticks: svg(`<path d="M5 4l10 16M19 4L9 20"/><circle cx="5" cy="4" r="1.3"/><circle cx="19" cy="4" r="1.3"/>`),
  volume: svg(`<path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16.5 9a4 4 0 0 1 0 6M19 6.5a7.5 7.5 0 0 1 0 11"/>`),
  download: svg(`<path d="M12 4v11"/><path d="M7 10.5l5 5 5-5"/><path d="M5 20h14"/>`),
  grid: svg(`<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>`),
  note: svg(`<path d="M9 18V6l10-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/>`),
  keyboard: svg(`<rect x="2.5" y="6" width="19" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M8 14h8"/>`),
};

/** A larger metronome drawing for the tooltip; its arm swings (see .tooltip-pendulum). */
export const METRONOME_PICTURE = `<svg viewBox="0 0 64 64" width="56" height="56" aria-hidden="true">
  <path d="M24 8h16l10 48H14z" fill="var(--color-surface-hover)" stroke="currentColor" stroke-width="2"
    stroke-linejoin="round"/>
  <path d="M17 46h30" stroke="currentColor" stroke-width="2"/>
  <g class="tooltip-pendulum">
    <line x1="32" y1="46" x2="32" y2="14" stroke="var(--color-accent)" stroke-width="2.5" stroke-linecap="round"/>
    <rect x="28.5" y="22" width="7" height="5" rx="1.5" fill="var(--color-accent)"/>
  </g>
  <circle cx="32" cy="46" r="2.5" fill="currentColor"/>
</svg>`;

/** The app's small logo: a drum seen from above (its head in saffron) with two crossed sticks. */
export const LOGO = `<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
  <circle cx="12" cy="13.5" r="8.5" fill="none" stroke="currentColor" stroke-width="2"/>
  <circle cx="12" cy="13.5" r="5.6" fill="var(--color-accent)"/>
  <path d="M4.5 2.5l8 9M19.5 2.5l-8 9" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>
</svg>`;

<!-- Milestones and key decisions, kept short. -->
# Plan

## Milestones

1. **Setup:** Vite + vanilla JavaScript, dark page with the title. Done.
2. **Audio engine:** Web Audio set up, synthesized kick. Done.
3. **Full kit:** top-down view, 11 pads, art layer and hit layer, keyboard keys. Done.
4. **Touch and mobile:** multi-touch, landscape first. Done.
5. **Master EQ:** 3-band EQ with presets, now the EQ tab of the Customize drawer (next to Kit, with Volume); the toolbar EQ button opens it. Done.
6. **Toolbar and settings:** toolbar, Hover / Tap, settings, light/dark toggle, remembered choices. Done.
7. **Extras:** record, play, loop, metronome, layers (up to 3), recording panel, How to play guide. Done.
8. **Natural look and motion:** hammered cymbals, chrome reflections, worn heads, stage light, hit motion. Done in code; still to be checked on a real phone.
9. **Kits and themes:** Kit drawer from the left; 8 themes that dress the kit itself (colours, painted hoops, LED heads, real-world accessories such as mics, chains and stickers) with a separate Background choice (plain, wood, concrete, rug, spotlight) in its own tab; intro sting on load or first touch; drumsticks in the drawer's Extras tab; Studio, Electronic and Jazz kits that swap live. Done.
10. **Learning mode:** Learn drawer from the toolbar with 8 lessons and 10 style beats (eighths, sixteenths, shuffle, 3/4); beat grid with a sweeping line, a soft glow on the pad to hit, a scoreboard and a count-in, Perfect / Early / Late, speed levels, 80% passes, best scores remembered. On phones the light/dark switch moves into Settings. Done.
11. **Pad grid and Concert (v2.0 to v2.3):** the Pad grid view, Concert mode, phone layouts, and the v2.3 polish (one spacing system, calmer recording controls with Pause, the drums in thumb reach in Concert on phones, better contrast in both themes). Done; real-phone testing still to do.
13. **v3.1, polish from phone testing:** the lesson tour and tip reworked (tour on every lesson until turned off, tip shown in the middle first), unused drums silent while a lesson is open, a full-width phone scoreboard, the Customize tab and the rotate tip fixed on phones, instrument names on the drawn drums, the credit moved into the ⋮ menu with a case study link. Done.
12. **v3.0, looks and lessons:** every Look dressed onto the Pad grid (textures, artwork, a one-time shine) with sticks and backgrounds there too; Customize as a tab bar with sample previews; lessons reworked (exact timing, a result card with the next step, speed levels, tours, a beat grid that highlights the step being played, silent unused drums); Learn, Concert and Recording take turns; about 40px tap areas on touch screens. Done; real-phone testing still to do.

## Decisions

- Vite is the only package. Plain JavaScript, no TypeScript.
- Sounds, icons and artwork are made in code. Fonts: system fonts plus two approved open-licence fonts (see below).
- Keys follow common virtual-kit practice: Space kick, left-hand keys for left-side pieces, right-hand keys for right-side pieces. Crash right moved from E to O.
- A soft limiter after the EQ keeps any setting from clipping; master level set so normal hits stay clean.
- Settings live in the browser's local storage. Recordings stay in memory only; nothing is uploaded.
- Natural look uses only shapes and gradients drawn in code: no outside textures, no blur or heavy filters (kept light for phones).
- Motion moves the artwork only; hit areas never move. It is off when the device asks for reduced motion.
- Kits share pad ids and keys, so recordings play on any kit (missing pieces are silent). Themes reach the art through CSS variables, so they apply instantly. Theme designs are original, with generic names.
- Drumsticks are a removable feature: three files plus lines marked "sticks" in main.js.
- Ideas for later (not planned): transport keyboard shortcuts, volume per drum. (Saving a recording as a WAV file is done.)
- Fonts: body text uses Outfit; the title and headings use DM Serif Display (both SIL OFL 1.1), stored in public/fonts with their licences and logged in RESOURCES.md. Approved by the owner on 2026-10-24 as an exception to the system-fonts rule. Served from this site, never from Google.

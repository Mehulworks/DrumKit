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
10. **Learning mode:** Learn drawer from the toolbar with 8 lessons and 10 style beats (eighths, sixteenths, shuffle, 3/4); beat grid with a sweeping line, a soft glow on the pad to hit, a scoreboard and count-in in the grid's Ready box, Perfect / Early / Late, speed 60–120%, 80% passes, best scores remembered. On phones the light/dark switch moves into Settings. Done.

## Decisions

- Vite is the only package. Plain JavaScript, no TypeScript.
- Sounds, icons and artwork are made in code. System fonts only.
- Keys follow common virtual-kit practice: Space kick, left-hand keys for left-side pieces, right-hand keys for right-side pieces. Crash right moved from E to O.
- A soft limiter after the EQ keeps any setting from clipping; master level set so normal hits stay clean.
- Settings live in the browser's local storage. Recordings stay in memory only; nothing is uploaded.
- Natural look uses only shapes and gradients drawn in code: no outside textures, no blur or heavy filters (kept light for phones).
- Motion moves the artwork only; hit areas never move. It is off when the device asks for reduced motion.
- Kits share pad ids and keys, so recordings play on any kit (missing pieces are silent). Themes reach the art through CSS variables, so they apply instantly. Theme designs are original, with generic names.
- Drumsticks are a removable feature: three files plus lines marked "sticks" in main.js.
- Ideas for later (not planned): save a recording as an audio file, transport keyboard shortcuts, volume per drum.
- Fonts: body text uses Outfit; the title and headings use DM Serif Display (both SIL OFL 1.1), stored in public/fonts with their licences and logged in RESOURCES.md. Approved by the owner on 2026-10-24 as an exception to the system-fonts rule. Served from this site, never from Google.

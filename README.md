<!-- Project overview: what it is, how to run it, and the folder map. -->
# Drum Kit Web

A browser drum kit with a top-down kit view, built with Vite, vanilla JavaScript and the Web Audio API. All sounds are synthesized in code; all artwork is drawn in code.

Status: all 8 milestones done, plus kits and themes. Tap or click a pad (several fingers at once work), or press its key. Best in landscape.

- **Touch**: buttons drawn at 32px (one height everywhere) with an invisible ring that makes each tap area about 44px. Every saffron button has dark text (one colour, readable in both themes).
- **Metronome**: switched on in the ⋮ menu (Metronome, with its tempo, active while on). While it runs, a metronome chip with a blinking beat light sits next to Rec; tap it to turn the metronome off.
- **Phones**: one toolbar row: logo, a compact Drag + Tap switch (Hover is called Drag on touch screens: sliding a finger across the drums plays them), Rec, the metronome chip while it is on, Concert and Learn icons, ⋮.
- **Phones and lessons**: the lesson bar shows a short info line and puts Demo, the click and the speed in a ⋮ dropdown; the recording panel folds during a lesson and floats over the crowd in Concert. On every screen, Learn and Concert take turns (opening a lesson pauses Concert, turning Concert on closes the lesson).
- **Pad grid** (Customize → View, above the tabs: Drums | Pad grid): the chosen kit's drums and sounds as tiles grouped by role (cymbals, toms, hi-hats, snare and kick), each with a line drawing of the instrument, its key in the corner, and a backlight in its colour when hit; drawn to fit the kit area exactly (wide rows sideways, more rows upright). Recording, Learn, keys and Concert work the same; Look, Background and Sticks stay in Customize but are dimmed, with a note and a "Switch to Drum kit" button.
- **Responsive**: sizes and spacing in rem (they follow the browser's text size), breakpoints in em: phones held sideways are caught by height (30em), compact width rules start at 45em, so upright tablets keep the full layout. On upright screens the kit zooms in a little on the drums.
- **First visit**: Studio kit in the Hot Rod look on the wood floor, drumsticks shown (classic, black tape, silver chain), key names on computers only, volume 80%, dark mode. Every Reset returns to these.
- **Customize** (drawer on the left edge, tabs Kit, EQ, Look, Background, Sticks; a Reset button resets the tab on show after a Cancel / Yes question). **Kit** tab: what you play, with its own sounds: **Studio** (full acoustic kit), **Electronic** (pads with glowing rings on a rack, electronic sounds) and **Jazz** (small acoustic kit, softer sounds). Same keys on every kit; keys for pieces a kit does not have do nothing.
- **Look** tab: themes that change only how the kit looks: Classic Studio, Dragon, Gothic, Neon Synthwave, Midnight, Hot Rod, Vintage Sunburst and Retro Sparkle. Each theme dresses the kit itself: shell colours, wraps and kick graphics, painted hoops, LED-lit heads, plus real-world accessories such as clip-on mics, sizzle chains and bead rattlers, a kick chain, vinyl stickers, gel pads, O-rings, tape, a snare wallet, coloured cymbal felts, glow tape, a hi-hat tambourine, charms, a towel and a stick bag. On the Electronic kit a theme colours the mesh heads, rims and cymbal edges, the module screen and pad lights, and adds tower stickers.
- **Kit gear** (every look): stands under the cymbals and hi-hats with the hi-hat pedal, the drummer's stool, a tablet beside the hi-hat and spare sticks by the floor tom. Drawn under the drums and never tappable.
- **Background** tab: Plain (faint music doodles and sketched props: a music stand, side table, guitar and amp), Wood floor, Concrete, Stage rug or Spotlight, chosen separately from the theme. Each has gentle moving light (window light, a light sweep, a lamp glow, dust in the spotlight) and props round the edges: a rehearsal room with an amp, mic stand, set list and a steaming mug; a loft studio with monitor speakers and a swaying plant; a lounge with a floor lamp, a spinning record player and a record crate; a stage with floor wedges, footlights and haze, the Spotlight footlights glow softly on hits, and a tap on the floor leaves a faint ring. All motion stops with reduced motion.
- **Natural look and motion**: hammered cymbals, chrome reflections, worn heads, a soft stage light; drums thump with a ripple where you hit, cymbals wobble and shimmer, the kick beater swings, the hi-hat lifts and closes. Off when the device asks for reduced motion.
- **Hover / Tap** switch: Tap plays a pad when pressed; Hover plays it as soon as the mouse or a sliding finger moves onto it.
- **Record / Play / Loop**: **Rec** in the toolbar starts a **3, 2, 1** countdown in the middle of the screen (4, 3, 2, 1 with the metronome, quiet clicks without it), then records up to 2 minutes; Rec shows "■ Stop 0:12 / 2:00" (just "■ 0:12" on phones), and the recording panel shows "Recording… 0:12 / 2:00" and the first take filling in from left to right (the view grows 15 s → 30 s → 1 min → 2 min, marks gliding, each in its instrument family's colour). Under the layers, a red **Stop** ends the take or a layer and **Add layer** starts one; both are always there. **Play**, **Loop** and the play time sit at the top of the recording panel (Play is greyed while recording). Records **drums only** (no microphone). Kept in memory only; gone after a reload. A recording stays when you switch kits, so the same beat can play on another kit.
- **Recording panel and layers**: a caret pointing up at Rec, a top row (title, then on the right the time, Play/Stop, Loop, Download and Delete icons, help), then a full-width timeline with every layer row there from the start (empty ones dashed, the next says "Tap to add a layer", so the panel never grows; up to 3; short labels Take, L1, L2, L3 on phones), and under it **Add layer** and **Undo layer** on the right. **Download** (saves the recording, all layers, as a stereo WAV file on your device; nothing is uploaded), **Delete** (click twice), fold.
- **Metronome**: steady click with a beat light; tempo in Settings; 4-click count-in before recording.
- **EQ** (Customize, EQ tab; the toolbar EQ button opens it): volume, preset chips (Normal, Rock, Pop, Jazz, Hip-Hop, Bass Boost) and Bass, Mid and Treble sliders.
- **Sticks** (Customize, Sticks tab): optional drumsticks that strike and twirl: classic, nylon tip, rods, brushes, mallets or light-up, in six colours, with real-world accessories: grip tape or a rubber sleeve, a practice tip cover, a wrapped ball chain, a sticker, a wrist strap, keychain charm or ribbon, and a clip-on LED light. A look only; the sound stays the same.
- **Intro**: a short ba-dum-tss when the page loads. Most browsers allow sound only after a touch, so there it plays on your first touch, click or key press.
- **Toolbar**: playing controls, **Learn** and **Concert** always visible with their names (Concert has a slowly moving gradient border), and a ⋮ **More** menu for EQ, Focus, light or dark, the settings, How to play and Reset all. First-time visitors get a one-time tip pointing to Learn and Concert.
- **Focus mode**: the Focus button (or F) hides everything but the drums and asks for real fullscreen where the browser allows it; Esc, F or the faint ✕ leaves.
- **Learn** (toolbar): a drawer with **Lessons** (8 step-by-step basics) and **Beats** (10 style grooves: disco, half-time, reggae one-drop, fast punk, hip-hop, shuffle, waltz in 3/4, funk, trap hi-hats, bossa nova), all written for this app. Two modes: **Step by step** (the beat waits until you hit each glowing drum) and **In time**. The lesson bar shows a beat grid with a line that crosses each dot at the moment to hit while the drum to hit glows; a scoreboard over the kit shows Perfect / Early / Late, the streak and the score; the grid's Ready box counts 4-3-2-1 before the first hit. Demo plays it first (the drumsticks play along); the drums a lesson uses are labelled with their name and key and the rest dimmed; the beat click can be switched off; lessons run at 60 to 70 BPM and beats start at 75% of their real tempo; speed 40 to 150%, remembered for each lesson, with a "10% faster" button after a pass; 80% on time passes (the bar shows the goal in hits, and the scoreboard a bar with the 80% mark); the lesson tip shows as a caption at the bottom; best scores are remembered.
- **Concert mode** (every screen; on phones the kit shrinks less so it stays easy to tap; on upright screens the crowd is a strip along the top and the kit sits below it): the kit moves to the bottom and a crowd (bright shirts, picture signs, glow sticks, phone lights, a beach ball), a disco ball and stage lights appear behind it, all drawn in code; the crowd bobs to the tempo, raises hands on crashes, jumps when you play fast and cheers when you stop after a burst, and the stage flashes on the kick.
- **Credits**: "Made by Mehul with Claude." (the name links to the portfolio) floating over the bottom-right corner of the kit on computers and tablets, white text on a faint dark backing (copyable), at the end of the ⋮ menu (under a divider with a music note, with the version linking to the release notes) and in the About section of How to play. A "Code & prompts" link appears once REPO_URL is set in src/ui/credits.js.
- **Page info**: title, description, favicon, home-screen icon and link-preview tags (Open Graph) in index.html, with the live address https://drummingkit.vercel.app/.
- **Settings** (in the ⋮ menu): key names on pads (on by default), Flashing lights (stage lights that blink gently; never more than two light reactions a second, none with reduced motion), metronome tempo, Dark mode (a switch) and Reset all (asks with Cancel and Yes).
- **How to play**: an illustrated guide (layers first), "Try it" buttons, a keyboard map that follows the kit, and hover cards on desktop.
- **Light / dark** look for the interface.

Choices are remembered in this browser only (local storage); nothing is uploaded.

Keys: Space Kick, S Snare, J Tom 1, K Tom 2, L Floor Tom, A Hi-Hat, Z Open Hi-Hat, Q Crash left, O Crash right, W Splash, P Ride.

## Run it locally

Requires Node.js 20.19+ or 22.12+.

```sh
npm install
npm run dev
```

Then open http://localhost:5173.

Other commands:

- `npm run build`: builds the site into `dist/`
- `npm run preview`: serves the built `dist/` folder locally

## Licence

- **Code**: MIT licence, copyright (c) 2026 Mehul Varshney. See [LICENSE](LICENSE). You may use, change and share it; keep the copyright line and licence text with any copy.
- **Fonts**: Outfit and DM Serif Display keep their own licence, the SIL Open Font License 1.1 (see public/fonts). MIT does not cover them.
- **Sounds and artwork**: made in code for this project. No outside audio, images or icon packs.
- Built with Claude (AI).

If you use this project, a credit or a link back is appreciated (not required).

## Folder map

```
index.html            page shell
package.json          project info and scripts
vercel.json           security headers Vercel sends with every page
README.md             this file
LICENSE               MIT licence (code)
CLAUDE.md             project rules
.gitignore            files Git should ignore
docs/
  PLAN.md             milestones (short)
  PROMPTS.md          the prompts used to build it (to be added)
  RESOURCES.md        log of outside assets and their licences
public/               files served as they are
  favicon.svg         browser tab icon (drum and crossed sticks)
  apple-touch-icon.png  180x180 icon for phone home screens
  og-image.jpg        1200x630 picture shown when the link is shared
  fonts/
    outfit-latin.woff2  Outfit, the body font (SIL OFL 1.1)
    dm-serif-display-latin.woff2  DM Serif Display, the title and headings font (SIL OFL 1.1)
    OFL-outfit.txt    Outfit's licence, kept with it as the licence requires
    OFL-dm-serif-display.txt  DM Serif Display's licence
src/
  main.js             starts the app, mounts the chosen kit and theme, connects the parts
  styles.js           every stylesheet, in cascade order
  learn-setup.js      connects lessons, the lesson bar, scoreboard, lesson lock and phone turns
  audio/
    engine.js         shared audio context, master output, hit envelope
    intro.js          short ba-dum-tss intro on load (or on the first touch)
    eq.js             master 3-band EQ, presets and soft limiter
    drums.js          plays a pad's sound from the current kit's sound set
    recorder.js       records hits, plays them back, adds layers (overdub)
    render-recording.js  renders a recording offline with the current kit, volume and EQ
    wav.js            turns rendered sound into a 16-bit stereo WAV file
    metronome.js      steady click at a set tempo
    scheduler.js      books sounds slightly ahead for tight timing
    noise.js          white noise source
    metal.js          metallic tone source for hi-hats and cymbals
    kick.js           kick sound
    snare.js          snare sound
    tom.js            tom sound (all three toms)
    hihat.js          closed and open hi-hat sounds
    cymbal.js         crash, splash and ride sounds
    kits/
      acoustic.js     Studio kit sounds
      electronic.js   Electronic kit sounds
      jazz.js         Jazz kit sounds
  learn/
    pattern.js        how beats are written (text rows), counts, steps, stand-ins for pads a kit lacks
    lessons.js        the 8 step-by-step lessons
    beats.js          the 10 style beats
    judge.js          judges each hit as on time, early, late or missed; streak and score
    lesson-player.js  runs a lesson or beat on the audio clock: count-in, clicks (can be off), cues, demo, result
    step-player.js    Step by step mode: the beat waits on each step until you hit its drums
  input/
    pointer.js        touch, mouse and pen input (multi-touch, Hover mode)
    keyboard.js       keys that play the pads of the kit on stage
    modes.js          Hover / Tap input modes
  kit/
    stage.js          puts a kit on stage and swaps it (drawing, hit areas, motion, effects)
    kit-view.js       draws a kit into the page
    grid-layout.js    the Pad grid: the same kit laid out as big tiles, fitted to the kit area's shape
    hit-areas.js      invisible hit areas and hit glow
    key-labels.js     key names shown on the pads
    motion.js         how pieces move when hit (thump, wobble, beater, hi-hat) and the entrance
    effects.js        ripples on drum heads and shimmer on cymbals
    cues.js           the soft glow on the pad to hit during a lesson
    lesson-focus.js   names and keys on the drums a lesson uses; the others dimmed
    sticks.js         optional drumsticks that strike and twirl (removable feature)
    kits/
      index.js        the list of kits (layout + sounds)
      acoustic.js     Studio kit layout
      electronic.js   Electronic kit layout and rack
      jazz.js         Jazz kit layout
    art/
      shared.js       shared gradients and the drum top view
      finishes.js     colour sets for shells, cymbals, hardware, heads and sticks
      themes.js       the themes and how they are applied
      stick-types.js  drumstick types (removable drumsticks feature)
      stick-extras.js stick accessories: grip, tip cover, chain, sticker, strap or charm, clip-on light (removable drumsticks feature)
      wraps.js        theme wrap patterns and kick graphics
      backdrops.js    the list of backgrounds, drawing one behind the kit, card previews
      doodles.js      faint music doodles on the Plain background, scattered in varied sizes and angles
      sketch-props.js sketched props on the Plain background: music stand, side table, guitar, amp
      backdrop-art.js background drawings: oak planks, concrete, rug, spotlit stage
      concert-art.js  the Concert mode scene: venue, barrier, truss with swaying beams, disco ball, light pools
      concert-crowd.js  the Concert crowd: facing the stage, mixed hairstyles, signs, glow sticks, phone lights, beach ball
      atmosphere.js   moving light over each background, and the footlights' soft glow on hits
      backdrop-props.js  still props round each background (amp, mic stand, monitors, lamp, crate, wedges)
      atmosphere-props.js  moving props (amp light, mug steam, plants, spinning record, footlights, haze)
      accessories/
        index.js      which accessories each theme puts on which piece
        hoops.js      painted hoops
        lights.js     LED glow inside drums
        dampers.js    O-ring, gel pads, gaffer tape, snare wallet
        cloth.js      towel and stick bag
        chains.js     sizzle chain and bead rattler on cymbals, chain over the kick
        tools.js      glow tape, coloured cymbal felts
        charms.js     lucky knot and fuzzy dice hung on a rim
        e-pads.js     Electronic kit: coloured mesh, rims, cymbal edges, tower sticker spots
        mics.js       clip-on drum mics
        percussion.js hi-hat tambourine
        stickers.js   vinyl stickers for the kick shell
      kick.js         kick drawing
      snare.js        snare drawing
      tom.js          tom drawing (rack and floor)
      cymbal.js       crash, splash and ride drawing
      hihat.js        hi-hat drawing (closed and open)
      gear.js         gear around the kit: cymbal and hi-hat stands, stool, tablet, spare sticks
      grid-pad.js     one Pad grid tile: corner glow, line drawing of the instrument, colour bar and name
      electronic.js   electronic pads, cymbal pads, kick tower, module, cables, headphones
  ui/
    toolbar.js        toolbar buttons, Hover / Tap switch, theme
    transport.js      toolbar Rec button (with its timer) and metronome button
    countdown.js      the 3, 2, 1 (and REC flash) in the middle of the kit before recording
    recording-panel.js  panel: top row (title, player, Download, Delete, help), layer timeline, then Add layer / Undo
    recording-panel-markup.js  the recording panel's HTML
    panel-playback.js  Play/Stop, Loop and the play time at the top of the recording panel
    panel-caret.js    the small triangle on the panel pointing up at Rec
    timeline-glide.js  slides the hit marks when the timeline's time scale changes
    download-recording.js  the Download button: renders and saves the WAV file
    kit-drawer.js     the Customize drawer from the left: Kit, EQ, Look, Background and Sticks tabs
    backdrop-picker.js  Background tab cards
    kit-previews.js   small preview drawings for the Customize drawer cards
    help-drawer.js    the How to play guide (steps, Try it, quick jumps)
    help-visuals.js   live mini pictures of the UI and the keyboard map for the guide
    spotlight.js      makes a real control glow ("Try it")
    sticks-settings.js  drumsticks switch, type cards, colour swatches and accessory chips, in the Sticks tab (removable feature)
    concert-mode.js   Concert mode: crowd reactions, on every screen
    flash-lights.js   decides when lights may react to hits: at most twice a second, never with reduced motion or the setting off
    toast.js          short messages that fade away, and one-time notices with a close button
    phone-turns.js    Learn and Concert take turns; on phones the recording panel folds during a lesson
    learn-extras.js   the lesson bar's ⋮ dropdown on phones (Demo, click, speed)
    lesson-lock.js    during a running lesson, drums it does not use stay silent (with a short note)
    rotate-notice.js  one-time "turn your phone sideways" notice on upright phones
    confirm-toast.js  asks before a reset, delete or replace, in a popup below the button (Cancel / Yes)
    more-menu.js      the ⋮ menu with EQ, Focus, light or dark, settings, How to play (keyboard-friendly)
    focus-mode.js     Focus mode: just the drums, fullscreen where allowed
    credits.js        credit lines, portfolio link and the code & prompts link (both addresses set here)
    learn-panel.js    the lesson bar (beat grid, Demo, Start, speed, result)
    learn-caption.js  the lesson tip at the bottom of the screen, with a close button
    learn-panel-markup.js  the lesson bar's HTML
    learn-texts.js    the lesson bar's messages (goal, progress, results)
    beat-grid.js      the drum-machine grid with the sweeping line and coloured dots
    learn-hud.js      the scoreboard over the kit and the big count-in
    learn-drawer.js   the Learn drawer: Lessons and Beats tabs with difficulty, speed and best scores
    tooltip.js        explanation card on mouse hover (desktop only)
    tip.js            one-time tip shown after the first recording
    eq-panel.js       EQ tab in Customize: volume, preset chips and sliders
    menu-settings.js  settings in the ⋮ menu: key names, Flashing lights, tempo, Reset all
    drawer.js         shared open / close behaviour for panels
    storage.js        remembers settings in this browser
    icons.js          interface icons drawn in SVG
  styles/
    tokens.css        colours, spacing and radius (dark and light)
    base.css          base page styles
    toolbar.css       toolbar layout, buttons and Hover / Tap switch
    transport.css     toolbar Rec pill and its count-in / recording states
    countdown.css     the big countdown numbers and the REC flash
    recording-panel.css  recording panel layout, title, player and footer
    recording-panel-buttons.css  the panel's buttons, Play/Stop, Loop, fold and the caret
    recording-panel-side.css  the panel as a right-hand column on phones held sideways
    recording-panel-states.css  folded panel, note after Delete, phone layouts
    recording-panel-live.css  while recording (red moving line), floating over the Concert crowd on phones; smaller buttons held sideways
    timeline-empty.css  dashed empty layer rows ("Tap to add a layer")
    timeline.css      layer timeline rows, ticks, playback line, row being recorded
    metronome.css     metronome button and beat light
    accents.css       panel accents: corner glow, heading underlines, fading dividers, chosen-card badge
    atmosphere.css    the atmosphere layer over the kit and its gentle animations
    concert.css       Concert mode: scene placement and crowd and light animations
    toast.css         the short message at the bottom of the screen (and its close button)
    menu.css          the Learn and Concert buttons (outline, moving gradient border) and the ⋮ menu with its settings
    menu-settings.css  the settings rows inside the ⋮ menu (switches, Metronome, tempo)
    focus.css         Focus mode: hides the rest and shows the ✕
    credits.css       the credit line in the bottom-right corner and at the end of the ⋮ menu
    kit-drawer.css    the Customize tab and drawer, tabs, hint, cards and EQ panel
    help.css          guide layout, step cards, Try it buttons
    help-visuals.css  the guide's live pictures of the UI
    keyboard-map.css  the guide's keyboard map
    sticks.css        the drumsticks over the kit and the colour swatches (removable feature)
    learn.css         the lesson bar and beat grid
    learn-hud.css     the scoreboard over the kit and the glow on the pad to hit
    learn-lists.css   the lists of lessons and beats in the Learn drawer
    learn-small.css   the Learn bar on tablets and phones
    learn-buttons.css the Learn bar buttons and step-by-step mode
    learn-lesson.css  drum labels, goal bar and tip caption during a lesson
    learn-extras.css  Demo, click and speed: on the bar, or a ⋮ dropdown on phones; the short info line
    tooltip.css       hover card, swinging metronome picture, one-time tip
    kit.css           kit area, key names and hit areas
    grid.css          the Pad grid tiles and role colours
    drawer.css        panels, chips, sliders and switches
```

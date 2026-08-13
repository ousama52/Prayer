# Prayer Bead Counter App — Build Plan

A mobile-first digital japa mala (prayer bead) counter with a dark glassmorphism UI, switchable bead skins, round tracking, and a reverse countdown mode that plays a mantra audio clip when complete.

## Stack

- React + Vite (matches your other projects)
- Deploy target: Netlify (CLI deploy, same flow as your other apps)
- Pure CSS for glassmorphism (no heavy UI library needed)
- Web Audio API / `<audio>` element for the mantra playback

## Core Concept

- A mala of **9 beads** displayed in a circular arc/ring, sized and centered for smartphone screens (portrait-first, touch-friendly hit targets ~48px+).
- Tapping the **next bead in sequence** advances the count. Only the current bead should visibly respond — tapping out of order is ignored (mirrors how a physical mala is used, one bead at a time).
- The active/current bead gets a highlight (glow, scale-up, or color shift) so the user always knows where they are.

## Features

### 1. Bead counting + loop tracking
- Each tap on the screen advances a `beadIndex` (0–8).
- When `beadIndex` wraps past the 9th bead back to the 1st, that's **one loop** — increment a `roundCount` by 1 and show it in a counter on screen.
- A **Reset** button zeroes both `beadIndex` and `roundCount`.

### 2. Bead skin switcher
- A settings/skin picker (small icon button, opens a bottom sheet or modal on mobile) lets the user choose the bead material/appearance:
  - **Glass** (default) — translucent, glassmorphic bead with blur + highlight
  - Wood, Stone/Marble, Metallic — alternate visual styles, swappable via a CSS class or theme token on the bead component
- Skin choice can be stored in local state (or `localStorage` if you want it to persist between visits).

### 3. Reverse / countdown mode
- A toggle or separate mode: user sets a **target number of rounds** (e.g. 108 rounds, or any number).
- Instead of counting up, each completed loop **subtracts 1** from the remaining rounds counter.
- When remaining rounds hits **0**, the app plays a mantra audio clip.

### 4. Completion audio
- Have Claude Code search for and download a free, royalty-free audio clip of the **"Om Mani Padme Hum"** mantra (chant or single vocalization) — check sources like Freesound.org, Pixabay Audio, or similar free-license libraries, and bundle the file locally in the project (e.g. `/src/assets/audio/mantra.mp3`) rather than linking externally, so it works offline and doesn't break if a URL changes. Confirm the license permits redistribution/use in the app.
- Play it via a simple `<audio>` element or the Web Audio API when the countdown reaches 0.

## UI / Design Direction

- **Dark glassmorphism**: deep background (near-black or dark navy/purple gradient), frosted-glass panels using `backdrop-filter: blur(...)`, semi-transparent white borders (`rgba(255,255,255,0.1–0.2)`), soft glowing accents for the active bead and buttons.
- Large, centered round counter (and remaining-rounds counter in reverse mode) — should be the most legible element on screen.
- Bottom or floating action buttons: Reset, Skin picker, Mode toggle (forward/reverse), Set target rounds (in reverse mode).
- Keep layout single-column and thumb-reachable — this is meant to be used one-handed while chanting.

## Suggested Component Structure

```
src/
  components/
    MalaRing.jsx        // renders the 9 beads in a circle, handles tap logic
    Bead.jsx            // single bead, skin-aware styling
    CounterDisplay.jsx  // round count / remaining rounds
    ControlsBar.jsx     // reset, mode toggle, skin picker, target input
    SkinPicker.jsx       // modal/sheet for choosing bead skin
  hooks/
    useMalaCounter.js   // beadIndex, roundCount, loop detection, reverse logic
  assets/
    audio/mantra.mp3
```

## Netlify Deploy

```bash
npm run build
netlify deploy --prod --dir=dist
```

(Or with a `netlify.toml` build/publish config, `netlify deploy --prod --build`.)

## Next Step

Hand this file to Claude Code in VS Code to scaffold the project, build the bead ring interaction, implement forward/reverse counting logic, wire up the skin switcher, and source + bundle the mantra audio clip.

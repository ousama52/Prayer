# Prayer Bead Counter

A mobile-first digital japa mala (prayer bead) counter with a dark glassmorphism UI, switchable bead skins, round tracking, and a reverse countdown mode that plays a mantra clip when your target rounds are complete.

## Features

- **9-bead mala ring** — tap the active bead in sequence to advance the count, just like a physical mala.
- **Round tracking** — completing a loop of all 9 beads increments your round counter.
- **Reset** — zero out the current count and start again.
- **Bead skins** — switch between Glass (default), Wood, Stone/Marble, and Metallic styles.
- **Reverse (countdown) mode** — set a target number of rounds; each completed loop counts down instead of up.
- **Completion audio** — reaching 0 in reverse mode plays an "Om Mani Padme Hum" mantra clip.

## Getting Started

```bash
npm install
npm run dev
```

Open the printed local URL on your phone (or resize your browser to a portrait mobile viewport) to try it out.

## Build

```bash
npm run build
```

## Deploy (Netlify)

```bash
netlify deploy --prod --dir=dist
```

Or, with a `netlify.toml` build/publish config already set up:

```bash
netlify deploy --prod --build
```

## Tech Stack

- React + Vite
- Plain CSS (glassmorphism via `backdrop-filter`, no UI framework)
- `<audio>` element for mantra playback

## Project Structure

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

## Notes

- Audio clip is bundled locally under `src/assets/audio/` (royalty-free, sourced for offline use).
- No test suite is included by design — this project favors working functionality over test coverage.

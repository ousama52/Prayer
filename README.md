# Prayer Bead Counter

A mobile-first digital japa mala — a 9, 27 or 108 bead ring, dark glassmorphism UI, round tracking, and a countdown mode that plays an "Om Mani Padme Hum" clip when your target rounds are done.

Live: <https://prayer-bead-mala.netlify.app>

## Use

Tap **anywhere** on the screen to advance one bead; the glowing bead is your current position. One trip around the ring = one round. Taps on the controls don't count.

- **Count up** — rounds tick upward.
- **Countdown** — pick a target (9 / 27 / 54 / 108 or your own); each round subtracts one, and hitting 0 plays the mantra.
- **Reset** — back to zero.
- **Beads** — ring size (9 / 27 / 108 beads per round) and skin (Glass, Wood, Stone, Metal, Light). Both remembered between visits. Switching size drops the part-finished round; completed rounds stand.

## Develop

```bash
npm install
npm run dev      # local dev server
npm run build    # production build to dist/
```

## Deploy

```bash
netlify deploy --prod --build
```

## Stack

React + Vite, plain CSS, one component ([src/App.jsx](src/App.jsx)) plus [src/styles.css](src/styles.css). No UI framework, no test suite.

Mantra audio: ["Om mani padme hum" by Dingjue](https://commons.wikimedia.org/wiki/File:20260602_145912_Dingjue_Om_mani_padme_hum.ogg) (Wikimedia Commons, CC0 — public domain), bundled locally at `src/assets/audio/mantra.ogg` so it works offline. Browsers that can't decode Ogg Vorbis fall back to a synthesized chime.

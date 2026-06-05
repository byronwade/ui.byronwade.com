# Music Components (Spotify-modeled) — design spec

**Date:** 2026-06-04
**Status:** Approved (brainstorming) → ready for implementation plan
**Branch:** `feat/brand-reskin-hero` (build all on one branch, single cohesive PR)
**Source:** New component set for the `byronwade/ui` registry, modeled after the surfaces of a
music-streaming platform (Spotify-style). These are surfaces the registry does **not** already
cover — the existing `video-player` is the only media component.

## Background

The registry ships a token-mapped `video-player` (media-chrome, `registry/ui/video-player.tsx`)
but nothing audio/music-specific. This adds a coherent set of nine music components that compose
cleanly, reuse the shared accent (`--brand`), and meet every repo gate.

All components are **presentational / controlled** — they take props and fire callbacks so a
consumer wires their own audio engine — with **one exception**: `audio-player` wraps real
`media-chrome` `<audio>` playback, exactly mirroring how `video-player` wraps `<video>`.

## Goals

1. Add nine Design-DNA-compliant music components: tokens only, accent → `--brand`, Base UI / CVA /
   `data-slot`, `cn()` + `className` passthrough, editorial typography (`font-mono` for
   durations/counts/timestamps; headings `font-normal`/`font-medium`).
2. Compose: primitives reused across composites (`equalizer-bars` → album-cover / track-row /
   now-playing-bar; `album-cover` → now-playing-bar / playlist-card / artist-header).
3. Meet mandatory gates for every item: `registry.json` entry, `content/examples/<slug>/default.tsx`,
   `tests/components/<slug>.test.tsx` (every variant/state/interaction + `axe`), a line in
   `registry/rules/byronwade-ui.mdc`, and coverage thresholds (statements ≥ 99%, branches ≥ 96%,
   functions = 100%, lines ≥ 99%).

## Non-goals

- No real audio engine for any component other than `audio-player`. No Web Audio API analysis
  (waveform `peaks` are passed in, not computed).
- No router/data coupling. No global player store — state is owned by the consumer.
- No drag-and-drop reordering of tracks/queue (out of scope; can be a later addition).

---

## Token & DNA rules (apply to every component)

- **Accent = `--brand`.** Active/playing states, progress fills, the play FAB, equalizer bars, and
  focus rings all resolve to `--brand`. Never a literal green.
- **Surfaces:** `bg-card` / `bg-background` / `bg-popover`; hover rows `bg-accent`; muted text
  `text-muted-foreground`; borders `border-border`.
- **Typography:** durations, timestamps, listener counts, track numbers → `font-mono` (tabular
  where numeric). Titles → `font-medium`; large display names → `font-normal`. Never `font-bold`.
- **Radius:** `rounded-*` scale (from `--radius`), no pixel radii.
- **Motion:** every animation honors `motion-reduce:*` / `prefers-reduced-motion` (freeze, don't
  remove meaning).
- **A11y:** real buttons for interactive affordances, `aria-label`s on icon-only controls,
  `focus-visible:ring-ring`, keyboard operation for seek/rows/lyrics.

---

## Primitives → `registry/ui/`

### 1. `equalizer-bars`

The shared "is playing" primitive — small animated bars.

- **Props:** `bars?: number` (default 4), `playing?: boolean`, `size?: "sm" | "md" | "lg"`,
  `className`, `aria-label?`.
- **Render:** N `<span>` bars, `bg-brand`, animated height via CSS keyframes with **staggered
  `animationDelay`** per bar. When `playing` is false (or `prefers-reduced-motion`), bars hold a
  static height (`animation-play-state: paused` / `motion-reduce:animate-none`).
- **A11y:** decorative by default (`aria-hidden`); if `aria-label` is supplied, expose `role="img"`.
- **Slot:** `data-slot="equalizer-bars"`, `data-playing`.
- **Deps:** foundation, utils.

### 2. `album-cover`

Square artwork with hover play affordance.

- **Built on:** `aspect-ratio` (square).
- **Props:** `src`, `alt`, `size?` (cva: `sm`/`md`/`lg`/`xl` → max-width), `rounded?`
  (`md` album default | `full` for artist circle | `lg` playlist), `shadow?: boolean`,
  `playing?: boolean`, `onPlay?: () => void`, `className`.
- **Render:** `<img>` cover; on hover/focus reveal a brand circular play FAB
  (`bg-brand text-primary-foreground`, lifts on hover) — pattern borrowed from
  `video-player`'s poster button. When `playing`, render `equalizer-bars` overlay instead of the
  play glyph and keep the FAB in a pause state.
- **A11y:** the play affordance is a real `<button aria-label="Play {alt}">`; cover image has `alt`.
- **Slot:** `data-slot="album-cover"`, plus `album-cover-image`, `album-cover-play`.
- **Deps:** foundation, aspect-ratio, equalizer-bars, utils.

### 3. `audio-waveform`

Bar-style waveform scrubber.

- **Props:** `peaks: number[]` (0–1 heights), `progress?: number` (0–1), `onSeek?: (ratio) => void`,
  `height?`, `className`.
- **Render:** one `<span>` bar per peak. Played portion (`index/length <= progress`) → `bg-brand`;
  remainder → `bg-muted-foreground/30`. Click/drag computes ratio from pointer X; container is a
  `role="slider"` with `aria-valuenow/min/max`, arrow-key seek (±step), `onSeek` callback.
- **Motion:** progress transition uses `motion-reduce:transition-none`.
- **Slot:** `data-slot="audio-waveform"`, `audio-waveform-bar`.
- **Deps:** foundation, utils.

### 4. `track-list` / `track-row`

Numbered song rows (one file, two exports).

- **`TrackList`:** wrapper (`role="list"` / table-ish stack), optional header row.
- **`TrackRow` props:** `index`, `title`, `artist?`, `album?`, `duration` (string e.g. `3:24`),
  `active?`, `playing?`, `explicit?`, `liked?`, `onPlay?`, `onLikeToggle?`, `className`.
- **Render:** leading cell shows the **index number (`font-mono`)** → swaps to a play glyph on
  row hover/focus → shows `equalizer-bars` when `active && playing`. Title (`font-medium`,
  `text-foreground` when active else default), artist (`text-muted-foreground`), optional `explicit`
  `badge`, like toggle (heart), duration (`font-mono tabular-nums text-muted-foreground`).
- **Interaction:** the row is keyboard-activatable (button-row) → `onPlay`; hover `bg-accent`.
  Active row tints `text-brand` on the title/number.
- **Slot:** `data-slot="track-list"` / `track-row` (+ sub-slots).
- **Deps:** foundation, badge, equalizer-bars, utils.

### 5. `now-playing-bar`

Sticky bottom transport bar — composable parts, fully controlled.

- **Exports:** `NowPlayingBar` (sticky/bottom container, `bg-card`/`bg-background`, top border),
  `NowPlayingBarTrack` (small `album-cover` + title/artist + like),
  `NowPlayingBarControls` (shuffle / prev / **play-pause** / next / repeat icon buttons),
  `NowPlayingBarProgress` (elapsed `font-mono` + `slider` scrubber + total `font-mono`),
  `NowPlayingBarExtras` (queue / device / **volume** `slider`).
- **Props:** container is layout-only; parts take the controlled props they need
  (`isPlaying`, `onPlayPause`, `progress`, `duration`, `onSeek`, `volume`, `onVolumeChange`, …).
- **Built on:** `slider` (scrubber + volume), `album-cover`, `button` styles.
- **A11y:** all transport buttons labeled; play/pause toggles `aria-pressed`/label; sliders inherit
  Base UI slider a11y.
- **Slot:** `data-slot="now-playing-bar"` (+ part slots).
- **Deps:** foundation, slider, album-cover, utils.

### 6. `audio-player` _(real playback)_

Audio sibling of `video-player`, themed media-chrome.

- **Built on:** `media-chrome/react` (`MediaController`, `MediaControlBar`, `MediaPlayButton`,
  `MediaTimeRange`, `MediaTimeDisplay`, `MediaMuteButton`, `MediaVolumeRange`,
  `MediaSeekBackward/ForwardButton`) — same `mediaVariables` token map as `video-player`
  (accent → `--brand`).
- **Exports:** `AudioPlayer`, `AudioPlayerContent` (`<audio slot="media">`), `AudioPlayerControlBar`,
  `AudioPlayer{Play,SeekBackward,SeekForward,Mute}Button`, `AudioPlayerTimeRange`,
  `AudioPlayerTimeDisplay`, `AudioPlayerVolumeRange` — mirroring the video-player part set.
- **Variants (cva):** `default` (card + border + shadow), `minimal` (borderless), `card`
  (row with optional leading artwork via children).
- **Slot:** `data-slot="audio-player"` (+ part slots), `data-variant`.
- **Deps:** `media-chrome` (npm dependency), foundation, utils.

### 7. `lyrics`

Synced, scrolling lyric lines.

- **Props:** `lines: { time?: number; text: string }[]`, `activeIndex?: number`,
  `onLineClick?: (index) => void`, `className`.
- **Render:** vertical stack of lines; active line `text-foreground` (and subtle scale/weight bump),
  others `text-muted-foreground`. When `activeIndex` changes, **auto-scroll** the active line into
  view (`scrollIntoView({ block: "center" })`), guarded by `prefers-reduced-motion` (`behavior`
  becomes `"auto"`). Lines with an `onLineClick` are real buttons (seek-to-line).
- **Slot:** `data-slot="lyrics"`, `lyrics-line`, `data-active`.
- **Deps:** foundation, utils.

---

## Composites → `registry/components/`

### 8. `playlist-card`

Grid tile composing `album-cover`.

- **Props:** `src`, `alt`/`title`, `description?`, `playing?`, `onPlay?`, `href?` (optional anchor
  wrap), `className`.
- **Render:** `album-cover` (rounded `lg`, shadow) with hover-lifted play FAB, then `title`
  (`font-medium`, truncate) and `description` (`text-muted-foreground text-sm`, line-clamp). Whole
  card hover raises elevation (`bg-card` → subtle).
- **Slot:** `data-slot="playlist-card"`.
- **Deps:** foundation, album-cover, utils.

### 9. `artist-header`

Hero header composing artwork + stats + actions.

- **Props:** `name`, `image`, `verified?`, `monthlyListeners?: number`, `isFollowing?`,
  `isPlaying?`, `onPlay?`, `onFollowToggle?`, `className`.
- **Render:** large circular/rounded `album-cover` (or `avatar`), verified `badge`
  ("Verified Artist"), artist `name` (`font-normal`, large/tracking-tight), monthly-listeners stat
  (`font-mono` — formatted with thousands separators) `+ " monthly listeners"`, a primary **Play**
  `button` (`bg-brand`) and a **Follow** outline `button` toggle.
- **Slot:** `data-slot="artist-header"`.
- **Deps:** foundation, album-cover (or avatar), badge, button, utils.

---

## Build order (dependency-respecting)

1. `equalizer-bars`
2. `album-cover` (needs equalizer-bars)
3. `audio-waveform`
4. `track-list` / `track-row` (needs equalizer-bars, badge)
5. `lyrics`
6. `now-playing-bar` (needs album-cover, slider)
7. `audio-player` (independent; media-chrome)
8. `playlist-card` (needs album-cover)
9. `artist-header` (needs album-cover/avatar, badge, button)

## Per-component repo contract (all nine)

1. Source under `registry/ui/` or `registry/components/`.
2. `registry.json` item (type, files target, `dependencies` for media-chrome on audio-player,
   `registryDependencies` listing `@byronwade/*` deps from the graph above).
3. `content/examples/<slug>/default.tsx` (run `npm run gen:examples`).
4. `tests/components/<slug>.test.tsx` — default render, every variant/size/state, every interaction
   (clicks, keyboard, callbacks fired), and `axe`.
5. A line naming the component in `registry/rules/byronwade-ui.mdc` (enforced by `check:rule`).

## Verification

- `npm run update:registry` (gen all → sync → build → validate) green.
- `npm run test:ci` (check:tests + suite + coverage thresholds) green.
- `npm run build` (typecheck) green before any deploy.

## Risks / watch-items

- **Coverage thresholds are strict** (branches ≥ 96%, functions 100%). Every prop branch
  (variants, `playing`, `active`, reduced-motion path) needs a test. Budget test time accordingly.
- **`audio-player` + media-chrome in jsdom:** media-chrome custom elements may need the same test
  treatment the existing `video-player.test.tsx` uses — mirror that test's setup.
- **Pointer/seek math** in `audio-waveform` and sliders is hard to exercise in jsdom; test via
  `getBoundingClientRect` mocks + keyboard paths (mirror existing slider-based tests).
- **Auto-scroll in `lyrics`:** `scrollIntoView` is not implemented in jsdom — mock/spy it in tests.

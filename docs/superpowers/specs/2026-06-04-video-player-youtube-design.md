# Video Player — YouTube-grade rebuild

**Date:** 2026-06-04
**Branch:** `feat/video-player-youtube` (worktree, branched from `feat/brand-reskin-hero` HEAD)
**Status:** Approved design — ready for implementation plan
**Registry item:** `video-player` (rebuilt in place; backward-compatible exports retained)

## 1. Goal

Rebuild the `video-player` component into a dramatically more feature-rich, "intelligent"
player modeled after YouTube — while staying 100% on the byronwade/ui Design DNA (tokens only,
editorial type, Base UI / media-chrome + CVA + `data-slot`, accessible, dark-mode free).

The current component is a thin token-mapped wrapper over `media-chrome/react` exposing a small
set of composable parts (play, seek, time, mute, volume) and four CVA variants
(`default`/`minimal`/`theater`/`poster`). We keep that engine and that composable surface
(backward compatible) and grow two things on top: **(a) a much larger set of token-mapped parts**
and **(b) one opinionated, batteries-included `MediaPlayer` preset** that assembles a
YouTube-faithful layout from props.

## 2. Engine decision (settled)

Stay on **media-chrome `MediaController`** (v4.19.1, already a dependency). Verified available:

- Core React parts (`media-chrome/react`): `MediaController`, `MediaControlBar`,
  `MediaPlayButton`, `MediaSeekBackward/ForwardButton`, `MediaTimeRange`, `MediaTimeDisplay`,
  `MediaDurationDisplay`, `MediaMuteButton`, `MediaVolumeRange`, `MediaCaptionsButton`,
  `MediaFullscreenButton`, `MediaPipButton`, `MediaLoopButton`, `MediaAirplayButton`,
  `MediaCastButton`, `MediaLiveButton`, `MediaLoadingIndicator`, `MediaPosterImage`,
  `MediaGestureReceiver`, `MediaPreviewThumbnail`, `MediaPreviewTimeDisplay`,
  `MediaPreviewChapterDisplay`, `MediaTooltip`, `MediaErrorDialog`,
  `MediaKeyboardShortcutsDialog`.
- Menu system (`media-chrome/react/menu`, same package — **no new runtime dep**):
  `MediaSettingsMenu(+Button/Item)`, `MediaRenditionMenu(+Button)` (quality),
  `MediaCaptionsMenu(+Button)`, `MediaPlaybackRateMenu(+Button)`, `MediaAudioTrackMenu(+Button)`.

This gives accessible, cross-browser fullscreen, PiP, captions, quality, speed, chapters, and
storyboard scrub previews for free. A full custom rebuild on raw `<video>` was rejected
(reimplementing those reliably + accessibly is far more code and more brittle).

`hls.js` (true adaptive bitrate) is **out of scope** for this pass — quality is driven by
media-chrome renditions when the source provides them; the preset exposes a `qualities`
escape hatch but does not bundle a streaming engine.

## 3. Architecture — files & units

One registry item, three source concerns, isolated for testability:

| File                                 | Role                                                                                   | Tested by             |
| ------------------------------------ | -------------------------------------------------------------------------------------- | --------------------- |
| `registry/ui/video-player.tsx`       | All React parts + `MediaPlayer` preset (DOM/JSX, thin)                                 | component DOM tests   |
| `registry/lib/video-player-utils.ts` | **Pure, no-DOM** logic (resume, keymap, gesture, chapters→VTT, heatmap math, time fmt) | exhaustive unit tests |
| `content/examples/video-player/*`    | `default`, `variants`, plus `youtube` + `composable`                                   | `check:examples`      |

**Why the split:** the coverage gate is functions ≥ 100%, branches ≥ 96%, statements/lines ≥ 99%.
The "intelligent" behaviors are exactly the browser-API-heavy code that resists jsdom coverage
(localStorage, key handling, fullscreen/PiP). Extracting their decision logic into pure functions
with injectable dependencies makes 100% functions/branches reachable without fighting jsdom; the
component file stays a thin wiring layer.

## 4. Layer A — composable parts (backward compatible)

`VideoPlayer` remains the root `MediaController` wrapper. **Every current export keeps working
unchanged** (`VideoPlayerContent`, `…ControlBar`, `…PlayButton`, `…SeekBackward/ForwardButton`,
`…TimeRange`, `…TimeDisplay`, `…MuteButton`, `…VolumeRange`, `…Poster`, `videoPlayerVariants`,
`useVideoPlayerVariant`). New variant value: `"youtube"`.

New token-mapped parts (each carries a `data-slot`, merges `cn()`, accepts `className`):

- **Controls:** `VideoPlayerCaptionsButton`, `VideoPlayerFullscreenButton`, `VideoPlayerPipButton`,
  `VideoPlayerLoopButton`, `VideoPlayerDurationDisplay`, `VideoPlayerLoadingIndicator`,
  `VideoPlayerSpacer`, `VideoPlayerLiveButton`.
- **Menus (gear):** `VideoPlayerSettingsMenu` + `VideoPlayerSettingsMenuButton`, with
  `VideoPlayerRenditionMenu(+Button)` (quality), `VideoPlayerCaptionsMenu(+Button)`,
  `VideoPlayerPlaybackRateMenu(+Button)`.
- **Scrub preview:** `VideoPlayerPreviewThumbnail`, `VideoPlayerPreviewTimeDisplay`,
  `VideoPlayerPreviewChapterDisplay` (mounted inside `VideoPlayerTimeRange`).
- **Gestures:** `VideoPlayerGestureReceiver`.
- **On-system overlays (custom, token-only):** `VideoPlayerAmbient`, `VideoPlayerHeatmap`,
  `VideoPlayerChapterMarkers`, `VideoPlayerEndScreen`.

All media-chrome CSS custom properties continue to map to byronwade semantic tokens (the existing
`mediaVariables` block), extended for the new parts (menu background → `--popover`, menu text →
`--popover-foreground`, etc.). The accent stays `--brand`; **no literal colors anywhere.**

## 5. Layer B — `MediaPlayer` preset

One drop-in, batteries-included component that assembles a YouTube-faithful layout from props.
Children are an escape hatch (passing children renders them inside the controller instead of the
default chrome).

```tsx
<MediaPlayer
  src="…"                      // or sources={[{src, type}]}
  poster="…"                   // poster image
  title="…"                    // shown top-left in the gradient scrim
  variant="youtube"            // default for the preset
  chapters={[{ startTime, title }]}     // → VTT chapters track
  heatmap={[0..1, …]}          // most-replayed bars (bg-brand opacity)
  storyboard="…"               // storyboard image for scrub thumbnails (optional)
  qualities                    // rendition menu driven by media-chrome
  captions={[{ src, srcLang, label, default? }]}
  ambient={false}              // opt-in blurred-pixel glow
  resumeKey="…"                // enable resume+memory; key namespaces localStorage
  next={{ title, thumbnail, href, onSelect }}  // end-screen autoplay-next card
  onEnded={…}
  className=…                  // cn() passthrough
/>
```

Default control bar layout (YouTube order): Play · SeekBack/Forward · Time/Duration ·
**flexible spacer** · Captions · Settings(gear) · PiP · Fullscreen — with the scrubber
(`TimeRange` + preview thumbnail + chapter display + heatmap + chapter markers) as a full-width
row above the bar, a big-play / loading affordance centered, a top gradient scrim carrying the
`title`, and `GestureReceiver` zones for tap-to-seek.

## 6. The four "intelligent" features — DNA-clean & testable

### 6.1 Resume + watch memory

Pure functions in `video-player-utils.ts`, storage injected (defaults to `window.localStorage`,
guarded so a throwing/absent store is a no-op):

- `resumeStorageKey(resumeKey) → string`
- `readPlaybackState(storage, key) → { time, volume, rate, muted, captions } | null`
- `writePlaybackState(storage, key, state) → void`
- `clearPlaybackState(storage, key) → void`

Wiring (thin effect in the preset): on `loadedmetadata`, if a saved `time` exists and is past a
small floor and before a near-end ceiling, seek to it; restore volume/rate/muted/captions. On
throttled `timeupdate`, persist. On `ended`, clear. Resume only active when `resumeKey` is set.

### 6.2 Keyboard + gestures

Pure mappers, applied by a thin listener that translates the action onto the media element:

- `resolveMediaKey(event) → MediaAction | null` — layers the **extra** keys on top of
  media-chrome's native hotkeys to avoid double-handling: `j`/`l` = ±10s, `0`–`9` = seek to %,
  `<`/`>` = slower/faster, `i` = PiP. (Space/`k`, `f`, `m`, `c`, arrows, etc. are left to
  media-chrome's built-in `hotkeys`.)
- `resolveGesture(zone, taps) → MediaAction | null` — double-tap left/right zone = ±10s with a
  ripple animation; single tap center = play/pause.

`MediaAction` is a small discriminated union (`{ type: "seek-by", delta }`,
`{ type: "seek-to-fraction", fraction }`, `{ type: "rate-step", dir }`, `{ type: "toggle-pip" }`,
…). Pure → trivially 100% covered. The applier is a tiny switch exercised via synthetic events on
a mocked media element.

### 6.3 Chapters + heatmap

- `chaptersToVtt(chapters, duration?) → string` (pure WebVTT serializer) + `formatVttTime(sec)`.
  The component turns the VTT string into a `Blob` object URL and mounts it as
  `<track kind="chapters">` so media-chrome's `PreviewChapterDisplay` and the scrubber pick it up.
  `URL.createObjectURL` is feature-guarded (and mocked in tests).
- `VideoPlayerChapterMarkers` renders tick `div`s positioned by `startTime / duration` over the
  scrubber.
- `normalizeHeatmap(values) → segments[]` (pure; clamps/normalizes to 0..1). `VideoPlayerHeatmap`
  renders bars as **`bg-brand` with per-segment `opacity` only** — no red/amber gradient, no raw
  color. This is the explicit DNA contract for the heatmap.

### 6.4 Ambient + auto-UI

- **Ambient** = a blurred, scaled, low-opacity **mirror of the video's own pixels** — a muted,
  `aria-hidden`, `tabIndex={-1}`, `pointer-events-none` clone of the same source layered behind the
  frame (`blur-2xl scale-110 opacity-…`, `-z-10`), loosely kept in sync. It paints the video's own
  pixels (not authored color), so it is DNA-clean; no dominant-color extraction. Opt-in via
  `ambient`; the double-decode cost is documented in the component header. Sync decision is a pure
  helper `shouldSyncAmbient(primaryTime, mirrorTime, threshold) → boolean`.
- **Auto-hide controls** ride media-chrome's native `autohide` (no custom timer code).
- **End-screen / autoplay-next** = `VideoPlayerEndScreen`, an overlay state machine modeled on the
  existing tested `VideoPlayerPoster`: shows on `ended` with a "next" card and a countdown
  (countdown tick logic kept pure where practical). Hidden otherwise.

## 7. Design DNA compliance checklist

- Tokens only — every media-chrome var maps to a semantic token; heatmap = `bg-brand`/opacity;
  ambient = video pixels; menu surfaces = `--popover*`. No hex/rgb/hsl/named/arbitrary color.
- Accent = `--brand` everywhere (ranges, focus rings, heatmap, live indicator).
- Editorial type — time/duration/counts stay `font-mono tabular-nums`; titles `font-normal`/
  `font-medium`, never bold.
- Base/media-chrome + CVA + `data-slot` on every part; radius from the `--radius` scale.
- `cn()` + `className` passthrough on every part and the preset.
- Composite (`MediaPlayer`) composes the primitives — no bespoke one-offs.
- Accessibility — preserve media-chrome labels/`aria`/keyboard; `focus-visible:ring-ring`; the
  end-screen/ambient overlays carry correct `aria-hidden`/labels; axe-clean.
- House utilities reused (`glow-brand`, `mask-fade-x`); **no new foundation utility** is required
  (ambient uses inline token-safe `blur/scale/opacity/saturate`). If that changes, the utility is
  authored in the `registry.json` foundation `css` block, never inline-only.

## 8. Testing strategy (gate: fns 100% / branches 96% / stmts·lines 99%)

`tests/components/video-player.test.tsx` (extended) covers:

- **Pure helpers** (imported from the lib): exhaustive cases for `resolveMediaKey`,
  `resolveGesture`, `chaptersToVtt`/`formatVttTime`, `normalizeHeatmap`,
  read/write/clear playback state (including throwing/absent storage), `shouldSyncAmbient`,
  resume floor/ceiling boundaries.
- **Component DOM**: every new `data-slot` renders; token CSS vars present and no literal-color
  leak; `MediaPlayer` assembles the expected parts from props; chapters prop yields a chapters
  `<track>`; heatmap/markers render the right counts/positions; poster + end-screen state machines;
  keymap/gesture dispatch via synthetic events against a mocked media element; `className`
  passthrough; `axe` on default / youtube / poster.
- **Mocks**: `URL.createObjectURL`/`revokeObjectURL`, `HTMLMediaElement.play/pause`
  (existing pattern), fullscreen/PiP feature-detect branches, `requestPictureInPicture`.

## 9. Registry & gate wiring

- `registry.json` `video-player` item: add `registry/lib/video-player-utils.ts` to `files`
  (target `lib/video-player-utils.ts`); keep `dependencies: ["media-chrome"]` (menu is same pkg);
  update `title`/`description`. Do **not** hand-edit the `all` aggregator.
- `registry/rules/byronwade-ui.mdc`: add every new part name + `MediaPlayer` (enforced by
  `check:rule`).
- Examples: add `content/examples/video-player/youtube.tsx` and `…/composable.tsx`; run
  `npm run gen:examples`.
- Run `npm run update:registry`, then `npm run test:ci` (must be green), then **`npm run build`
  for typecheck separately** (test:ci skips types — per project memory).

## 10. Build order (one branch, layered so the core ships green)

1. Expanded composable parts + menus + scrub preview, wired so existing tests still pass.
2. Pure `video-player-utils.ts` (resume, keymap, gesture, chapters→VTT, heatmap) + unit tests.
3. Overlays: ambient, heatmap, chapter markers, end-screen.
4. `MediaPlayer` preset + examples + rule line + full tests; `update:registry`, `test:ci`, `build`.

Each step is independently committable; if the coverage gate later forces a trim, steps 1–2 (the
core player + smarts logic) still ship green and only the heaviest overlay layer would be deferred.

## 11. Out of scope (YAGNI)

- Bundling `hls.js`/dash adaptive streaming engine.
- Server-driven recommendations, real "most-replayed" analytics (heatmap is prop-driven only).
- Cast/AirPlay buttons are available as parts but not in the default preset layout.
- Dominant-color ambient extraction (rejected on DNA grounds; pixel-mirror used instead).

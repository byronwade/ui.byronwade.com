# Music Components (Spotify-modeled) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add nine Design-DNA-compliant, controlled/presentational music components (plus one real-playback `audio-player`) to the `byronwade/ui` registry.

**Architecture:** Primitives in `registry/ui/`, composites in `registry/components/`. Shared accent → `--brand`. The `equalizer-bars` primitive (motion/react, reduced-motion-aware) is reused by `album-cover`, `track-row`, and `now-playing-bar`. `album-cover` is reused by `now-playing-bar`, `playlist-card`, `artist-header`. `now-playing-bar` uses the Base UI `slider`. `audio-player` mirrors `video-player`'s media-chrome token map.

**Tech Stack:** React 19, TypeScript, Tailwind v4 tokens, `@base-ui/react` (slider), `motion/react` (equalizer), `media-chrome/react` (audio-player), `class-variance-authority`, Vitest + Testing Library + `vitest-axe`.

**Spec:** `docs/superpowers/specs/2026-06-04-music-components-design.md`

---

## Conventions every task follows (read once)

- **File header:** Prettier `semi: false`? NO — these files use semicolons (see video-player.tsx). Match the file you're mirroring. `"use client"` at top for any component using hooks/motion/media-chrome/slider.
- **Exports at bottom** (or inline `export const` per existing file style — match the neighbor file).
- **Imports use consumer paths:** `@/lib/utils`, `@/components/ui/<x>`, `@/components/<x>`.
- **Every part carries `data-slot`.** Merge classes with `cn()`. Accept `className`.
- **Tokens only.** Accent = `bg-brand`/`text-brand`/`ring-ring`. Hover rows `bg-accent`. Muted `text-muted-foreground`. `font-mono tabular-nums` for time/counts.
- **The repo contract per component (steps repeated each task):**
  1. Write source.
  2. Add `registry.json` item (alphabetical-ish; match existing field order: `name`, `type`, `title`, `description`, optional `dependencies`, `registryDependencies`, `files`).
  3. Add `content/examples/<slug>/default.tsx`.
  4. Add name (backticked) to a new **"Music / media"** bullet in `registry/rules/byronwade-ui.mdc`.
  5. Write `tests/components/<slug>.test.tsx` (cases listed per task) + `axe`.
  6. `npm run update:registry` then `npm run test:run` (fast) — green before commit. Full `npm run test:ci` at the end.
  7. Commit.

**Rule-file edit (do once, in Task 1):** after the `video-player` bullet group in `registry/rules/byronwade-ui.mdc`, add:

```
- **Music / media** — Spotify-style music UI: `equalizer-bars` (animated now-playing bars),
  `album-cover` (square artwork with hover play FAB), `audio-waveform` (bar waveform scrubber),
  `track-list` / `track-row` (numbered song rows), `now-playing-bar` (sticky transport bar),
  `audio-player` (media-chrome `<audio>` player), `lyrics` (synced scrolling lyric lines),
  `playlist-card` (cover + title + description tile), `artist-header` (artist hero with stats)
```

Add all nine names at once so `check:rule` passes as each registry item lands. (If `check:rule` complains about a name before its item exists, that's fine — the item is added in the same task before running gates.)

---

## Task 1: `equalizer-bars`

**Files:**

- Create: `registry/ui/equalizer-bars.tsx`
- Create: `content/examples/equalizer-bars/default.tsx`
- Create: `tests/components/equalizer-bars.test.tsx`
- Modify: `registry.json`, `registry/rules/byronwade-ui.mdc`

- [ ] **Step 1: Add the rule bullet** (the full "Music / media" block above) after the video-player line in `registry/rules/byronwade-ui.mdc`.

- [ ] **Step 2: Write the failing test** `tests/components/equalizer-bars.test.tsx`:

```tsx
import { render } from "@testing-library/react"
import { expect, describe, it, vi } from "vitest"
import { axe } from "vitest-axe"
import { EqualizerBars } from "@/components/ui/equalizer-bars"

vi.mock("motion/react", async () => {
  const actual =
    await vi.importActual<typeof import("motion/react")>("motion/react")
  return { ...actual, useReducedMotion: () => false }
})

describe("EqualizerBars", () => {
  it("renders the default number of bars (4)", () => {
    const { container } = render(<EqualizerBars />)
    expect(
      container.querySelectorAll('[data-slot="equalizer-bars-bar"]'),
    ).toHaveLength(4)
  })
  it("honors a custom bar count", () => {
    const { container } = render(<EqualizerBars bars={6} />)
    expect(
      container.querySelectorAll('[data-slot="equalizer-bars-bar"]'),
    ).toHaveLength(6)
  })
  it("sets data-playing from the playing prop", () => {
    const { container, rerender } = render(<EqualizerBars playing />)
    expect(container.firstElementChild).toHaveAttribute("data-playing", "true")
    rerender(<EqualizerBars playing={false} />)
    expect(container.firstElementChild).toHaveAttribute("data-playing", "false")
  })
  it("applies size classes", () => {
    const { container } = render(<EqualizerBars size="lg" />)
    expect(container.firstElementChild).toHaveClass("h-5")
  })
  it("is aria-hidden by default and labeled when given aria-label", () => {
    const { container, rerender } = render(<EqualizerBars />)
    expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true")
    rerender(<EqualizerBars aria-label="Now playing" />)
    expect(container.firstElementChild).toHaveAttribute("role", "img")
    expect(container.firstElementChild).toHaveAttribute(
      "aria-label",
      "Now playing",
    )
  })
  it("merges className", () => {
    const { container } = render(<EqualizerBars className="custom" />)
    expect(container.firstElementChild).toHaveClass("custom")
  })
  it("has no axe violations", async () => {
    const { container } = render(<EqualizerBars aria-label="Now playing" />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
```

Add a second describe block with the mock returning `useReducedMotion: () => true` (separate file or `vi.doMock`) to cover the reduced-motion branch — assert bars still render and `data-reduced-motion="true"`.

- [ ] **Step 3: Run test — expect FAIL** (`@/components/ui/equalizer-bars` not found). `npm run test:run -- equalizer-bars`.

- [ ] **Step 4: Write `registry/ui/equalizer-bars.tsx`:**

```tsx
"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { motion, useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"

const equalizerVariants = cva("inline-flex items-end gap-0.5", {
  variants: {
    size: {
      sm: "h-3 gap-px",
      md: "h-4 gap-0.5",
      lg: "h-5 gap-0.5",
    },
  },
  defaultVariants: { size: "md" },
})

const BAR_WIDTH = { sm: "w-0.5", md: "w-0.5", lg: "w-1" } as const

export type EqualizerBarsProps = React.ComponentProps<"span"> &
  VariantProps<typeof equalizerVariants> & {
    /** Number of bars. */
    bars?: number
    /** Animate the bars (false = static low state). */
    playing?: boolean
  }

export function EqualizerBars({
  bars = 4,
  playing = true,
  size = "md",
  className,
  "aria-label": ariaLabel,
  ...props
}: EqualizerBarsProps) {
  const reduced = useReducedMotion()
  const animate = playing && !reduced
  return (
    <span
      data-slot="equalizer-bars"
      data-playing={playing}
      data-reduced-motion={reduced ? "true" : "false"}
      role={ariaLabel ? "img" : undefined}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
      className={cn(equalizerVariants({ size }), className)}
      {...props}
    >
      {Array.from({ length: bars }, (_, i) => (
        <motion.span
          key={i}
          data-slot="equalizer-bars-bar"
          className={cn("block rounded-full bg-brand", BAR_WIDTH[size ?? "md"])}
          initial={{ height: "30%" }}
          animate={
            animate
              ? { height: ["30%", "100%", "45%", "80%", "30%"] }
              : { height: "30%" }
          }
          transition={
            animate
              ? {
                  duration: 0.9,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: (i % 4) * 0.15,
                }
              : { duration: 0 }
          }
        />
      ))}
    </span>
  )
}
```

- [ ] **Step 5: Run tests — expect PASS.** `npm run test:run -- equalizer-bars`.

- [ ] **Step 6: Add `registry.json` item:**

```json
{
  "name": "equalizer-bars",
  "type": "registry:ui",
  "title": "Equalizer bars",
  "description": "Animated now-playing equalizer bars. Accent follows --brand; freezes under prefers-reduced-motion. The shared playing-state primitive for album-cover, track-row, and now-playing-bar.",
  "dependencies": ["motion"],
  "registryDependencies": ["@byronwade/foundation", "@byronwade/utils"],
  "files": [
    {
      "path": "registry/ui/equalizer-bars.tsx",
      "type": "registry:ui",
      "target": "components/ui/equalizer-bars.tsx"
    }
  ]
}
```

- [ ] **Step 7: Write example** `content/examples/equalizer-bars/default.tsx`:

```tsx
import { EqualizerBars } from "@/components/ui/equalizer-bars"

export default function Example() {
  return (
    <div className="flex items-end gap-6 p-8">
      <EqualizerBars size="sm" aria-label="Now playing" />
      <EqualizerBars size="md" aria-label="Now playing" />
      <EqualizerBars size="lg" aria-label="Now playing" />
      <EqualizerBars playing={false} aria-label="Paused" />
    </div>
  )
}
```

- [ ] **Step 8: Gates + commit.** `npm run update:registry && npm run test:run -- equalizer-bars`, then `git add registry/ui/equalizer-bars.tsx content/examples/equalizer-bars registry.json registry/rules/byronwade-ui.mdc tests/components/equalizer-bars.test.tsx && git commit -m "feat(ui): add equalizer-bars — animated now-playing primitive"`.

---

## Task 2: `album-cover`

**Files:** Create `registry/ui/album-cover.tsx`, `content/examples/album-cover/default.tsx`, `tests/components/album-cover.test.tsx`; modify `registry.json`.

- [ ] **Step 1: Failing test** `tests/components/album-cover.test.tsx` — cases:
  - renders an `<img>` with given `src`/`alt`.
  - `size` variants apply max-width classes (`sm`/`md`/`lg`/`xl`).
  - `rounded` variants apply (`md` default, `full`, `lg`).
  - play button renders with `aria-label="Play {alt}"`; clicking fires `onPlay`.
  - when `playing`, renders `equalizer-bars` (`[data-slot="equalizer-bars"]` present) and the button label becomes `Pause {alt}`.
  - keyboard: Enter/Space on the play button fires `onPlay` (native button — covered by click; assert button is a real `<button>`).
  - merges `className`; axe clean.

```tsx
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, describe, it, vi } from "vitest"
import { axe } from "vitest-axe"
import { AlbumCover } from "@/components/ui/album-cover"

const SRC = "https://example.com/a.jpg"

describe("AlbumCover", () => {
  it("renders the cover image", () => {
    render(<AlbumCover src={SRC} alt="Album X" />)
    const img = screen.getByAltText("Album X")
    expect(img).toHaveAttribute("src", SRC)
  })
  it("fires onPlay when the play button is clicked", async () => {
    const onPlay = vi.fn()
    render(<AlbumCover src={SRC} alt="Album X" onPlay={onPlay} />)
    await userEvent.click(screen.getByRole("button", { name: "Play Album X" }))
    expect(onPlay).toHaveBeenCalledOnce()
  })
  it("shows equalizer + pause label when playing", () => {
    const { container } = render(
      <AlbumCover src={SRC} alt="Album X" playing onPlay={() => {}} />,
    )
    expect(
      container.querySelector('[data-slot="equalizer-bars"]'),
    ).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: "Pause Album X" }),
    ).toBeInTheDocument()
  })
  it("applies size and rounded variants", () => {
    const { container } = render(
      <AlbumCover src={SRC} alt="X" size="xl" rounded="full" />,
    )
    const root = container.querySelector('[data-slot="album-cover"]')!
    expect(root.className).toMatch(/max-w/)
    expect(root.className).toMatch(/rounded-full/)
  })
  it("merges className", () => {
    const { container } = render(
      <AlbumCover src={SRC} alt="X" className="custom" />,
    )
    expect(container.querySelector('[data-slot="album-cover"]')).toHaveClass(
      "custom",
    )
  })
  it("renders without a play button when onPlay is omitted", () => {
    render(<AlbumCover src={SRC} alt="X" />)
    expect(screen.queryByRole("button")).toBeNull()
  })
  it("has no axe violations", async () => {
    const { container } = render(
      <AlbumCover src={SRC} alt="Album X" onPlay={() => {}} />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
```

- [ ] **Step 2: Run — expect FAIL.**

- [ ] **Step 3: Write `registry/ui/album-cover.tsx`:**

```tsx
"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { EqualizerBars } from "@/components/ui/equalizer-bars"

const albumCoverVariants = cva(
  "group/album-cover relative isolate aspect-square overflow-hidden bg-muted",
  {
    variants: {
      size: {
        sm: "w-full max-w-12",
        md: "w-full max-w-40",
        lg: "w-full max-w-56",
        xl: "w-full max-w-72",
      },
      rounded: {
        md: "rounded-md",
        lg: "rounded-lg",
        full: "rounded-full",
      },
      shadow: { true: "shadow-md", false: "" },
    },
    defaultVariants: { size: "md", rounded: "md", shadow: false },
  },
)

const PlayIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden
    className="ml-0.5 size-5"
  >
    <path d="M8 5v14l11-7z" />
  </svg>
)
const PauseIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="size-5">
    <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
  </svg>
)

export type AlbumCoverProps = Omit<React.ComponentProps<"div">, "onPlay"> &
  VariantProps<typeof albumCoverVariants> & {
    src: string
    alt: string
    playing?: boolean
    onPlay?: () => void
  }

export function AlbumCover({
  src,
  alt,
  size,
  rounded,
  shadow,
  playing = false,
  onPlay,
  className,
  ...props
}: AlbumCoverProps) {
  return (
    <div
      data-slot="album-cover"
      data-playing={playing}
      className={cn(albumCoverVariants({ size, rounded, shadow }), className)}
      {...props}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        data-slot="album-cover-image"
        className="size-full object-cover"
      />
      {onPlay ? (
        <button
          type="button"
          data-slot="album-cover-play"
          aria-label={`${playing ? "Pause" : "Play"} ${alt}`}
          onClick={onPlay}
          className={cn(
            "absolute right-2 bottom-2 z-10 flex size-10 items-center justify-center rounded-full bg-brand text-primary-foreground shadow-lg outline-none transition-all focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            playing
              ? "opacity-100"
              : "translate-y-1 opacity-0 group-hover/album-cover:translate-y-0 group-hover/album-cover:opacity-100 group-focus-within/album-cover:translate-y-0 group-focus-within/album-cover:opacity-100",
          )}
        >
          {playing ? <PauseIcon /> : <PlayIcon />}
        </button>
      ) : null}
      {playing ? (
        <span
          data-slot="album-cover-equalizer"
          className="absolute top-2 left-2 z-10 rounded-sm bg-background/70 p-1 backdrop-blur-sm"
        >
          <EqualizerBars size="sm" playing aria-label={`${alt} is playing`} />
        </span>
      ) : null}
    </div>
  )
}
```

- [ ] **Step 4: Run — expect PASS.**

- [ ] **Step 5: registry.json item** (`registryDependencies`: `@byronwade/foundation`, `@byronwade/aspect-ratio`, `@byronwade/equalizer-bars`, `@byronwade/utils`; description noting hover play FAB + equalizer). _(aspect-ratio not strictly imported — using `aspect-square` utility — so omit it; deps = foundation, equalizer-bars, utils.)_

- [ ] **Step 6: Example** — a 2×2 grid of covers, one with `playing`, one with `onPlay`, varying `rounded`.

- [ ] **Step 7: Gates + commit** `feat(ui): add album-cover — artwork with hover play + equalizer`.

---

## Task 3: `audio-waveform`

**Files:** Create `registry/ui/audio-waveform.tsx`, example, test; modify `registry.json`.

- [ ] **Step 1: Failing test** — cases:
  - renders one bar per `peaks` entry (`[data-slot="audio-waveform-bar"]` count === peaks.length).
  - bars up to `progress` get `bg-brand`; the rest `bg-muted-foreground/30` (assert via class on a known index given `progress=0.5`).
  - root has `role="slider"`, `aria-valuemin=0`, `aria-valuemax=100`, `aria-valuenow=Math.round(progress*100)`.
  - ArrowRight / ArrowLeft call `onSeek` with clamped ratio (mock `getBoundingClientRect` not needed for keyboard).
  - click calls `onSeek` with computed ratio (mock `getBoundingClientRect` to width 100, click at clientX=50 → ~0.5).
  - merges className; axe clean (give `aria-label`).

```tsx
// key interaction assertions
it("seeks on ArrowRight", async () => {
  const onSeek = vi.fn()
  render(
    <AudioWaveform
      peaks={[0.2, 0.5, 0.8, 1, 0.6]}
      progress={0.5}
      onSeek={onSeek}
      aria-label="Seek"
    />,
  )
  const slider = screen.getByRole("slider")
  slider.focus()
  await userEvent.keyboard("{ArrowRight}")
  expect(onSeek).toHaveBeenCalledWith(expect.any(Number))
  expect(onSeek.mock.calls[0][0]).toBeGreaterThan(0.5)
})
it("seeks on click using pointer position", () => {
  const onSeek = vi.fn()
  const { container } = render(
    <AudioWaveform
      peaks={[0, 0, 0, 0]}
      progress={0}
      onSeek={onSeek}
      aria-label="Seek"
    />,
  )
  const root = container.querySelector(
    '[data-slot="audio-waveform"]',
  ) as HTMLElement
  vi.spyOn(root, "getBoundingClientRect").mockReturnValue({
    left: 0,
    width: 100,
    top: 0,
    right: 100,
    bottom: 0,
    height: 0,
    x: 0,
    y: 0,
    toJSON() {},
  } as DOMRect)
  fireEvent.click(root, { clientX: 25 })
  expect(onSeek).toHaveBeenCalledWith(0.25)
})
```

- [ ] **Step 2: Run — FAIL.**

- [ ] **Step 3: Write `registry/ui/audio-waveform.tsx`:**

```tsx
"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

const STEP = 0.05

export type AudioWaveformProps = Omit<React.ComponentProps<"div">, "onSeek"> & {
  /** Bar heights, each 0–1. */
  peaks: number[]
  /** Playback progress 0–1. */
  progress?: number
  /** Seek callback with a 0–1 ratio. */
  onSeek?: (ratio: number) => void
}

const clamp = (n: number) => Math.min(1, Math.max(0, n))

export function AudioWaveform({
  peaks,
  progress = 0,
  onSeek,
  className,
  "aria-label": ariaLabel = "Seek",
  ...props
}: AudioWaveformProps) {
  const ref = React.useRef<HTMLDivElement>(null)

  const seekFromClientX = (clientX: number) => {
    const el = ref.current
    if (!el || !onSeek) return
    const rect = el.getBoundingClientRect()
    onSeek(clamp((clientX - rect.left) / rect.width))
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!onSeek) return
    if (e.key === "ArrowRight") {
      e.preventDefault()
      onSeek(clamp(progress + STEP))
    } else if (e.key === "ArrowLeft") {
      e.preventDefault()
      onSeek(clamp(progress - STEP))
    } else if (e.key === "Home") {
      e.preventDefault()
      onSeek(0)
    } else if (e.key === "End") {
      e.preventDefault()
      onSeek(1)
    }
  }

  return (
    <div
      ref={ref}
      data-slot="audio-waveform"
      role="slider"
      aria-label={ariaLabel}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
      tabIndex={onSeek ? 0 : undefined}
      onClick={onSeek ? (e) => seekFromClientX(e.clientX) : undefined}
      onKeyDown={onKeyDown}
      className={cn(
        "flex h-12 w-full items-center gap-px outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        onSeek && "cursor-pointer",
        className,
      )}
      {...props}
    >
      {peaks.map((peak, i) => {
        const played = peaks.length > 0 && i / peaks.length <= progress
        return (
          <span
            key={i}
            data-slot="audio-waveform-bar"
            className={cn(
              "min-h-[2px] flex-1 rounded-full transition-colors motion-reduce:transition-none",
              played ? "bg-brand" : "bg-muted-foreground/30",
            )}
            style={{ height: `${Math.max(4, clamp(peak) * 100)}%` }}
          />
        )
      })}
    </div>
  )
}
```

- [ ] **Step 4: Run — PASS.**
- [ ] **Step 5: registry.json** (deps: foundation, utils).
- [ ] **Step 6: Example** — a waveform with random-ish peaks, `progress={0.4}`, logging seek.
- [ ] **Step 7: Gates + commit** `feat(ui): add audio-waveform — bar waveform scrubber`.

---

## Task 4: `track-list` / `track-row`

**Files:** Create `registry/ui/track-list.tsx` (both exports), example, test; modify `registry.json`. Slug = `track-list`.

- [ ] **Step 1: Failing test** — cases:
  - `TrackList` renders children inside a `role="list"`.
  - `TrackRow` shows index number (font-mono) when not hovered/active; title; artist; duration (font-mono).
  - clicking the row fires `onPlay`; pressing Enter/Space on the row fires `onPlay`.
  - `active && playing` renders `equalizer-bars`; the index number is hidden.
  - `explicit` renders an "Explicit" badge/marker (`aria-label` or text "E").
  - `liked` toggles: clicking like button fires `onLikeToggle` and does NOT fire `onPlay` (stopPropagation).
  - active row title gets `text-brand`.
  - axe clean.

```tsx
it("does not trigger onPlay when the like button is clicked", async () => {
  const onPlay = vi.fn()
  const onLikeToggle = vi.fn()
  render(
    <TrackList>
      <TrackRow
        index={1}
        title="T"
        artist="A"
        duration="3:01"
        onPlay={onPlay}
        onLikeToggle={onLikeToggle}
      />
    </TrackList>,
  )
  await userEvent.click(screen.getByRole("button", { name: /like|unlike/i }))
  expect(onLikeToggle).toHaveBeenCalledOnce()
  expect(onPlay).not.toHaveBeenCalled()
})
```

- [ ] **Step 2: Run — FAIL.**

- [ ] **Step 3: Write `registry/ui/track-list.tsx`:**

```tsx
"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { EqualizerBars } from "@/components/ui/equalizer-bars"

export type TrackListProps = React.ComponentProps<"div">

export function TrackList({ className, children, ...props }: TrackListProps) {
  return (
    <div
      data-slot="track-list"
      role="list"
      className={cn("flex flex-col", className)}
      {...props}
    >
      {children}
    </div>
  )
}

const PlayGlyph = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="size-3.5">
    <path d="M8 5v14l11-7z" />
  </svg>
)
const HeartGlyph = ({ filled }: { filled?: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth={2}
    aria-hidden
    className="size-4"
  >
    <path d="M12 21s-7-4.5-9.5-8.5C1 9 2.5 5.5 6 5.5c2 0 3.2 1.3 4 2.5.8-1.2 2-2.5 4-2.5 3.5 0 5 3.5 3.5 7C19 16.5 12 21 12 21z" />
  </svg>
)

export type TrackRowProps = Omit<React.ComponentProps<"div">, "onPlay"> & {
  index: number
  title: string
  artist?: string
  album?: string
  duration: string
  active?: boolean
  playing?: boolean
  explicit?: boolean
  liked?: boolean
  onPlay?: () => void
  onLikeToggle?: () => void
}

export function TrackRow({
  index,
  title,
  artist,
  album,
  duration,
  active = false,
  playing = false,
  explicit = false,
  liked = false,
  onPlay,
  onLikeToggle,
  className,
  ...props
}: TrackRowProps) {
  const handleKey = (e: React.KeyboardEvent) => {
    if (!onPlay) return
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      onPlay()
    }
  }
  return (
    <div
      data-slot="track-row"
      data-active={active}
      role="listitem"
      tabIndex={onPlay ? 0 : undefined}
      onClick={onPlay}
      onKeyDown={handleKey}
      className={cn(
        "group/track-row grid grid-cols-[2rem_1fr_auto] items-center gap-3 rounded-md px-3 py-2 outline-none transition-colors hover:bg-accent focus-visible:bg-accent focus-visible:ring-2 focus-visible:ring-ring",
        onPlay && "cursor-pointer",
        className,
      )}
      {...props}
    >
      <span
        data-slot="track-row-index"
        className="flex w-8 justify-center text-sm text-muted-foreground"
      >
        {active && playing ? (
          <EqualizerBars size="sm" playing aria-label={`${title} is playing`} />
        ) : (
          <>
            <span className="font-mono tabular-nums group-hover/track-row:hidden group-focus-visible/track-row:hidden">
              {index}
            </span>
            <span className="hidden text-foreground group-hover/track-row:inline group-focus-visible/track-row:inline">
              <PlayGlyph />
            </span>
          </>
        )}
      </span>

      <span data-slot="track-row-meta" className="min-w-0">
        <span
          className={cn(
            "block truncate text-sm font-medium",
            active ? "text-brand" : "text-foreground",
          )}
        >
          {title}
        </span>
        {artist || album ? (
          <span className="flex items-center gap-1.5 truncate text-xs text-muted-foreground">
            {explicit ? (
              <Badge
                variant="secondary"
                aria-label="Explicit"
                className="h-3.5 px-1 text-[0.6rem]"
              >
                E
              </Badge>
            ) : null}
            <span className="truncate">
              {[artist, album].filter(Boolean).join(" • ")}
            </span>
          </span>
        ) : null}
      </span>

      <span data-slot="track-row-end" className="flex items-center gap-3">
        {onLikeToggle ? (
          <button
            type="button"
            data-slot="track-row-like"
            aria-label={liked ? "Unlike" : "Like"}
            aria-pressed={liked}
            onClick={(e) => {
              e.stopPropagation()
              onLikeToggle()
            }}
            className={cn(
              "outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
              liked
                ? "text-brand"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <HeartGlyph filled={liked} />
          </button>
        ) : null}
        <span className="font-mono text-xs tabular-nums text-muted-foreground">
          {duration}
        </span>
      </span>
    </div>
  )
}
```

- [ ] **Step 4: Run — PASS.**
- [ ] **Step 5: registry.json** (deps: foundation, badge, equalizer-bars, utils).
- [ ] **Step 6: Example** — `TrackList` with 3–4 `TrackRow`s; one `active playing`, one `explicit`, one `liked`.
- [ ] **Step 7: Gates + commit** `feat(ui): add track-list/track-row — numbered song rows`.

---

## Task 5: `lyrics`

**Files:** Create `registry/ui/lyrics.tsx`, example, test; modify `registry.json`.

- [ ] **Step 1: Failing test** — cases (mock `scrollIntoView`, jsdom lacks it):
  - renders one line per `lines` entry.
  - active line (by `activeIndex`) gets `data-active="true"` and `text-foreground`; others muted.
  - lines are buttons when `onLineClick` given; clicking line i fires `onLineClick(i)`.
  - when `onLineClick` omitted, lines are non-interactive `<p>` (no buttons).
  - changing `activeIndex` calls `scrollIntoView` on the active line.
  - reduced-motion: when matchMedia matches, `scrollIntoView` called with `behavior: "auto"`.
  - axe clean.

```tsx
beforeEach(() => {
  Element.prototype.scrollIntoView = vi.fn()
})
it("scrolls the active line into view when activeIndex changes", () => {
  const { rerender } = render(
    <Lyrics
      lines={[{ text: "a" }, { text: "b" }, { text: "c" }]}
      activeIndex={0}
    />,
  )
  rerender(
    <Lyrics
      lines={[{ text: "a" }, { text: "b" }, { text: "c" }]}
      activeIndex={2}
    />,
  )
  expect(Element.prototype.scrollIntoView).toHaveBeenCalled()
})
```

- [ ] **Step 2: Run — FAIL.**

- [ ] **Step 3: Write `registry/ui/lyrics.tsx`:**

```tsx
"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export type LyricLine = { time?: number; text: string }

export type LyricsProps = React.ComponentProps<"div"> & {
  lines: LyricLine[]
  activeIndex?: number
  onLineClick?: (index: number) => void
}

export function Lyrics({
  lines,
  activeIndex = -1,
  onLineClick,
  className,
  ...props
}: LyricsProps) {
  const activeRef = React.useRef<HTMLLIElement>(null)

  React.useEffect(() => {
    const el = activeRef.current
    if (!el) return
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    el.scrollIntoView({
      block: "center",
      behavior: reduced ? "auto" : "smooth",
    })
  }, [activeIndex])

  return (
    <div
      data-slot="lyrics"
      className={cn("scrollbar-thin max-h-80 overflow-y-auto", className)}
      {...props}
    >
      <ol className="flex flex-col gap-3 py-4">
        {lines.map((line, i) => {
          const active = i === activeIndex
          const content = (
            <span
              className={cn(
                "block text-2xl tracking-tight transition-colors motion-reduce:transition-none",
                active
                  ? "font-medium text-foreground"
                  : "text-muted-foreground",
              )}
            >
              {line.text}
            </span>
          )
          return (
            <li
              key={i}
              ref={active ? activeRef : undefined}
              data-slot="lyrics-line"
              data-active={active}
            >
              {onLineClick ? (
                <button
                  type="button"
                  onClick={() => onLineClick(i)}
                  className="block w-full text-left outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {content}
                </button>
              ) : (
                content
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
```

- [ ] **Step 4: Run — PASS.** _(Note: `scrollbar-thin` is a foundation utility.)_
- [ ] **Step 5: registry.json** (deps: foundation, utils).
- [ ] **Step 6: Example** — 6 lines, `activeIndex={2}`.
- [ ] **Step 7: Gates + commit** `feat(ui): add lyrics — synced scrolling lyric lines`.

---

## Task 6: `now-playing-bar`

**Files:** Create `registry/ui/now-playing-bar.tsx` (container + parts), example, test; modify `registry.json`.

- [ ] **Step 1: Failing test** — cases:
  - `NowPlayingBar` renders a `[data-slot="now-playing-bar"]` landmark (`role="region"` aria-label "Now playing").
  - `NowPlayingBarTrack` shows the album cover (img alt), title, artist.
  - `NowPlayingBarControls`: play button reflects `isPlaying` (label Play/Pause, `aria-pressed`); clicking fires `onPlayPause`; prev/next fire `onPrev`/`onNext`; shuffle/repeat toggle `aria-pressed` and fire callbacks.
  - `NowPlayingBarProgress` renders elapsed + duration (font-mono) and a slider; moving slider fires `onSeek`.
  - `NowPlayingBarExtras` renders a volume slider firing `onVolumeChange`.
  - axe clean on a fully composed bar.

Test interactions via Base UI slider: assert the `slider` role exists and `onSeek` wiring by simulating keyboard on the thumb (`ArrowRight`) — mirror existing slider-based component tests (e.g. `price-range-filter.test.tsx`). Read that test first for the exact slider interaction pattern in this repo.

- [ ] **Step 2: Run — FAIL.**

- [ ] **Step 3: Write `registry/ui/now-playing-bar.tsx`:**

```tsx
"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { AlbumCover } from "@/components/ui/album-cover"
import { Slider } from "@/components/ui/slider"

export type NowPlayingBarProps = React.ComponentProps<"div">

export function NowPlayingBar({
  className,
  children,
  ...props
}: NowPlayingBarProps) {
  return (
    <div
      data-slot="now-playing-bar"
      role="region"
      aria-label="Now playing"
      className={cn(
        "flex w-full items-center gap-4 border-t border-border bg-card px-4 py-3",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export type NowPlayingBarTrackProps = React.ComponentProps<"div"> & {
  src: string
  title: string
  artist?: string
  liked?: boolean
  onLikeToggle?: () => void
}

export function NowPlayingBarTrack({
  src,
  title,
  artist,
  liked,
  onLikeToggle,
  className,
  ...props
}: NowPlayingBarTrackProps) {
  return (
    <div
      data-slot="now-playing-bar-track"
      className={cn("flex min-w-0 flex-1 items-center gap-3", className)}
      {...props}
    >
      <AlbumCover src={src} alt={title} size="sm" rounded="md" />
      <span className="min-w-0">
        <span className="block truncate text-sm font-medium text-foreground">
          {title}
        </span>
        {artist ? (
          <span className="block truncate text-xs text-muted-foreground">
            {artist}
          </span>
        ) : null}
      </span>
      {onLikeToggle ? (
        <button
          type="button"
          aria-label={liked ? "Unlike" : "Like"}
          aria-pressed={liked}
          onClick={onLikeToggle}
          className={cn(
            "ml-1 outline-none focus-visible:ring-2 focus-visible:ring-ring",
            liked
              ? "text-brand"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <svg
            viewBox="0 0 24 24"
            fill={liked ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden
            className="size-4"
          >
            <path d="M12 21s-7-4.5-9.5-8.5C1 9 2.5 5.5 6 5.5c2 0 3.2 1.3 4 2.5.8-1.2 2-2.5 4-2.5 3.5 0 5 3.5 3.5 7C19 16.5 12 21 12 21z" />
          </svg>
        </button>
      ) : null}
    </div>
  )
}

const Icon = ({ d, className }: { d: string; className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden
    className={cn("size-4", className)}
  >
    <path d={d} />
  </svg>
)
const ICONS = {
  shuffle: "M17 3h4v4M21 3l-7 7M3 21l6-6M3 7h3l11 11h4M21 17v4h-4",
  prev: "M6 5v14M20 5L9 12l11 7z",
  next: "M18 5v14M4 5l11 7L4 19z",
  play: "M8 5v14l11-7z",
  pause: "M6 5h4v14H6zM14 5h4v14h-4z",
  repeat:
    "M17 1l4 4-4 4M3 11V9a4 4 0 014-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 01-4 4H3",
}

export type NowPlayingBarControlsProps = React.ComponentProps<"div"> & {
  isPlaying?: boolean
  shuffle?: boolean
  repeat?: boolean
  onPlayPause?: () => void
  onPrev?: () => void
  onNext?: () => void
  onShuffleToggle?: () => void
  onRepeatToggle?: () => void
}

export function NowPlayingBarControls({
  isPlaying = false,
  shuffle = false,
  repeat = false,
  onPlayPause,
  onPrev,
  onNext,
  onShuffleToggle,
  onRepeatToggle,
  className,
  ...props
}: NowPlayingBarControlsProps) {
  const ctrl =
    "flex items-center justify-center outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring rounded-full"
  const tone = (on?: boolean) =>
    on ? "text-brand" : "text-muted-foreground hover:text-foreground"
  return (
    <div
      data-slot="now-playing-bar-controls"
      className={cn("flex items-center gap-3", className)}
      {...props}
    >
      <button
        type="button"
        aria-label="Shuffle"
        aria-pressed={shuffle}
        onClick={onShuffleToggle}
        className={cn(ctrl, "size-7", tone(shuffle))}
      >
        <Icon d={ICONS.shuffle} />
      </button>
      <button
        type="button"
        aria-label="Previous"
        onClick={onPrev}
        className={cn(ctrl, "size-7", tone())}
      >
        <Icon d={ICONS.prev} />
      </button>
      <button
        type="button"
        aria-label={isPlaying ? "Pause" : "Play"}
        aria-pressed={isPlaying}
        onClick={onPlayPause}
        className={cn(
          ctrl,
          "size-9 bg-brand text-primary-foreground hover:scale-105",
        )}
      >
        <Icon d={isPlaying ? ICONS.pause : ICONS.play} className="size-5" />
      </button>
      <button
        type="button"
        aria-label="Next"
        onClick={onNext}
        className={cn(ctrl, "size-7", tone())}
      >
        <Icon d={ICONS.next} />
      </button>
      <button
        type="button"
        aria-label="Repeat"
        aria-pressed={repeat}
        onClick={onRepeatToggle}
        className={cn(ctrl, "size-7", tone(repeat))}
      >
        <Icon d={ICONS.repeat} />
      </button>
    </div>
  )
}

const fmt = (s: number) => {
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, "0")}`
}

export type NowPlayingBarProgressProps = Omit<
  React.ComponentProps<"div">,
  "onSeek"
> & {
  progress?: number // seconds
  duration?: number // seconds
  onSeek?: (seconds: number) => void
}

export function NowPlayingBarProgress({
  progress = 0,
  duration = 0,
  onSeek,
  className,
  ...props
}: NowPlayingBarProgressProps) {
  return (
    <div
      data-slot="now-playing-bar-progress"
      className={cn("flex flex-1 items-center gap-2", className)}
      {...props}
    >
      <span className="font-mono text-xs tabular-nums text-muted-foreground">
        {fmt(progress)}
      </span>
      <Slider
        aria-label="Seek"
        value={progress}
        min={0}
        max={duration || 1}
        onValueChange={(v) => onSeek?.(Array.isArray(v) ? v[0] : v)}
        className="flex-1"
      />
      <span className="font-mono text-xs tabular-nums text-muted-foreground">
        {fmt(duration)}
      </span>
    </div>
  )
}

export type NowPlayingBarExtrasProps = React.ComponentProps<"div"> & {
  volume?: number // 0–100
  onVolumeChange?: (volume: number) => void
}

export function NowPlayingBarExtras({
  volume = 100,
  onVolumeChange,
  className,
  children,
  ...props
}: NowPlayingBarExtrasProps) {
  return (
    <div
      data-slot="now-playing-bar-extras"
      className={cn("flex flex-1 items-center justify-end gap-3", className)}
      {...props}
    >
      {children}
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden
        className="size-4 text-muted-foreground"
      >
        <path d="M3 9v6h4l5 5V4L7 9H3z" />
      </svg>
      <Slider
        aria-label="Volume"
        value={volume}
        min={0}
        max={100}
        onValueChange={(v) => onVolumeChange?.(Array.isArray(v) ? v[0] : v)}
        className="w-24"
      />
    </div>
  )
}
```

- [ ] **Step 4: Run — PASS.** Adjust the slider test assertions to match the repo's slider testing pattern (read `tests/components/price-range-filter.test.tsx` first).
- [ ] **Step 5: registry.json** (deps: foundation, album-cover, slider, utils).
- [ ] **Step 6: Example** — fully composed bar with stateful `useState` for isPlaying/progress/volume.
- [ ] **Step 7: Gates + commit** `feat(ui): add now-playing-bar — sticky transport bar`.

---

## Task 7: `audio-player` (real playback)

**Files:** Create `registry/ui/audio-player.tsx`, example, test; modify `registry.json`. **Read `registry/ui/video-player.tsx` and `tests/components/video-player.test.tsx` first** and mirror structure/test setup exactly (media-chrome custom elements need the same jsdom handling).

- [ ] **Step 1: Failing test** mirroring video-player's: renders each part with its `data-slot`; variant classes (`default`/`minimal`/`card`) on the root via `data-variant`; control bar + buttons render; axe clean. Use the same media-chrome registration/teardown the video-player test uses.

- [ ] **Step 2: Run — FAIL.**

- [ ] **Step 3: Write `registry/ui/audio-player.tsx`** — same shape as `video-player.tsx`:
  - Reuse the identical `mediaVariables` token map (copy from video-player).
  - `audioPlayerVariants` cva with `default` (rounded-lg border bg-card shadow-sm), `minimal` (border-border/60), `card` (flex row, rounded-xl border bg-background p-2 gap-3).
  - `AudioPlayer` wraps `MediaController` (`data-slot="audio-player"`, `data-variant`, `style={mediaVariables}`); a `VariantContext` like video-player if needed (optional — variants here don't change child classes much, so context optional; keep parts simple).
  - `AudioPlayerContent` renders `<audio slot="media" data-slot="audio-player-content" {...props} />`.
  - Control parts: `AudioPlayerControlBar`, `AudioPlayerPlayButton`, `AudioPlayerSeekBackwardButton`, `AudioPlayerSeekForwardButton`, `AudioPlayerTimeRange`, `AudioPlayerTimeDisplay`, `AudioPlayerMuteButton`, `AudioPlayerVolumeRange` — each wraps the matching `media-chrome/react` element with a `data-slot` and `p-2.5` padding (mirror video-player part-for-part; `TimeDisplay` uses `font-mono text-sm tabular-nums`).

- [ ] **Step 4: Run — PASS.**
- [ ] **Step 5: registry.json** (`dependencies: ["media-chrome"]`; `registryDependencies`: foundation, utils). Description: "Token-mapped media-chrome `<audio>` player with composable control bar and default/minimal/card variants. Audio sibling of video-player."
- [ ] **Step 6: Example** mirroring video-player's example with an `<audio>` source (e.g. a sample `.mp3`).
- [ ] **Step 7: Gates + commit** `feat(ui): add audio-player — media-chrome audio player`.

---

## Task 8: `playlist-card` (composite)

**Files:** Create `registry/components/playlist-card.tsx`, example, test; modify `registry.json`.

- [ ] **Step 1: Failing test** — renders cover (img alt = title), title (`font-medium`), description (line-clamped); `onPlay` fires from the album-cover play button; optional `href` wraps in an anchor; axe clean.

- [ ] **Step 2: Run — FAIL.**

- [ ] **Step 3: Write `registry/components/playlist-card.tsx`:**

```tsx
"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { AlbumCover } from "@/components/ui/album-cover"

export type PlaylistCardProps = Omit<
  React.ComponentProps<"div">,
  "onPlay" | "title"
> & {
  src: string
  title: string
  description?: string
  playing?: boolean
  onPlay?: () => void
}

export function PlaylistCard({
  src,
  title,
  description,
  playing,
  onPlay,
  className,
  ...props
}: PlaylistCardProps) {
  return (
    <div
      data-slot="playlist-card"
      className={cn(
        "group/playlist-card flex w-full max-w-56 flex-col gap-3 rounded-lg bg-card p-3 transition-colors hover:bg-accent",
        className,
      )}
      {...props}
    >
      <AlbumCover
        src={src}
        alt={title}
        size="lg"
        rounded="md"
        shadow
        playing={playing}
        onPlay={onPlay}
        className="max-w-none"
      />
      <span className="min-w-0">
        <span className="block truncate text-sm font-medium text-foreground">
          {title}
        </span>
        {description ? (
          <span className="mt-0.5 block text-xs text-muted-foreground [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] overflow-hidden">
            {description}
          </span>
        ) : null}
      </span>
    </div>
  )
}
```

_(Decision: drop the optional `href` anchor wrap to keep router-free + simpler; the card surfaces `onPlay` via the cover. If a link is needed, consumers wrap the card. Update the test accordingly — no anchor case.)_

- [ ] **Step 4: Run — PASS.**
- [ ] **Step 5: registry.json** (`type: registry:component`, deps: foundation, album-cover, utils).
- [ ] **Step 6: Example** — a 3-card grid.
- [ ] **Step 7: Gates + commit** `feat(ui): add playlist-card — cover + title + description tile`.

---

## Task 9: `artist-header` (composite)

**Files:** Create `registry/components/artist-header.tsx`, example, test; modify `registry.json`.

- [ ] **Step 1: Failing test** — cases:
  - renders artist `name` and image (alt = name).
  - `verified` shows a "Verified Artist" badge; omitted → no badge.
  - `monthlyListeners` formats with separators (e.g. 1234567 → "1,234,567 monthly listeners") in `font-mono`.
  - Play button fires `onPlay`; reflects `isPlaying` (label Play/Pause).
  - Follow button fires `onFollowToggle`; label toggles "Follow"/"Following" by `isFollowing`.
  - axe clean.

- [ ] **Step 2: Run — FAIL.**

- [ ] **Step 3: Write `registry/components/artist-header.tsx`:**

```tsx
"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { AlbumCover } from "@/components/ui/album-cover"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export type ArtistHeaderProps = Omit<React.ComponentProps<"div">, "onPlay"> & {
  name: string
  image: string
  verified?: boolean
  monthlyListeners?: number
  isFollowing?: boolean
  isPlaying?: boolean
  onPlay?: () => void
  onFollowToggle?: () => void
}

const VerifiedGlyph = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="size-3">
    <path d="M12 2l2.4 1.7 2.9-.3 1.3 2.6 2.6 1.3-.3 2.9L22 12l-1.7 2.4.3 2.9-2.6 1.3-1.3 2.6-2.9-.3L12 22l-2.4-1.7-2.9.3-1.3-2.6L2.8 16.7l.3-2.9L2 12l1.1-2.4-.3-2.9 2.6-1.3L6.7 2.8l2.9.3L12 2zm-1 13l5-5-1.4-1.4L11 12.2 9.4 10.6 8 12l3 3z" />
  </svg>
)

export function ArtistHeader({
  name,
  image,
  verified,
  monthlyListeners,
  isFollowing = false,
  isPlaying = false,
  onPlay,
  onFollowToggle,
  className,
  ...props
}: ArtistHeaderProps) {
  const formatted =
    monthlyListeners != null
      ? new Intl.NumberFormat("en-US").format(monthlyListeners)
      : null
  return (
    <div
      data-slot="artist-header"
      className={cn("flex flex-col gap-6 sm:flex-row sm:items-end", className)}
      {...props}
    >
      <AlbumCover
        src={image}
        alt={name}
        size="lg"
        rounded="full"
        shadow
        className="shrink-0"
      />
      <div className="flex flex-col gap-3">
        {verified ? (
          <Badge variant="secondary" className="w-fit gap-1">
            <VerifiedGlyph /> Verified Artist
          </Badge>
        ) : null}
        <h1 className="text-5xl font-normal tracking-tight text-foreground">
          {name}
        </h1>
        {formatted ? (
          <p className="font-mono text-sm tabular-nums text-muted-foreground">
            {formatted} monthly listeners
          </p>
        ) : null}
        <div className="mt-1 flex items-center gap-3">
          <Button
            onClick={onPlay}
            aria-label={isPlaying ? "Pause" : "Play"}
            className="bg-brand text-primary-foreground hover:bg-brand/90"
          >
            {isPlaying ? "Pause" : "Play"}
          </Button>
          <Button
            variant="outline"
            aria-pressed={isFollowing}
            onClick={onFollowToggle}
          >
            {isFollowing ? "Following" : "Follow"}
          </Button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run — PASS.**
- [ ] **Step 5: registry.json** (`type: registry:component`, deps: foundation, album-cover, badge, button, utils).
- [ ] **Step 6: Example** — one artist header with verified + listeners.
- [ ] **Step 7: Gates + commit** `feat(ui): add artist-header — artist hero with stats`.

---

## Task 10: Final validation

- [ ] **Step 1:** `npm run update:registry` — green (manifest, examples, rule sync, build, built output).
- [ ] **Step 2:** `npm run test:ci` — green (check:tests + full suite + coverage thresholds: statements ≥ 99%, branches ≥ 96%, functions = 100%, lines ≥ 99%). If any branch is under, add the missing-branch test (common gaps: reduced-motion path, `onPlay`-omitted path, `explicit`/`liked` off states, slider array-vs-scalar value branch).
- [ ] **Step 3:** `npm run build` — typecheck green.
- [ ] **Step 4:** Review the full diff; confirm every component is token-only (grep for hex/rgb/named colors in the new files), every part has `data-slot`, every interactive control is labeled.
- [ ] **Step 5:** Final commit if anything was touched in validation; the set is ready for PR.

---

## Self-review notes (planner)

- **Spec coverage:** all 9 components have a task (1–9); the controlled model holds (only audio-player uses media-chrome); reduced-motion covered in equalizer-bars (Task 1) + lyrics (Task 5) + waveform (CSS). ✔
- **Type consistency:** `EqualizerBars`, `AlbumCover` (`onPlay`/`playing`), `TrackRow` (`onPlay`/`onLikeToggle`), `now-playing-bar` part names, `audio-player` part names mirror video-player. `AlbumCover` used by track? No — track-row uses `EqualizerBars` directly; now-playing-bar/playlist-card/artist-header use `AlbumCover`. ✔
- **Scope cut made explicit:** `playlist-card` drops the optional `href` (router-free); track/queue reordering out of scope. ✔
- **Known coverage risks flagged** in Task 10 Step 2.
- **Read-before-mirror gates:** Task 6 (price-range-filter slider test), Task 7 (video-player + its test). ✔

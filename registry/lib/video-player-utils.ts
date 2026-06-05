/**
 * Pure, DOM-free helpers for the byronwade/ui video player. The "intelligent"
 * behaviors — resume/watch-memory, the extra keymap, tap gestures, chapters→VTT,
 * heatmap math, ambient sync — live here as plain functions so the player's
 * component file stays a thin wiring layer and this logic is exhaustively
 * testable. Nothing here touches the DOM or React.
 */

/** A normalized intent the player applies to its media element. */
export type MediaAction =
  | { type: "toggle-play" }
  | { type: "seek-by"; delta: number }
  | { type: "seek-to-fraction"; fraction: number }
  | { type: "rate-step"; dir: 1 | -1 }
  | { type: "toggle-pip" }

/** Persisted, per-source playback preferences. */
export type PlaybackState = {
  time: number
  volume?: number
  rate?: number
  muted?: boolean
  captions?: boolean
}

/** Minimal Storage surface so callers can inject a test double. */
export type StorageLike = {
  getItem: (key: string) => string | null
  setItem: (key: string, value: string) => void
  removeItem: (key: string) => void
}

const STORAGE_PREFIX = "byronwade-ui:video-player:"
const CHAPTER_TAIL = 1
const SEEK_STEP = 10
const RESUME_FLOOR = 5
const RESUME_CEILING = 0.95
const AMBIENT_DRIFT = 0.3

const pad = (value: number, size = 2) => String(value).padStart(size, "0")

/** Format seconds as a WebVTT timestamp (`HH:MM:SS.mmm`). Negatives clamp to 0. */
export const formatVttTime = (seconds: number): string => {
  const total = Math.max(0, seconds)
  const hrs = Math.floor(total / 3600)
  const mins = Math.floor((total % 3600) / 60)
  const secs = Math.floor(total % 60)
  const ms = Math.round((total - Math.floor(total)) * 1000)
  return `${pad(hrs)}:${pad(mins)}:${pad(secs)}.${pad(ms, 3)}`
}

export type Chapter = { startTime: number; title: string }

/**
 * Serialize chapters into a WebVTT chapters track. Each cue ends at the next
 * chapter's start; the final cue ends at `duration` (or a 1s tail when unknown
 * or non-increasing). The component turns the result into a `<track>` blob.
 */
export const chaptersToVtt = (chapters: Chapter[], duration?: number): string => {
  if (chapters.length === 0) return "WEBVTT\n"
  const sorted = [...chapters].sort((a, b) => a.startTime - b.startTime)
  const lines = ["WEBVTT", ""]
  sorted.forEach((chapter, index) => {
    const start = chapter.startTime
    const next = sorted[index + 1]
    let end = next ? next.startTime : (duration ?? start + CHAPTER_TAIL)
    if (end <= start) end = start + CHAPTER_TAIL
    lines.push(`${formatVttTime(start)} --> ${formatVttTime(end)}`)
    lines.push(chapter.title)
    lines.push("")
  })
  return lines.join("\n")
}

/** Scale "most-replayed" values to 0..1 relative to the max (negatives clamp to 0). */
export const normalizeHeatmap = (values: number[]): number[] => {
  if (values.length === 0) return []
  const clamped = values.map((value) => Math.max(0, value))
  const max = Math.max(...clamped)
  if (max === 0) return clamped.map(() => 0)
  return clamped.map((value) => value / max)
}

/** Namespace a caller's resume key for localStorage. */
export const resumeStorageKey = (resumeKey: string): string =>
  `${STORAGE_PREFIX}${resumeKey}`

/** Read saved playback state; returns null on missing/malformed/absent storage. */
export const readPlaybackState = (
  storage: StorageLike | null | undefined,
  key: string,
): PlaybackState | null => {
  if (!storage) return null
  try {
    const raw = storage.getItem(key)
    if (!raw) return null
    const parsed = JSON.parse(raw) as PlaybackState
    if (typeof parsed?.time !== "number") return null
    return parsed
  } catch {
    return null
  }
}

/** Persist playback state; silently no-ops on absent or throwing storage. */
export const writePlaybackState = (
  storage: StorageLike | null | undefined,
  key: string,
  state: PlaybackState,
): void => {
  if (!storage) return
  try {
    storage.setItem(key, JSON.stringify(state))
  } catch {
    // Quota/private-mode failures are non-fatal — playback continues.
  }
}

/** Remove saved playback state; silently no-ops on absent or throwing storage. */
export const clearPlaybackState = (
  storage: StorageLike | null | undefined,
  key: string,
): void => {
  if (!storage) return
  try {
    storage.removeItem(key)
  } catch {
    // Non-fatal.
  }
}

/**
 * Whether to restore a saved position: past a small floor and before the
 * near-end ceiling (skipped only when a duration is known).
 */
export const shouldResume = (
  time: number,
  duration: number,
  opts: { floor?: number; ceilingRatio?: number } = {},
): boolean => {
  const floor = opts.floor ?? RESUME_FLOOR
  const ceilingRatio = opts.ceilingRatio ?? RESUME_CEILING
  if (time <= floor) return false
  if (duration > 0 && time >= duration * ceilingRatio) return false
  return true
}

type EditableTarget = { tagName?: string; isContentEditable?: boolean } | null

/** Whether an event target is a text field we should not hijack keystrokes from. */
export const isEditableTarget = (target: EditableTarget): boolean => {
  if (!target) return false
  if (target.isContentEditable) return true
  const tag = target.tagName?.toUpperCase()
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT"
}

type KeyEventLike = {
  key: string
  shiftKey?: boolean
  target?: EditableTarget
}

/**
 * Map a keyboard event to the *extra* actions layered on top of media-chrome's
 * native hotkeys (j/l, 0-9, < >, i). Returns null for keys media-chrome already
 * owns (space/k/f/m/c/arrows) or when typing in a field — never double-handle.
 */
export const resolveMediaKey = (event: KeyEventLike): MediaAction | null => {
  if (isEditableTarget(event.target ?? null)) return null
  const key = event.key
  const lower = key.length === 1 ? key.toLowerCase() : key
  if (lower === "j") return { type: "seek-by", delta: -SEEK_STEP }
  if (lower === "l") return { type: "seek-by", delta: SEEK_STEP }
  if (lower === "i") return { type: "toggle-pip" }
  if (key >= "0" && key <= "9")
    return { type: "seek-to-fraction", fraction: Number(key) / 10 }
  if (key === "<" || (key === "," && event.shiftKey))
    return { type: "rate-step", dir: -1 }
  if (key === ">" || (key === "." && event.shiftKey))
    return { type: "rate-step", dir: 1 }
  return null
}

/** Map a tap zone + tap count to a gesture action (double-tap seek, tap play). */
export const resolveGesture = (
  zone: "left" | "center" | "right",
  taps: number,
): MediaAction | null => {
  if (taps >= 2) {
    if (zone === "left") return { type: "seek-by", delta: -SEEK_STEP }
    if (zone === "right") return { type: "seek-by", delta: SEEK_STEP }
    return null
  }
  if (taps === 1 && zone === "center") return { type: "toggle-play" }
  return null
}

/** Whether the ambient mirror has drifted far enough to resync to the primary. */
export const shouldSyncAmbient = (
  primaryTime: number,
  mirrorTime: number,
  threshold = AMBIENT_DRIFT,
): boolean => Math.abs(primaryTime - mirrorTime) > threshold

/** YouTube's playback-rate ladder. */
export const PLAYBACK_RATES = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2] as const

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)

/** The slice of HTMLMediaElement an action needs — keeps the helper testable. */
type MediaLike = {
  paused: boolean
  currentTime: number
  duration: number
  playbackRate: number
  play: () => void
  pause: () => void
  requestPictureInPicture?: () => Promise<unknown>
}

/**
 * Apply a resolved {@link MediaAction} to a media element. Lives beside the pure
 * helpers (not in the component) so each branch — seek clamping, the rate
 * ladder, the PiP toggle — is unit-testable against a plain object.
 */
export const applyMediaAction = (media: MediaLike, action: MediaAction): void => {
  switch (action.type) {
    case "toggle-play": {
      if (media.paused) media.play()
      else media.pause()
      return
    }
    case "seek-by": {
      const max = Number.isFinite(media.duration) ? media.duration : Infinity
      media.currentTime = clamp(media.currentTime + action.delta, 0, max)
      return
    }
    case "seek-to-fraction": {
      if (Number.isFinite(media.duration))
        media.currentTime = action.fraction * media.duration
      return
    }
    case "rate-step": {
      const nearest = PLAYBACK_RATES.reduce((best, rate) =>
        Math.abs(rate - media.playbackRate) < Math.abs(best - media.playbackRate)
          ? rate
          : best,
      )
      const index = PLAYBACK_RATES.indexOf(nearest)
      const next = clamp(index + action.dir, 0, PLAYBACK_RATES.length - 1)
      media.playbackRate = PLAYBACK_RATES[next]
      return
    }
    case "toggle-pip": {
      const doc = typeof document === "undefined" ? null : document
      if (doc?.pictureInPictureElement) {
        void doc.exitPictureInPicture?.()
      } else {
        void media.requestPictureInPicture?.()
      }
      return
    }
  }
}

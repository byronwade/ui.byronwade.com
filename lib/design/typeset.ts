/**
 * Closed typeset presets — shadcn/typeset rhythm, Meridian-frozen values.
 *
 * Agents pick a preset. They do not invent size / leading / flow.
 * CSS lives in app/typeset.css.
 */

export const typesetPresets = [
  "docs",
  "chat",
  "reading",
  "compact",
] as const

export type TypesetPreset = (typeof typesetPresets)[number]

/** Rhythm for each preset — mirrored in app/typeset.css. */
export const typesetRhythm = {
  docs: {
    label: "Docs",
    job: "Help, skills, system markdown",
    size: "1.0625rem",
    leading: 1.65,
    flow: "1.15em",
    measure: "65ch",
  },
  chat: {
    label: "Chat",
    job: "Agent / streaming message bodies",
    size: "0.875rem",
    leading: 1.5,
    flow: "0.85em",
    measure: "56ch",
  },
  reading: {
    label: "Reading",
    job: "Essays, long-form prose",
    size: "1.125rem",
    leading: 1.75,
    flow: "1.5em",
    measure: "65ch",
  },
  compact: {
    label: "Compact",
    job: "In-app help drawers, dense copy",
    size: "0.875rem",
    leading: 1.45,
    flow: "0.75em",
    measure: "60ch",
  },
} as const satisfies Record<
  TypesetPreset,
  {
    label: string
    job: string
    size: string
    leading: number
    flow: string
    measure: string
  }
>

export const typesetLaws = {
  /** shadcn/typeset — three controls only. */
  rhythmControls: ["size", "leading", "flow"] as const,
  /** Streaming-stable spacing direction. */
  spacing: "margin-block-start" as const,
  /** Opt-out class. */
  optOut: "not-typeset" as const,
  /** Display weight stays medium-max inside typeset headings. */
  headingWeight: "medium" as const,
  /** Measure owned by typeset preset, hard cap 80ch. */
  measureCap: "80ch" as const,
  /** Do not restyle per-element in ReactMarkdown — use typeset. */
  noPerElementTypeSoup: true,
} as const

/** Class string for a frozen typeset preset. */
export function typesetClass(preset: TypesetPreset = "docs") {
  return `typeset typeset-${preset}`
}

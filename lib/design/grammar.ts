/**
 * Meridian cinematic design grammar — closed, typed, non-negotiable.
 *
 * Research basis (AI drift):
 * - Freeze a closed token set the model picks from (not invents)
 * - TypeScript unions fail at compile time on fabrication
 * - Creativity lives in composition + content, not in new colors/radii
 *
 * Agents import from `@/lib/design`. Anything outside these unions is drift.
 */

import { banIds } from "@/lib/design/bans.mjs"

/** Semantic color roles — map to CSS vars / Tailwind tokens only. */
export const colorRoles = [
  "background",
  "foreground",
  "card",
  "popover",
  "primary",
  "secondary",
  "muted",
  "accent",
  "destructive",
  "warning",
  "success",
  "brand",
  "brand-muted",
  "border",
  "input",
  "ring",
  "dock",
  "dock-muted",
  "sidebar",
] as const

export type ColorRole = (typeof colorRoles)[number]

/** Agent activity — fixed meaning, never a brand substitute. */
export const activityRoles = [
  "thinking",
  "search",
  "read",
  "edit",
] as const

export type ActivityRole = (typeof activityRoles)[number]

/** Provenance for object-bound AI. */
export const provenanceRoles = [
  "user",
  "assistant",
  "tool",
  "source",
  "app",
  "action",
] as const

export type ProvenanceRole = (typeof provenanceRoles)[number]

/** Surface lanes — density by task. */
export const surfaces = [
  "application",
  "marketing",
  "mobile",
  "desktop",
] as const

export type SurfaceId = (typeof surfaces)[number]

/** Shape vocabulary — control / panel / shell / pill only. */
export const radii = [
  "rounded-lg",
  "rounded-2xl",
  "rounded-3xl",
  "rounded-full",
] as const

export type RadiusToken = (typeof radii)[number]

/** Depth — Polaris-compatible house utilities only. */
export const depths = [
  "edge",
  "depth-none",
  "depth-soft",
  "depth-raised",
] as const

export type DepthToken = (typeof depths)[number]

/** Type roles — hierarchy from size + tracking, not bold display. */
export const typeRoles = [
  "display",
  "title",
  "body",
  "label",
  "data",
  "reading-ui",
  "reading-prose",
] as const

export type TypeRole = (typeof typeRoles)[number]

/** Control heights — closed density scale. */
export const controlHeights = [
  "xs",
  "sm",
  "md",
  "lg",
  "touch",
  "default",
] as const

export type ControlHeight = (typeof controlHeights)[number]

/** Cinema stage tone. */
export const cinemaTones = ["paper", "theater"] as const

export type CinemaTone = (typeof cinemaTones)[number]

/** What may own a cinematic frame. */
export const cinemaSubjects = [
  "product",
  "workbench",
  "copy",
  "media",
] as const

export type CinemaSubject = (typeof cinemaSubjects)[number]

/** Theme knobs AIs may re-skin (CSS variables). */
export const themeKnobs = [
  "--brand",
  "--brand-foreground",
  "--brand-muted",
  "--background",
  "--foreground",
  "--radius",
] as const

export type ThemeKnob = (typeof themeKnobs)[number]

/**
 * Banned patterns — the vocabulary agents and reviewers share.
 *
 * Names come from `lib/design/bans.mjs`, which also holds the enforcement
 * patterns read by `check:design`, the MCP `validate_ui` tool, and the
 * generated contract JSON. One list, one enforcement, no drift.
 */
export const banned = banIds as readonly string[]

export type BannedPattern = string

/**
 * Radius intent → allowed token.
 * Fluent 2 analogue: controlCornerRadius vs layerCornerRadius.
 * Never use control radii outside the closed set (lg / 2xl / 3xl / full).
 */
export const radiusFor = {
  /** Buttons, inputs, menu rows, nav items — Fluent Medium/Large. */
  control: "rounded-lg",
  /** Cards, panes, popovers — Fluent layer / X-Large. */
  panel: "rounded-2xl",
  /** Hero shells, modal/sheet frames. */
  shell: "rounded-3xl",
  pill: "rounded-full",
} as const satisfies Record<string, RadiusToken>

/** Depth intent → allowed token (Fluent elevation ramp, Polaris-shaped). */
export const depthFor = {
  /** Default chrome — thin stroke, no drop shadow. */
  default: "edge",
  flat: "depth-none",
  float: "depth-soft",
  overlay: "depth-raised",
} as const satisfies Record<string, DepthToken>

/**
 * Stroke intent — Fluent thin (1px) default; thick reserved for focus affordance.
 * Implemented via `edge` / `border` / `ring-ring`, not ad-hoc widths.
 */
export const strokeFor = {
  thin: "edge",
  focus: "ring-ring",
} as const

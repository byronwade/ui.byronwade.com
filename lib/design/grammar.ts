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
 * Banned patterns — shortest list, highest leverage against drift.
 * Enforced by `npm run check:design` + agent rules.
 */
export const banned = [
  "raw-hex-color",
  "arbitrary-color-utility",
  "non-oklch-color",
  "tailwind-shadow",
  "dvh-viewport",
  "font-bold-display",
  "scroll-choreography",
  "overlay-stickers-on-media",
  "pure-white",
  "pure-black",
  "bright-neon-accent",
  "cream-terracotta-cliche",
  "second-accent",
  "influence-brand-labels",
  "floating-chatbot",
  "nested-demo-scrollports",
  "inset-hero-media",
  "low-contrast-on-dock",
  "foreground-opacity-cheat",
] as const

export type BannedPattern = (typeof banned)[number]

/** Radius intent → allowed token. */
export const radiusFor = {
  control: "rounded-lg",
  panel: "rounded-2xl",
  shell: "rounded-3xl",
  pill: "rounded-full",
} as const satisfies Record<string, RadiusToken>

/** Depth intent → allowed token. */
export const depthFor = {
  default: "edge",
  flat: "depth-none",
  float: "depth-soft",
  overlay: "depth-raised",
} as const satisfies Record<string, DepthToken>

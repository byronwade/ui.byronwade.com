import type {
  CinemaSubject,
  CinemaTone,
  DepthToken,
  ProvenanceRole,
  RadiusToken,
  SurfaceId,
} from "@/lib/design/grammar"

/**
 * Frozen vs creative — the core AI model.
 *
 * FROZEN (typed + linted): color, radius, depth, surface, cinema laws, bans
 * CREATIVE (encouraged): copy, IA, domain objects, frame sequence, which
 * wholes to compose from shadcn, narrative pacing within one-idea frames
 */

export const zones = {
  frozen: [
    "colorRoles",
    "radii",
    "depths",
    "surfaces",
    "themeKnobs",
    "activityRoles",
    "banned",
    "cinematicLaws",
  ],
  creative: [
    "copy",
    "informationArchitecture",
    "domainObjects",
    "frameSequence",
    "whichShadcnPrimitives",
    "narrativeWithinOneIdea",
  ],
} as const

/** Cinematic design list — Meridian’s aesthetic contract. */
export const cinematicLaws = {
  /** Product / workbench / photograph owns the frame — chrome recedes. */
  productIsSubject: true,
  /** Exactly one idea per viewport stage. */
  oneIdeaPerFrame: true as const,
  /** Media is full-bleed edge-to-edge — never inset hero cards. */
  fullBleedMedia: true,
  /** No badges/stickers floating on media. */
  noOverlayStickers: true,
  /** Soft warm neutrals; never pure white or pure black. */
  softNeutrals: true,
  /** One deep accent — prominent, not bright/neon. */
  oneAccent: true,
  /** Stable viewport units — never dvh (mobile chrome jerk). */
  viewport: "svh" as const,
  /** Styling without spectacle — no scroll-jacking films. */
  motion: "micro-only" as const,
  /** Alternating paper ↔ theater creates rhythm without borders. */
  tileAlternation: true,
  /** Hierarchy from size + tracking — never bold display weight. */
  typeWeight: "medium-max" as const,
  /** Reading uses structured lanes — reading-ui / reading-prose. */
  structuredReading: true,
  /** Colors are strict OKLCH; contrast audited (WCAG AA). */
  oklchOnly: true,
  /** Accessibility + contrast are mandatory on every UI change. */
  auditContrast: true,
} as const

/**
 * Typed cinematic frame — agents compose sequences creatively,
 * but each frame must satisfy this shape.
 */
export type CinemaFrame = {
  tone: CinemaTone
  subject: CinemaSubject
  /** Literal 1 — TypeScript enforces one idea. */
  ideas: 1
  overlayStickers: false
  fullBleed?: boolean
  depth?: DepthToken
  radius?: RadiusToken
}

/** Validated helper — rejects illegal frames at the type level. */
export function defineCinemaFrame<T extends CinemaFrame>(frame: T): T {
  return frame
}

/** Application workbench recipe — density + object-bound AI. */
export type WorkbenchRecipe = {
  surface: Extract<SurfaceId, "application" | "desktop">
  chrome: "quiet"
  selected: "bg-brand/10"
  dataType: "mono"
  agent?: {
    boundTo: string
    provenance: ProvenanceRole[]
  }
}

export function defineWorkbench<T extends WorkbenchRecipe>(recipe: T): T {
  return recipe
}

/** Canonical proofs shipped in-repo. */
export const proofs = {
  workbench: defineWorkbench({
    surface: "application",
    chrome: "quiet",
    selected: "bg-brand/10",
    dataType: "mono",
    agent: {
      boundTo: "ISS-1842",
      provenance: ["user", "assistant", "tool"],
    },
  }),
  hero: defineCinemaFrame({
    tone: "theater",
    subject: "workbench",
    ideas: 1,
    overlayStickers: false,
    fullBleed: true,
    depth: "edge",
  }),
  themeTile: defineCinemaFrame({
    tone: "paper",
    subject: "copy",
    ideas: 1,
    overlayStickers: false,
  }),
} as const

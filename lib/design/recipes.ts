import type {
  ActivityRole,
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
    "materialLaws",
    "designInfluences",
    "shellRhythm",
    "shellLaws",
    "controlScale",
    "spaceScale",
    "brandPresets",
    "radiusPresets",
    "paperPresets",
    "interactiveProofStates",
    "laneLaws",
    "motionLaws",
    "typesetPresets",
    "typesetLaws",
    "typesetRhythm",
  ],
  creative: [
    "copy",
    "informationArchitecture",
    "domainObjects",
    "frameSequence",
    "whichShadcnPrimitives",
    "whichTypesetPreset",
    "narrativeWithinOneIdea",
    "whichInteractiveProof",
  ],
} as const

/** Required / optional states for live app proofs. */
export const interactiveProofStates = [
  "idle",
  "selected",
  "ask",
  "empty",
] as const

export type InteractiveProofState = (typeof interactiveProofStates)[number]

export const interactiveInteractions = [
  "select",
  "search",
  "ask",
  "navigate",
  "switch-lane",
] as const

export type InteractiveInteraction = (typeof interactiveInteractions)[number]

/**
 * Interactive proof recipe — marketing that behaves like product chrome.
 * Agents compose proofs from this shape instead of inventing demo UX.
 */
export type InteractiveProof = {
  id: string
  surface: SurfaceId
  /** Must include idle + selected for application/desktop proofs. */
  states: readonly InteractiveProofState[]
  interactions: readonly InteractiveInteraction[]
  agent?: {
    boundTo: string
    /** Activity legend is mandatory when agent is present. */
    activityLegend: true
    activities: readonly ActivityRole[]
    provenance: readonly ProvenanceRole[]
  }
  /** Live knobs allowed on this proof (theme playground). */
  knobs?: readonly ("brand" | "radius" | "paper")[]
}

export function defineInteractiveProof<T extends InteractiveProof>(
  proof: T,
): T {
  if (
    (proof.surface === "application" || proof.surface === "desktop") &&
    (!proof.states.includes("idle") || !proof.states.includes("selected"))
  ) {
    throw new Error(
      `defineInteractiveProof(${proof.id}): application/desktop proofs need idle + selected`,
    )
  }
  if (proof.agent && proof.agent.activityLegend !== true) {
    throw new Error(
      `defineInteractiveProof(${proof.id}): agent proofs require activityLegend: true`,
    )
  }
  return proof
}

/**
 * Lane laws — marketing vs application contracts (linted).
 * Absorb structure from Cursor/Framer research; reject brand pastiche.
 */
export const laneLaws = {
  application: {
    allow: [
      "quiet-dense-chrome",
      "object-bound-ai",
      "shell-rhythm",
      "selected-brand-wash",
      "activity-pastels-scoped",
    ],
    forbid: [
      "gradient-spotlight-cards",
      "marketing-collage",
      "second-accent-fill",
      "spectacle-hero",
    ],
  },
  marketing: {
    allow: [
      "theater-stage",
      "scarce-brand-cta",
      "cinema-one-idea",
      "product-as-subject",
    ],
    forbid: [
      "floating-chatbot",
      "overlay-stickers",
      "scroll-choreography",
      "pure-black-canvas",
    ],
  },
} as const

/** Micro motion only — Fluent functional + Polaris press. */
export const motionLaws = {
  pressMs: 120,
  selectMs: 160,
  railInMs: 700,
  reducedMotionRespect: true,
  noScrollChoreography: true,
} as const

/**
 * Influences we absorb into closed laws — never paste brand chrome,
 * never ship FluentUI / Cursor kits, never label influences in UI.
 */
export const designInfluences = {
  fluent2: {
    source: "https://fluent2.microsoft.design/",
    absorb: [
      "global-alias-tokens",
      "neutral-hierarchy",
      "brand-sparingly",
      "semantic-status",
      "control-vs-layer-radius",
      "thin-stroke",
      "elevation-ramp",
      "density-unit",
      "rest-hover-selected",
    ],
    reject: [
      "fluentui-packages",
      "windows-purple-chrome",
      "influence-labels-in-ui",
    ],
  },
  cursorApplication: {
    absorb: [
      "quiet-dense-chrome",
      "object-bound-ai",
      "mono-metadata",
      "composer-shaped-proofs",
    ],
    reject: ["cursor-com-marketing", "spectacle-hero-collage"],
  },
} as const

/**
 * Material laws — Fluent 2 shape/stroke/elevation expressed in Meridian tokens.
 */
export const materialLaws = {
  controlRadiusSeparateFromLayer: true,
  strokeBeforeShadow: true,
  depthOnlyWhenFloated: true,
  neutralStack: true,
  fourPxGrid: true,
  focusIsStrokeNotFill: true,
  dataIsMono: true,
  aiObjectBound: true,
  selectedBrandWash: "bg-brand/10" as const,
} as const

/** Cinematic design list — Meridian’s aesthetic contract. */
export const cinematicLaws = {
  /** Product / workbench / photograph owns the frame — chrome recedes. */
  productIsSubject: true,
  /** Fluent stroke/radius + Cursor density — quiet operational subject. */
  fluentMaterialWithCursorDensity: true,
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
  /** Reading uses shadcn/typeset presets — docs / chat / reading / compact. */
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
  interactiveWorkbench: defineInteractiveProof({
    id: "workbench",
    surface: "application",
    states: ["idle", "selected", "ask", "empty"],
    interactions: ["select", "search", "ask", "navigate"],
    agent: {
      boundTo: "ISS-1842",
      activityLegend: true,
      activities: ["thinking", "search", "read", "edit"],
      provenance: ["user", "assistant", "tool"],
    },
    knobs: ["brand", "radius", "paper"],
  }),
  interactiveComposer: defineInteractiveProof({
    id: "composer",
    surface: "desktop",
    states: ["idle", "selected", "ask"],
    interactions: ["select", "ask", "navigate"],
    agent: {
      boundTo: "IssueRow.tsx",
      activityLegend: true,
      activities: ["thinking", "search", "read", "edit"],
      provenance: ["user", "assistant", "tool"],
    },
  }),
  interactiveStudio: defineInteractiveProof({
    id: "surface-studio",
    surface: "application",
    states: ["idle", "selected"],
    interactions: ["switch-lane", "select", "ask"],
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

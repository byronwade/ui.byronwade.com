/**
 * UX + DX — twin pillars of Meridian.
 *
 * Visual grammar (color/radius/cinema) is necessary but not sufficient.
 * Operator experience and agent/developer experience are first-class frozen laws.
 *
 * Sources encoded (discipline, not pastiche):
 * - NN/g 10 usability heuristics
 * - Polaris Pro (meaning, density, juicy, predictable)
 * - Vercel Design Engineer / progressive disclosure of complexity
 * - Pandya / Superdesign (closed tokens + audit for LLMs)
 * - Addy Osmani (Always / Ask / Never agent specs)
 * - Linear (quiet chrome, content hierarchy)
 */

/** Required product UI states — every index/detail must own these. */
export const requiredUiStates = [
  "rest",
  "hover",
  "pressed",
  "selected",
  "focusVisible",
  "disabled",
  "loading",
  "empty",
  "error",
] as const

export type RequiredUiState = (typeof requiredUiStates)[number]

/** Frozen UX laws — operator experience. */
export const uxLaws = {
  /** Twin pillar with DX — not secondary to cinema. */
  pillar: true,
  /** Every control finishes a task (Vercel usefulness). */
  usefulnessFirst: true,
  /** Color / icon / depth encode role, never decoration (Polaris). */
  assignMeaning: true,
  /** Same look → same behavior (Polaris predictable). */
  predictableThenJuicy: true,
  /** Quiet chrome, loud content (Linear). */
  quietChromeLoudContent: true,
  /** Progressive disclosure — complexity available, not required. */
  progressiveDisclosure: true,
  /** NN/g #1 — visible status for async + agent work. */
  visibilityOfStatus: true,
  /** NN/g #3 — undo / escape / non-destructive defaults. */
  userControlAndFreedom: true,
  /** NN/g #5 + #9 — prevent errors; recover with specific copy + retry. */
  errorPreventionAndRecovery: true,
  /** NN/g #6 — show options; don't force recall of IDs/shortcuts alone. */
  recognitionOverRecall: true,
  /** Indexes dense; detail breathes (Polaris density-by-task). */
  densityFollowsTask: true,
  /** Object-bound AI; outcome first, trace one click away (Nielsen agents). */
  agentOutcomeThenTrace: true,
  /** Mandatory states on every resource surface. */
  requiredStates: requiredUiStates,
  /** Empty = one sentence + one action; error = specific + retry. */
  emptyAndErrorOwned: true,
  /** Keyboard path exists; focus = ring, not fill alone. */
  keyboardParity: true,
} as const

/**
 * DX load tiers for agents — Addy Osmani Always / Ask / Never pattern.
 * Mapped onto Meridian contracts.
 */
export const dxLoadTiers = {
  always: [
    "docs/north-star.md",
    "design.md",
    "lib/design (import structure)",
    "typeset + shell presets",
    "check:* gates before done",
  ],
  ask: [
    "docs/ux.md / docs/dx.md when shaping interaction or APIs",
    "docs/influences.md when absorbing a new craft source",
    "skills/meridian-* for task workflows",
    "surface proofs when validating product chrome",
  ],
  never: [
    "Invent tokens, radii, depths, type scales",
    "Fork twin shadcn primitives or grow a shell zoo",
    "Skip empty/loading/error states",
    "Ship without check:design + check:contrast (+ shell/typeset/proofs/experience)",
    "Floating chatbot / overlay stickers / raw hex",
  ],
} as const

/** Frozen DX laws — human developers + AI agents as consumers. */
export const dxLaws = {
  /** Twin pillar with UX. */
  pillar: true,
  /** Progressive disclosure of complexity — defaults sane, depth optional. */
  progressiveComplexity: true,
  /** Closed semantic token API — pick, don't invent (Pandya). */
  closedTokenApi: true,
  /** One grammar imported by UI + lint — docs ≠ code ≠ components. */
  singleSourceGrammar: true,
  /** Self-verification — agents must run gates and report. */
  selfVerification: true,
  /** Always / Ask / Never load tiers. */
  loadTiers: true,
  /** Shortest happy path — compose shadcn + typesetClass + data-surface. */
  goldenPathMinimal: true,
  /** Version contracts like an API — breaking frozen unions needs migration note. */
  versionLikeApi: true,
  /** Prefer a rule / preset over a new component. */
  rulesOverWidgets: true,
  /** Proofs validate; they are not the install surface. */
  proofsAreValidationOnly: true,
  /** Machine endpoints (?raw=1 / Accept markdown) for agent consumption. */
  machineReadableContracts: true,
} as const

/** Interaction state visual contract (Fluent + Polaris). */
export const interactionStateRecipe = {
  rest: "neutral surface, no brand border",
  hover: "bg-muted/30–40",
  pressed: "stronger muted + micro motion-press",
  selected: "bg-brand/10",
  focusVisible: "ring-ring / thicker stroke",
  disabled: "reduced opacity + pointer-events-none",
  danger: "bg-destructive/10 + destructive text",
  loading: "skeleton or quiet mono — no layout jump",
  empty: "one sentence + one action",
  error: "specific message + retry",
} as const

/**
 * Frozen Tailwind class bundles for interaction physics.
 * Prefer these over inventing hover/focus/selected strings.
 */
export const interactionClasses = {
  hoverQuiet: "hover:bg-muted/30",
  hoverQuietStrong: "hover:bg-muted/40",
  selected: "bg-brand/10 data-[state=selected]:bg-brand/10",
  focusRing:
    "outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
  focusWash: "outline-none focus-visible:bg-brand/10",
  press: "motion-press",
  selectMotion: "motion-select",
  disabled: "disabled:pointer-events-none disabled:opacity-50",
  danger: "bg-destructive/10 text-destructive",
  row:
    "motion-select outline-none hover:bg-muted/30 focus-visible:bg-brand/10 data-[state=selected]:bg-brand/10",
  control:
    "motion-press outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50",
} as const

export type ExperienceLaws = {
  ux: typeof uxLaws
  dx: typeof dxLaws
}

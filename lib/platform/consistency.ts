/**
 * Lightweight consistency kit — what open-source MCP servers exist to deliver.
 *
 * Agents: this is the law. Call get_contract before UI work. Call validate_ui
 * before you claim done. Do not invent tokens, shadows, icons barrels, or shells.
 */

/** Imperative rules every tool response reminds agents to obey. */
export const agentMandate = {
  purpose:
    "Keep application UI consistent across the product. Creativity is content + composition — never new tokens, shadows, or twin components. Law book + skills + CI gates are required; contract MCP is optional.",
  beforeUi: [
    "Load this contract's design.md + agents.md and obey must / mustNot",
    "Open the matching {id}-* skill before composing product wholes",
    "Resolve colors/radii/depths from the closed kit only (MCP resolve_token optional)",
    "Compose only approved primitives — never fork Button/Card/shell twins",
    "Pick a task recipe when the surface matches (list, detail, agent-rail, …)",
  ],
  beforeDone: [
    "Run npm run validate (check:design · platform · contrast) before claiming done",
    "Optional: run MCP validate_ui on snippets when tool-wired",
    "Own empty, loading, and error on resource surfaces",
    "Selected rows/items use bg-brand/10 — not a new border color",
    "Icons only from @/lib/icons (Phosphor) — never lucide-react",
    "Depth only via edge / depth-* — never Tailwind shadow-*",
  ],
  must: [
    "OKLCH semantic tokens only (bg-background, text-foreground, bg-brand, …)",
    "One accent → --brand (selected = bg-brand/10)",
    "Closed radii: control rounded-lg · pill rounded-full · input rounded-lg · panel rounded-2xl · shell rounded-3xl",
    "data-surface for density (application | marketing | mobile | desktop)",
    "Object-bound AI with outcome-then-trace disclosure",
    "typeset presets for markdown/HTML — no per-tag class soup",
    "Same machine filenames + recipe ids on every design contract",
    "Reuse existing primitives/recipes before inventing new components",
  ],
  mustNot: [
    "Invent hex / rgb / hsl / arbitrary color utilities",
    "Use Tailwind shadow-* (use edge / depth-*)",
    "Import lucide-react or @phosphor-icons/react directly",
    "Add a second brand accent or status-as-brand",
    "Ship font-bold on display/section headings",
    "Invent twin components or bespoke app shells",
    "Fork MCP tools / filenames / JSON keys for one contract only",
    "Demo-only happy paths without empty/loading/error",
    "Skip CI gates because an MCP tool was called",
  ],
} as const

/** Closed radius intents — agents resolve these, they do not invent px radii. */
export const radiusIntents = {
  /** Buttons, inputs, menu rows — matches live shadcn controls. */
  control: "rounded-lg",
  pill: "rounded-full",
  input: "rounded-lg",
  panel: "rounded-2xl",
  shell: "rounded-3xl",
} as const

/** Closed depth intents. */
export const depthIntents = [
  "depth-none",
  "depth-soft",
  "depth-raised",
  "depth-100",
  "depth-300",
  "depth-400",
  "depth-600",
] as const

/** Approved shadcn atoms to compose. */
export const approvedPrimitives = [
  "button",
  "input",
  "textarea",
  "select",
  "checkbox",
  "switch",
  "table",
  "card",
  "dialog",
  "sheet",
  "tabs",
  "tooltip",
  "dropdown-menu",
  "sonner",
  "separator",
  "badge",
] as const

/** Short ban ids mirrored for MCP validate_ui messaging. */
export const consistencyBans = [
  "hex-color",
  "rgb-hsl-literal",
  "tailwind-shadow",
  "font-bold-display",
  "lucide-import",
  "phosphor-direct-import",
  "arbitrary-color-utility",
  "second-accent",
] as const

/** Primitive → project install mapping for agents composing into apps. */
export const primitiveInstallMap = approvedPrimitives.map((id) => ({
  id,
  importPath: `@/components/ui/${id}`,
  shadcn: `npx shadcn@latest add ${id}`,
}))

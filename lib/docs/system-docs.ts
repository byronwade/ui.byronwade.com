/**
 * Research / merge specs under docs/ — detailed influence synthesis.
 * Served at /meridian/system and /meridian/system/[slug]; raw via …/raw
 */

export type SystemDocSlug =
  | "north-star"
  | "platform"
  | "pricing"
  | "ux"
  | "dx"
  | "prefs"
  | "stack"
  | "influences"
  | "absorb"
  | "meridian"
  | "sources"
  | "layout"
  | "architecture"
  | "animations"
  | "color"
  | "typography"
  | "density"
  | "ai-surfaces"

export type SystemDoc = {
  slug: SystemDocSlug
  title: string
  summary: string
  sourcePath: `docs/${string}.md`
  filename: string
}

export const systemDocs: readonly SystemDoc[] = [
  {
    slug: "north-star",
    title: "North star",
    summary: "AI design contract — UX + DX pillars, not a shell zoo.",
    sourcePath: "docs/north-star.md",
    filename: "north-star.md",
  },
  {
    slug: "platform",
    title: "Platform",
    summary:
      "Shared architecture for every design contract — MCP, filenames, JSON keys.",
    sourcePath: "docs/platform.md",
    filename: "platform.md",
  },
  {
    slug: "pricing",
    title: "Pricing",
    summary: "Why MCP is open source — COGS research and cost-plus decision.",
    sourcePath: "docs/pricing.md",
    filename: "pricing.md",
  },
  {
    slug: "ux",
    title: "UX",
    summary: "Operator experience — states, heuristics, disclosure, empty/error.",
    sourcePath: "docs/ux.md",
    filename: "ux.md",
  },
  {
    slug: "dx",
    title: "DX",
    summary: "Developer + agent experience — golden path, load tiers, gates.",
    sourcePath: "docs/dx.md",
    filename: "dx.md",
  },
  {
    slug: "prefs",
    title: "Closed prefs",
    summary:
      "Brand · radius · paper tweaks via apply_prefs — not layout/animation freeform.",
    sourcePath: "docs/prefs.md",
    filename: "prefs.md",
  },
  {
    slug: "stack",
    title: "Agent stack",
    summary:
      "MCP · markdown · skills — why we ship all three and lead with MCP.",
    sourcePath: "docs/stack.md",
    filename: "stack.md",
  },
  {
    slug: "influences",
    title: "Influences",
    summary: "Ranked inspirations and merge matrix.",
    sourcePath: "docs/influences.md",
    filename: "influences.md",
  },
  {
    slug: "absorb",
    title: "Absorb checklist",
    summary: "Take / leave / encode before influence-driven UI.",
    sourcePath: "docs/absorb.md",
    filename: "absorb.md",
  },
  {
    slug: "meridian",
    title: "Meridian DNA",
    summary: "Human-readable design DNA — principles and surfaces.",
    sourcePath: "docs/meridian.md",
    filename: "meridian.md",
  },
  {
    slug: "sources",
    title: "Sources",
    summary: "What we absorb from published craft — discipline, not pastiche.",
    sourcePath: "docs/sources.md",
    filename: "sources.md",
  },
  {
    slug: "layout",
    title: "Layout",
    summary: "4px grid, shells, breakpoints, pane anatomy.",
    sourcePath: "docs/layout.md",
    filename: "layout.md",
  },
  {
    slug: "architecture",
    title: "Architecture",
    summary: "Layers, pipeline, frozen vs creative, extension.",
    sourcePath: "docs/architecture.md",
    filename: "architecture.md",
  },
  {
    slug: "animations",
    title: "Animations",
    summary: "Fluent motion ramp, micro-only, reduced motion.",
    sourcePath: "docs/animations.md",
    filename: "animations.md",
  },
  {
    slug: "color",
    title: "Color",
    summary: "OKLCH roles, brand sparingly, contrast.",
    sourcePath: "docs/color.md",
    filename: "color.md",
  },
  {
    slug: "typography",
    title: "Typography",
    summary: "Roles, mono data, typeset presets.",
    sourcePath: "docs/typography.md",
    filename: "typography.md",
  },
  {
    slug: "density",
    title: "Density",
    summary: "Task density, control heights, surfaces.",
    sourcePath: "docs/density.md",
    filename: "density.md",
  },
  {
    slug: "ai-surfaces",
    title: "AI surfaces",
    summary: "Object-bound AI, provenance, activity.",
    sourcePath: "docs/ai-surfaces.md",
    filename: "ai-surfaces.md",
  },
] as const

export function getSystemDoc(slug: string): SystemDoc | undefined {
  return systemDocs.find((d) => d.slug === slug)
}

export function requireSystemDoc(slug: string): SystemDoc {
  const doc = getSystemDoc(slug)
  if (!doc) throw new Error(`Unknown system doc: ${slug}`)
  return doc
}

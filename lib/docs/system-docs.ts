/**
 * Research / merge specs under docs/ — detailed influence synthesis.
 * Served at /system and /system/[slug]; raw via /system/[slug].md
 */

export type SystemDocSlug =
  | "influences"
  | "meridian"
  | "sources"
  | "layout"
  | "architecture"
  | "ux"
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
    slug: "influences",
    title: "Influences",
    summary: "Ranked inspirations and merge matrix.",
    sourcePath: "docs/influences.md",
    filename: "influences.md",
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
    slug: "ux",
    title: "UX",
    summary: "States, keyboard, disclosure, empty/error.",
    sourcePath: "docs/ux.md",
    filename: "ux.md",
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
    summary: "Roles, mono data, reading lanes.",
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

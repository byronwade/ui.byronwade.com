import type { ComponentDoc, Variant } from "@/content/components"

export type DemoSurface = "app" | "marketing"
export type DemoViewport = "desktop" | "tablet" | "mobile"

export type DemoContext = {
  surface: DemoSurface
  viewport: DemoViewport
}

export const demoViewportWidths: Record<DemoViewport, number | null> = {
  desktop: null,
  tablet: 834,
  mobile: 390,
}

const SURFACE_TAG = /^surface:(app|marketing)$/
const VIEWPORT_TAG = /^viewport:(desktop|tablet|mobile)$/

export function parseDemoSurface(value: unknown): DemoSurface {
  return value === "marketing" ? "marketing" : "app"
}

export function parseDemoViewport(value: unknown): DemoViewport {
  if (value === "tablet" || value === "mobile") return value
  return "desktop"
}

export function parseDemoContextParams(
  params: Record<string, string | string[] | undefined>,
): DemoContext {
  const surfaceRaw = Array.isArray(params.surface)
    ? params.surface[0]
    : params.surface
  const viewportRaw = Array.isArray(params.viewport)
    ? params.viewport[0]
    : params.viewport
  return {
    surface: parseDemoSurface(surfaceRaw),
    viewport: parseDemoViewport(viewportRaw),
  }
}

export type DemoExampleResolution = {
  example: string
  fallbackLevel: 1 | 2 | 3 | 4 | 5
}

function tagSurface(tags: string[]): DemoSurface | null {
  for (const t of tags) {
    const m = t.match(SURFACE_TAG)
    if (m) return m[1] as DemoSurface
  }
  return null
}

function tagViewport(tags: string[]): DemoViewport | null {
  for (const t of tags) {
    const m = t.match(VIEWPORT_TAG)
    if (m) return m[1] as DemoViewport
  }
  return null
}

function matchesContext(
  variant: Variant,
  ctx: DemoContext,
  level: 1 | 2 | 3,
): boolean {
  const s = tagSurface(variant.tags)
  const v = tagViewport(variant.tags)
  if (level === 1) return s === ctx.surface && v === ctx.viewport
  if (level === 2) return s === ctx.surface && v == null
  return v === ctx.viewport && s == null
}

export function resolveDemoExample(
  doc: ComponentDoc,
  activeVariant: Variant,
  ctx: DemoContext,
  allVariants: Variant[],
): DemoExampleResolution {
  const pool = allVariants.length > 0 ? allVariants : [activeVariant]

  for (const level of [1, 2, 3] as const) {
    const hit = pool.find((v) => matchesContext(v, ctx, level))
    if (hit) return { example: hit.example, fallbackLevel: level }
  }

  if (activeVariant.example) {
    return { example: activeVariant.example, fallbackLevel: 4 }
  }

  const first = doc.examples[0] ?? "default"
  return {
    example:
      first
        .replace(/\.tsx$/, "")
        .split("/")
        .pop() ?? "default",
    fallbackLevel: 5,
  }
}

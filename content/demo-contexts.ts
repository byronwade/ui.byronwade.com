import type { ComponentDoc, Variant } from "@/content/components"

export type DemoSurface = "app" | "marketing"
export type DemoViewport = "desktop" | "tablet" | "mobile"
export type DemoDensity = "compact" | "default" | "comfortable"
export type DemoFrame = "default" | "inset"
export type DemoDepth = "none" | "soft" | "raised"
export type DemoState = "default" | "loading" | "empty" | "success" | "error"

export type DemoContext = {
  surface: DemoSurface
  viewport: DemoViewport
  density: DemoDensity
  frame: DemoFrame
  depth: DemoDepth
  state: DemoState
}

export const demoViewportWidths: Record<DemoViewport, number | null> = {
  desktop: null,
  tablet: 834,
  mobile: 390,
}

const SURFACE_TAG = /^surface:(app|marketing)$/
const VIEWPORT_TAG = /^viewport:(desktop|tablet|mobile)$/
const DENSITY_TAG = /^density:(compact|default|comfortable)$/
const FRAME_TAG = /^frame:(default|inset)$/
const CONTEXT_EXAMPLE_NAMES = new Set([
  "compact",
  "inset",
  "compact-inset",
  "comfortable",
  "comfortable-inset",
])

export function parseDemoSurface(value: unknown): DemoSurface {
  return value === "marketing" ? "marketing" : "app"
}

export function parseDemoViewport(value: unknown): DemoViewport {
  if (value === "tablet" || value === "mobile") return value
  return "desktop"
}

export function parseDemoDensity(value: unknown): DemoDensity {
  if (value === "compact" || value === "comfortable") return value
  return "default"
}

export function parseDemoFrame(value: unknown): DemoFrame {
  return value === "inset" ? "inset" : "default"
}

export function parseDemoDepth(value: unknown): DemoDepth {
  if (value === "soft" || value === "raised") return value
  return "none"
}

export function parseDemoState(value: unknown): DemoState {
  if (
    value === "loading" ||
    value === "empty" ||
    value === "success" ||
    value === "error"
  )
    return value
  return "default"
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
  const densityRaw = Array.isArray(params.density)
    ? params.density[0]
    : params.density
  const frameRaw = Array.isArray(params.frame) ? params.frame[0] : params.frame
  const depthRaw = Array.isArray(params.depth) ? params.depth[0] : params.depth
  const stateRaw = Array.isArray(params.state) ? params.state[0] : params.state
  return {
    surface: parseDemoSurface(surfaceRaw),
    viewport: parseDemoViewport(viewportRaw),
    density: parseDemoDensity(densityRaw),
    frame: parseDemoFrame(frameRaw),
    depth: parseDemoDepth(depthRaw),
    state: parseDemoState(stateRaw),
  }
}

export type DemoExampleResolution = {
  example: string
  fallbackLevel: 1 | 2 | 3 | 4 | 5
}

export function isDemoContextExample(example: string) {
  return CONTEXT_EXAMPLE_NAMES.has(example)
}

function normalizeExampleName(example: string) {
  return (
    example
      .replace(/\.tsx$/, "")
      .split("/")
      .pop() ?? example
  )
}

function contextExampleCandidates(ctx: DemoContext) {
  if (ctx.density === "default" && ctx.frame === "default") return ["default"]
  if (ctx.density === "default" && ctx.frame === "inset") return ["inset"]
  if (ctx.density === "compact" && ctx.frame === "default") return ["compact"]
  if (ctx.density === "compact" && ctx.frame === "inset")
    return ["compact-inset", "compact", "inset"]
  if (ctx.density === "comfortable" && ctx.frame === "default")
    return ["comfortable"]
  return ["comfortable-inset", "comfortable", "inset"]
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

function tagDensity(tags: string[]): DemoDensity | null {
  for (const t of tags) {
    const m = t.match(DENSITY_TAG)
    if (m) return m[1] as DemoDensity
  }
  return null
}

function tagFrame(tags: string[]): DemoFrame | null {
  for (const t of tags) {
    const m = t.match(FRAME_TAG)
    if (m) return m[1] as DemoFrame
  }
  return null
}

function contextRank(variant: Variant, ctx: DemoContext): number {
  const s = tagSurface(variant.tags)
  const v = tagViewport(variant.tags)
  const d = tagDensity(variant.tags)
  const f = tagFrame(variant.tags)

  if (s != null && s !== ctx.surface) return 0
  if (v != null && v !== ctx.viewport) return 0
  if (d != null && d !== ctx.density) return 0
  if (f != null && f !== ctx.frame) return 0

  let rank = 0
  if (s != null) rank += 40
  if (v != null) rank += 30
  if (d != null) rank += 20
  if (f != null) rank += 10
  return rank
}

function fallbackLevelForRank(rank: number): 1 | 2 | 3 {
  if (rank >= 60) return 1
  if (rank >= 40) return 2
  return 3
}

export function resolveDemoExample(
  doc: ComponentDoc,
  activeVariant: Variant,
  ctx: DemoContext,
  allVariants: Variant[],
): DemoExampleResolution {
  const examples = new Set(doc.examples.map(normalizeExampleName))
  const activeExample = normalizeExampleName(activeVariant.example)
  const canResolveContext =
    activeExample === "default" || isDemoContextExample(activeExample)

  if (canResolveContext) {
    for (const candidate of contextExampleCandidates(ctx)) {
      if (candidate !== activeExample && examples.has(candidate)) {
        return { example: candidate, fallbackLevel: 1 }
      }
    }
  }

  const pool = allVariants.length > 0 ? allVariants : [activeVariant]

  let best: { variant: Variant; rank: number } | null = null
  for (const variant of pool) {
    const rank = contextRank(variant, ctx)
    if (rank === 0) continue
    if (best == null || rank > best.rank) best = { variant, rank }
  }

  if (best != null) {
    return {
      example: best.variant.example,
      fallbackLevel: fallbackLevelForRank(best.rank),
    }
  }

  if (activeVariant.example) {
    return { example: activeVariant.example, fallbackLevel: 4 }
  }

  const first = doc.examples[0] ?? "default"
  return {
    example: normalizeExampleName(first),
    fallbackLevel: 5,
  }
}

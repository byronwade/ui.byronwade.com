import { describe, it, expect } from "vitest"
import {
  demoViewportWidths,
  parseDemoContextParams,
  resolveDemoExample,
  type DemoContext,
} from "@/content/demo-contexts"
import type { ComponentDoc, Variant } from "@/content/components"

const doc = {
  slug: "video-card",
  name: "Video card",
  category: "Video",
  description: "",
  examples: ["default"],
} as ComponentDoc

const variants: Variant[] = [
  { id: "default", name: "Default", tags: [], example: "default" },
  {
    id: "marketing-mobile",
    name: "Marketing mobile",
    tags: ["surface:marketing", "viewport:mobile"],
    example: "marketing-mobile",
  },
  {
    id: "app-only",
    name: "App",
    tags: ["surface:app"],
    example: "app",
  },
]

describe("demoViewportWidths", () => {
  it("matches template gallery widths", () => {
    expect(demoViewportWidths.tablet).toBe(834)
    expect(demoViewportWidths.mobile).toBe(390)
    expect(demoViewportWidths.desktop).toBeNull()
  })
})

describe("parseDemoContextParams", () => {
  it("defaults to app + desktop", () => {
    expect(parseDemoContextParams({})).toEqual({
      surface: "app",
      viewport: "desktop",
    })
  })

  it("parses valid params", () => {
    expect(
      parseDemoContextParams({ surface: "marketing", viewport: "mobile" }),
    ).toEqual({ surface: "marketing", viewport: "mobile" })
  })

  it("ignores invalid values", () => {
    expect(
      parseDemoContextParams({ surface: "bogus", viewport: "tablet" }),
    ).toEqual({ surface: "app", viewport: "tablet" })
  })
})

describe("resolveDemoExample", () => {
  const ctx = (
    surface: DemoContext["surface"],
    viewport: DemoContext["viewport"],
  ) => ({ surface, viewport })

  it("prefers exact surface + viewport match", () => {
    const r = resolveDemoExample(
      doc,
      variants[0],
      ctx("marketing", "mobile"),
      variants,
    )
    expect(r.example).toBe("marketing-mobile")
    expect(r.fallbackLevel).toBe(1)
  })

  it("falls back to surface-only match", () => {
    const r = resolveDemoExample(
      doc,
      variants[0],
      ctx("app", "mobile"),
      variants,
    )
    expect(r.example).toBe("app")
    expect(r.fallbackLevel).toBe(2)
  })

  it("falls back to default variant", () => {
    const r = resolveDemoExample(
      doc,
      variants[0],
      ctx("marketing", "desktop"),
      variants,
    )
    expect(r.example).toBe("default")
    expect(r.fallbackLevel).toBe(4)
  })
})

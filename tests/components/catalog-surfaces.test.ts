import { describe, expect, it } from "vitest"

import { bySlug } from "@/content/components"
import {
  getArchetypeSurface,
  getSurface,
  getTemplateSurface,
  surfaceCounts,
} from "@/content/catalog-surfaces"
import { archetypes } from "@/app/layouts/_archetypes"
import { templates } from "@/app/templates/_templates"

describe("catalog-surfaces", () => {
  it("routes media/video/commerce/market categories to marketing", () => {
    expect(getSurface(bySlug("video-card")!)).toBe("marketing")
    expect(getSurface(bySlug("album-cover")!)).toBe("marketing")
    expect(getSurface(bySlug("candlestick-chart")!)).toBe("marketing")
  })

  it("routes hero, marketing layout, and motion/device slugs to marketing", () => {
    expect(getSurface(bySlug("hero-section")!)).toBe("marketing")
    expect(getSurface(bySlug("marketing-layout")!)).toBe("marketing")
    expect(getSurface(bySlug("description-box")!)).toBe("marketing")
    expect(getSurface(bySlug("world-map")!)).toBe("marketing")
    expect(getSurface(bySlug("floating-dock")!)).toBe("marketing")
    expect(getSurface(bySlug("kinetic-text")!)).toBe("marketing")
  })

  it("routes typical app primitives to application", () => {
    expect(getSurface(bySlug("button")!)).toBe("app")
    expect(getSurface(bySlug("app-shell")!)).toBe("app")
    expect(getSurface(bySlug("table")!)).toBe("app")
  })

  it("keeps marketing share honest — Market is not Application", () => {
    const counts = surfaceCounts()
    // App-only doctrine: marketing lane must include Market + Media/Video/Commerce.
    expect(counts.marketing).toBeGreaterThan(60)
    expect(counts.app).toBeLessThan(counts.total - 60)
  })

  it("maps templates and archetypes by category", () => {
    expect(getTemplateSurface(templates[0])).toBe("marketing")
    expect(getTemplateSurface(templates[1])).toBe("app")
    expect(getArchetypeSurface(archetypes.find((a) => a.slug === "studio")!)).toBe(
      "marketing",
    )
    expect(getArchetypeSurface(archetypes.find((a) => a.slug === "cockpit")!)).toBe(
      "app",
    )
  })

  it("reports non-zero counts for both surfaces", () => {
    const counts = surfaceCounts()
    expect(counts.app).toBeGreaterThan(0)
    expect(counts.marketing).toBeGreaterThan(0)
    expect(counts.total).toBe(counts.app + counts.marketing)
  })
})

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
  it("routes media/video/commerce categories to marketing", () => {
    expect(getSurface(bySlug("video-card")!)).toBe("marketing")
    expect(getSurface(bySlug("album-cover")!)).toBe("marketing")
  })

  it("routes hero and marketing layout slugs to marketing", () => {
    expect(getSurface(bySlug("hero-section")!)).toBe("marketing")
    expect(getSurface(bySlug("marketing-layout")!)).toBe("marketing")
    expect(getSurface(bySlug("description-box")!)).toBe("marketing")
  })

  it("routes typical app primitives to application", () => {
    expect(getSurface(bySlug("button")!)).toBe("app")
    expect(getSurface(bySlug("app-shell")!)).toBe("app")
    expect(getSurface(bySlug("table")!)).toBe("app")
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

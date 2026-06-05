import { describe, it, expect } from "vitest"
import { searchIndex } from "@/content/search-index"
import { bySlug, getVariants } from "@/content/components"

describe("search index — variants", () => {
  it("indexes every authored button variant with a deep-link anchor", () => {
    const button = bySlug("button")!
    for (const v of getVariants(button)) {
      const href = `/docs/button#${v.id}`
      const hit = searchIndex.find((e) => e.href === href)
      expect(hit, `missing search entry for ${v.id}`).toBeTruthy()
      expect(hit!.label).toContain(v.name)
    }
  })

  it("variant entries are Component-kind (palette renders them unchanged)", () => {
    const hits = searchIndex.filter((e) => e.href.includes("/docs/button#"))
    expect(hits.length).toBeGreaterThanOrEqual(18)
    for (const h of hits) expect(h.kind).toBe("Component")
  })

  it("does not emit variant entries for un-authored components", () => {
    const synthetic = searchIndex.filter((e) =>
      /\/docs\/[^#]+#default$/.test(e.href),
    )
    expect(synthetic).toHaveLength(0)
  })
})

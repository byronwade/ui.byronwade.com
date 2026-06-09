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
    // Components whose ONLY variant is the synthetic default (no authored variants array).
    // Search-index only emits entries from c.variants ?? [], so a #default entry is only
    // present if the component has an authored variant with id "default". We therefore
    // verify that every #default entry in the index corresponds to a component that
    // explicitly authored that variant — i.e. its variants array contains { id: "default" }.
    const defaultEntries = searchIndex.filter((e) =>
      /\/docs\/[^#]+#default$/.test(e.href),
    )
    for (const entry of defaultEntries) {
      // Derive slug from href: /docs/<slug>#default
      const slug = entry.href.replace(/^\/docs\//, "").replace(/#default$/, "")
      const doc = bySlug(slug)
      // The component must exist and must have an authored variants array containing "default"
      expect(doc, `no component found for slug "${slug}"`).toBeTruthy()
      const authoredVariants = doc!.variants ?? []
      const hasAuthoredDefault = authoredVariants.some(
        (v) => v.id === "default",
      )
      expect(
        hasAuthoredDefault,
        `search entry ${entry.href} appears to be synthetic — "${slug}" has no authored variant with id "default"`,
      ).toBe(true)
    }
  })
})

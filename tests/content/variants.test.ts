import { describe, it, expect } from "vitest"
import {
  components,
  getVariants,
  type ComponentDoc,
} from "@/content/components"

describe("getVariants", () => {
  it("synthesizes a single default variant when none are authored", () => {
    const doc = {
      slug: "x",
      name: "X",
      category: "UI",
      description: "",
      examples: [],
    } as ComponentDoc
    const v = getVariants(doc)
    expect(v).toHaveLength(1)
    expect(v[0]).toMatchObject({ id: "default", name: "X", example: "default" })
    expect(v[0].tags).toEqual([])
  })

  it("carries the doc's type-level tags onto the synthetic default", () => {
    const doc = {
      slug: "y",
      name: "Y",
      category: "UI",
      description: "",
      examples: [],
      tags: ["a", "b"],
    } as ComponentDoc
    expect(getVariants(doc)[0].tags).toEqual(["a", "b"])
  })

  it("every catalog component yields ≥1 variant with a kebab-case id", () => {
    for (const c of components) {
      const v = getVariants(c)
      expect(v.length).toBeGreaterThan(0)
      for (const variant of v)
        expect(variant.id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
    }
  })

  it("does not author toolbar-controlled density or frame variants", () => {
    for (const component of components) {
      for (const variant of component.variants ?? []) {
        for (const tag of variant.tags) {
          expect(tag, `${component.slug}/${variant.id}`).not.toMatch(
            /^(density|frame):/,
          )
        }
      }
    }
  })

  it("keeps resource list variants focused on feature states", () => {
    const resourceList = components.find(
      (component) => component.slug === "resource-list",
    )!
    expect(resourceList.variants?.map((variant) => variant.id)).toEqual([
      "default",
      "selectable",
      "with-actions",
      "empty",
      "loading",
    ])
  })
})

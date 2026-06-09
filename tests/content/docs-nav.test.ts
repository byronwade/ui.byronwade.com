import { describe, expect, it } from "vitest"

import {
  buildCategoryNav,
  collectDocsNavLinks,
  flattenCategoryNav,
  getFamilyRoot,
  isDocsNavFamily,
  validateDocsNav,
} from "@/content/docs-nav"

describe("buildCategoryNav", () => {
  it("groups index-table and resource-list under table in Data display", () => {
    const entries = buildCategoryNav("Data display", "app")
    const table = entries.find(
      (entry) => entry.kind === "family" && entry.slug === "table",
    )

    expect(table).toBeDefined()
    expect(isDocsNavFamily(table!)).toBe(true)
    if (!table || !isDocsNavFamily(table)) return

    expect(table.children.map((child) => child.slug)).toEqual([
      "table",
      "index-table",
      "resource-list",
    ])
  })

  it("keeps standalone components as leaves", () => {
    const entries = buildCategoryNav("Data display", "app")
    const pagination = entries.find(
      (entry) => entry.kind === "leaf" && entry.slug === "pagination",
    )
    expect(pagination).toBeDefined()
  })

  it("flattens families without losing slugs", () => {
    const entries = buildCategoryNav("Data display", "app")
    const slugs = flattenCategoryNav(entries).map((leaf) => leaf.slug)
    expect(slugs).toContain("table")
    expect(slugs).toContain("index-table")
    expect(slugs).toContain("resource-list")
    expect(slugs).toContain("pagination")
  })
})

describe("collectDocsNavLinks", () => {
  it("tags table family members with a family group label", () => {
    const links = collectDocsNavLinks()
    const indexTable = links.find((link) => link.slug === "index-table")
    expect(indexTable?.group).toContain("Table")
    expect(indexTable?.group).toContain("Data display")
  })
})

describe("getFamilyRoot", () => {
  it("returns the parent doc for nested nav items", () => {
    expect(getFamilyRoot("index-table")?.slug).toBe("table")
    expect(getFamilyRoot("table")).toBeUndefined()
  })
})

describe("validateDocsNav", () => {
  it("passes for the current component catalog", () => {
    expect(validateDocsNav()).toEqual([])
  })
})

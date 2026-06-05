import { describe, it, expect } from "vitest"
import { existsSync } from "node:fs"
import { join } from "node:path"
import { bySlug, getVariants } from "@/content/components"

const button = bySlug("button")!

describe("button variants (schema proving ground)", () => {
  it("authors at least 18 variants", () => {
    expect(button.variants?.length ?? 0).toBeGreaterThanOrEqual(18)
  })

  it("variant ids are unique and kebab-case", () => {
    const ids = getVariants(button).map((v) => v.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const id of ids) expect(id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
  })

  it("every variant carries at least one tag", () => {
    for (const v of getVariants(button))
      expect(v.tags.length).toBeGreaterThan(0)
  })

  it("every variant.example resolves to a real example file", () => {
    for (const v of getVariants(button)) {
      const file = join(
        process.cwd(),
        "content/examples/button",
        `${v.example}.tsx`,
      )
      expect(existsSync(file), `missing button/${v.example}.tsx`).toBe(true)
    }
  })
})

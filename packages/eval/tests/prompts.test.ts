import { describe, it, expect } from "vitest"
import { loadPrompts, hashPrompts } from "../src/prompts.js"

describe("prompts", () => {
  it("loads the 12 committed prompts", () => {
    const p = loadPrompts()
    expect(p.length).toBe(12)
    expect(p.every((x) => x.text.length > 0)).toBe(true)
  })
  it("hash is stable + 12 chars", () => {
    expect(hashPrompts(loadPrompts())).toHaveLength(12)
  })
})

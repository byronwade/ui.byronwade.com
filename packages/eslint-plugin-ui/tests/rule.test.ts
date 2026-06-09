import { detect } from "@byronwade/on-system-core"
import { describe, expect, it } from "vitest"
import { onSystem } from "../src/rule.js"

describe("on-system eslint rule", () => {
  it("exports rule metadata", () => {
    expect(onSystem.meta?.type).toBe("problem")
    expect(onSystem.meta?.fixable).toBe("code")
  })

  it("accepts token classes via on-system-core", () => {
    expect(detect(`const x = <div className="bg-brand p-4" />;`)).toHaveLength(
      0,
    )
  })

  it("flags raw color utilities via on-system-core", () => {
    const violations = detect(`const x = <div className="text-[#16a34a]" />;`)
    expect(violations.some((v) => v.detector === "raw-color")).toBe(true)
    expect(violations[0]?.fix?.text).toContain("text-brand")
  })
})

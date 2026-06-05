import { describe, it, expect } from "vitest"
import { gradeGeneration } from "../src/grade.js"

describe("gradeGeneration", () => {
  it("passes clean on-system code", () => {
    const g = gradeGeneration(
      `const x = <div className="bg-brand text-foreground p-4" />;`,
    )
    expect(g.pass).toBe(true)
    expect(g.violations).toBe(0)
  })
  it("fails code with a raw color and counts it", () => {
    const g = gradeGeneration(`const x = <div className="text-[#16a34a]" />;`)
    expect(g.pass).toBe(false)
    expect(g.violations).toBeGreaterThan(0)
    expect(g.byDetector["raw-color"]).toBeGreaterThan(0)
  })
  it("counts a native element as off-system (all-5-strict)", () => {
    const g = gradeGeneration(`const x = <button>go</button>;`)
    expect(g.pass).toBe(false)
    expect(g.byDetector["off-system-component"]).toBeGreaterThan(0)
  })
  it("returns no-code reason for null", () => {
    const g = gradeGeneration(null)
    expect(g.pass).toBe(false)
    expect(g.reason).toBe("no-code")
  })
  it("returns parse-error reason for invalid tsx", () => {
    const g = gradeGeneration(`const x = <div className=`)
    expect(g.pass).toBe(false)
    expect(g.reason).toBe("parse-error")
  })
})

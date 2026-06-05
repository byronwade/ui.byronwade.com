import { describe, it, expect } from "vitest"
import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { join, dirname } from "node:path"
import { detect } from "../src/detect.js"
import { applyFixes } from "../src/apply-fixes.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const read = (p: string) => readFileSync(join(__dirname, p), "utf8")

describe("fixtures", () => {
  it("on-system fixture produces zero violations", () => {
    expect(detect(read("fixtures/on-system/clean.tsx"))).toEqual([])
  })
  it("off-system fixture produces violations across detectors", () => {
    const v = detect(read("fixtures/off-system/colors.tsx"))
    const kinds = new Set(v.map((x) => x.detector))
    expect(kinds).toContain("raw-color")
    expect(kinds).toContain("arbitrary-value")
    expect(kinds).toContain("hand-rolled")
    expect(kinds).toContain("off-system-component")
    expect(kinds).toContain("typography")
  })
  it("autofix output has no error-severity color/arbitrary violations left", () => {
    const code = read("fixtures/off-system/colors.tsx")
    const fixed = applyFixes(code, detect(code))
    const remaining = detect(fixed).filter(
      (v) => v.detector === "raw-color" && v.severity === "error" && v.fix,
    )
    expect(remaining).toEqual([])
  })
})

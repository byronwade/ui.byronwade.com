import { describe, it, expect } from "vitest"
import { findRawColor, nearestToken } from "../src/color.js"

const candidates = {
  brand: { light: "oklch(0.6 0.17 148)", dark: "oklch(0.7 0.17 148)" },
  destructive: { light: "oklch(0.58 0.22 27)", dark: "oklch(0.62 0.22 27)" },
}

describe("findRawColor", () => {
  it("finds hex", () => expect(findRawColor("text-[#16a34a]")).toBe("#16a34a"))
  it("finds rgb()", () =>
    expect(findRawColor("color: rgb(20, 180, 80)")).toBe("rgb(20, 180, 80)"))
  it("finds named color", () =>
    expect(findRawColor("border: 1px solid red")).toBe("red"))
  it("ignores var(--token)", () =>
    expect(findRawColor("bg-[var(--brand)]")).toBeNull())
  it("ignores plain utilities", () =>
    expect(findRawColor("bg-brand p-4")).toBeNull())
})

describe("nearestToken", () => {
  it("maps a green hex to brand", () => {
    expect(nearestToken("#16a34a", candidates, 0.1)?.token).toBe("brand")
  })
  it("maps a red hex to destructive", () => {
    expect(nearestToken("#dc2626", candidates, 0.1)?.token).toBe("destructive")
  })
  it("returns null beyond threshold", () => {
    expect(nearestToken("#16a34a", candidates, 0.0001)).toBeNull()
  })
  it("returns null for unparseable input", () => {
    expect(nearestToken("not-a-color", candidates, 1)).toBeNull()
  })

  // FIX 3 regression: use the closer of light/dark per candidate.
  // #22c55e: distLight=0.1248, distDark=0.0320 (vs brand.dark=oklch(0.7 0.17 148)).
  // maxDistance=0.10 is between them: old code (light-only) returns null; new code returns brand.
  it("resolves a dark-biased green to brand using the dark value (dist light=0.1248, dark=0.0320)", () => {
    // maxDistance sits between distDark (0.0320) and distLight (0.1248)
    expect(nearestToken("#22c55e", candidates, 0.1)?.token).toBe("brand")
  })
})

import { describe, it, expect } from "vitest"
import { detect } from "../src/detect.js"

describe("hand-rolled detector", () => {
  it("flags bg-gradient-* utilities", () => {
    const v = detect(
      `const x = <div className="bg-gradient-to-b from-white to-black" />;`,
    )
    expect(v.some((x) => x.detector === "hand-rolled")).toBe(true)
  })
  it("flags inline linear-gradient", () => {
    const v = detect(
      `const x = <div style={{ backgroundImage: "linear-gradient(white, black)" }} />;`,
    )
    expect(v.some((x) => x.detector === "hand-rolled")).toBe(true)
  })
  it("does not flag the house utilities", () => {
    const v = detect(
      `const x = <div className="glow-brand bg-grid text-gradient-brand" />;`,
    )
    expect(v.filter((x) => x.detector === "hand-rolled")).toEqual([])
  })
})

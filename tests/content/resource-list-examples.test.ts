import { readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"

const exampleRoot = join(process.cwd(), "content/examples/resource-list")
const densityFrameExamples = [
  "default",
  "compact",
  "inset",
  "compact-inset",
  "comfortable",
  "comfortable-inset",
]

describe("resource list density and frame examples", () => {
  it("keep the same row content while only changing density and frame props", () => {
    for (const name of densityFrameExamples) {
      const source = readFileSync(join(exampleRoot, `${name}.tsx`), "utf8")

      expect(source).toContain("Ariana Cole")
      expect(source).toContain("ariana@northwind.test")
      expect(source).toContain('label: "VIP"')
      expect(source).toContain('variant: "success"')

      expect(source).toContain("Devin Park")
      expect(source).toContain("devin@northwind.test")
      expect(source).toContain('label: "New"')

      expect(source).toContain("Mara Lindqvist")
      expect(source).toContain("mara@northwind.test")
      expect(source).toContain('label: "Refunded"')
      expect(source).toContain('variant: "warning"')
    }
  })
})

import { describe, expect, it } from "vitest"
import { readFileSync } from "node:fs"
import { join } from "node:path"

const read = (rel: string) => readFileSync(join(process.cwd(), rel), "utf8")

describe("native demo-state exemplars", () => {
  it("data-table default example drives all five states from useDemoState", () => {
    const source = read("content/examples/data-table/default.tsx")
    expect(source).toContain("useDemoState")
    expect(source).toContain('state === "loading"')
    expect(source).toContain('state === "empty"')
    expect(source).toContain('state === "error"')
  })
})

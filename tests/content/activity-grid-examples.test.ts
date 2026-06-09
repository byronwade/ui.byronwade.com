import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"

const exampleFiles = [
  "content/examples/activity-grid/columns.tsx",
  "content/examples/activity-grid/default.tsx",
  "content/examples/activity-grid/empty.tsx",
  "content/examples/activity-grid/intensity-levels.tsx",
  "content/examples/activity-grid/interactive.tsx",
  "content/examples/activity-grid/in-card.tsx",
  "content/examples/activity-grid/shape-and-density.tsx",
]

describe("activity-grid examples", () => {
  it("use deterministic data so docs previews hydrate cleanly", () => {
    for (const file of exampleFiles) {
      const source = readFileSync(file, "utf8")
      expect(source, file).not.toContain("Math.random")
    }
  })

  it("connect to the scoped density toolbar", () => {
    for (const file of exampleFiles) {
      const source = readFileSync(file, "utf8")
      expect(source, file).toContain("useDemoDensity")
      expect(source, file).toContain("size={density}")
    }
  })

  it("uses distinct frame and depth treatments for the in-card example", () => {
    const source = readFileSync(
      "content/examples/activity-grid/in-card.tsx",
      "utf8",
    )

    expect(source).toContain('frame === "inset"')
    expect(source).toContain("ring-1 ring-border/70")
    expect(source).toContain('depth === "soft" && "depth-soft"')
    expect(source).toContain('depth === "raised" && "depth-raised"')
    expect(source).not.toContain(
      '"w-fit rounded-xl bg-card text-card-foreground edge"',
    )
    expect(source).not.toContain("shadow-sm")
    expect(source).not.toContain("shadow-md")
    expect(source).not.toContain('depth === "soft" && "edge"')
    expect(source).not.toContain('depth === "raised" && "edge"')
    expect(source).not.toContain('depth !== "none" && "edge"')
  })

  it("uses the state toolbar in the in-card example", () => {
    const source = readFileSync(
      "content/examples/activity-grid/in-card.tsx",
      "utf8",
    )

    expect(source).toContain("useDemoState")
    expect(source).toContain('state === "success"')
    expect(source).toContain('state === "error"')
    expect(source).toContain('state === "loading"')
    expect(source).toContain('state === "empty"')
    expect(source).toContain("aria-busy")
    expect(source).toContain(
      'import { Skeleton } from "@/components/ui/skeleton"',
    )
    expect(source).toContain("<Skeleton")
    expect(source).not.toContain("animate-pulse")
  })

  it("makes the default example state-aware so the landing preview responds to the state toolbar", () => {
    const source = readFileSync(
      "content/examples/activity-grid/default.tsx",
      "utf8",
    )

    expect(source).toContain("useDemoState")
    expect(source).toContain('state === "loading"')
    expect(source).toContain('state === "empty"')
    expect(source).toContain('state === "error"')
  })
})

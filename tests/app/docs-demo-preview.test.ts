import { describe, expect, it } from "vitest"

import { getDisabledDemoControlsForSource } from "@/app/(docs)/_components/docs-demo-preview"

describe("DocsDemoPreview", () => {
  it("disables the state control when an example does not consume it", () => {
    expect(
      getDisabledDemoControlsForSource(`
        import { ActivityGrid } from "@/components/ui/activity-grid"
        export default function Example() {
          return <ActivityGrid data={[1]} />
        }
      `),
    ).toEqual({ frame: true, depth: true, state: true })
  })

  it("enables frame, depth, and state controls when an example consumes demo context hooks", () => {
    expect(
      getDisabledDemoControlsForSource(`
        import { useDemoFrame, useDemoDepth, useDemoState } from "@/lib/demo-viewport"
        export default function Example() {
          const frame = useDemoFrame()
          const depth = useDemoDepth()
          const state = useDemoState()
          return <div data-frame={frame} data-depth={depth} data-state={state} />
        }
      `),
    ).toEqual({ frame: false, depth: false, state: false })
  })
})

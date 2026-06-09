import "@testing-library/jest-dom/vitest"
import * as axeMatchers from "vitest-axe/matchers"
import { afterAll, expect } from "vitest"

expect.extend(axeMatchers)

// NOTE: ResizeObserver is intentionally NOT polyfilled globally — recharts
// (chart.test.tsx) and the showcase-carousel measure scrollability
// differently when one is present, so individual tests install a no-op locally.
//
// This runs once per test FILE (setup files register file-scoped hooks). Tests
// that stub ResizeObserver in beforeAll/beforeEach sometimes forget to remove
// it; left in place it bleeds into the NEXT file sharing the worker and breaks
// ResizeObserver-absence-dependent components there (intermittent, order-
// dependent flakes). Enforce the invariant centrally so a single forgetful
// (or future) test file can't pollute its siblings.
afterAll(() => {
  Reflect.deleteProperty(globalThis, "ResizeObserver")
})

// Re-export axe for convenience in test files
export { axe } from "vitest-axe"

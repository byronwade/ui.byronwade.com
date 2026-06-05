import "@testing-library/jest-dom/vitest"
import * as axeMatchers from "vitest-axe/matchers"
import { expect } from "vitest"

expect.extend(axeMatchers)

// NOTE: ResizeObserver is intentionally NOT polyfilled globally — recharts
// (chart.test.tsx) behaves differently when one is present, so the Bloom tests
// install a no-op locally instead (see tests/components/bloom*.test.tsx).

// Re-export axe for convenience in test files
export { axe } from "vitest-axe"

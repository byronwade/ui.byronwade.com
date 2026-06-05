import { describe, it, expect } from "vitest"
import { extractCode } from "../src/extract-code.js"

describe("extractCode", () => {
  it("extracts a ```tsx fenced block", () => {
    const r = "Here you go:\n```tsx\nconst x = <Button />;\n```\nDone."
    expect(extractCode(r)).toBe("const x = <Button />;")
  })
  it("extracts a ```jsx block", () => {
    expect(extractCode("```jsx\nconst y = 1;\n```")).toBe("const y = 1;")
  })
  it("takes the FIRST block when several exist", () => {
    expect(extractCode("```tsx\nA\n```\n```tsx\nB\n```")).toBe("A")
  })
  it("returns null when there is no fenced block", () => {
    expect(extractCode("no code here")).toBeNull()
  })
})

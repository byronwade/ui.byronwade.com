import type { Violation } from "../types.js"
import type { ElementClasses } from "../extract.js"

const HEADINGS = new Set(["h1", "h2", "h3", "h4", "h5", "h6"])
const BOLD = new Set([
  "font-semibold",
  "font-bold",
  "font-extrabold",
  "font-black",
])
const ARB_WEIGHT = /^font-\[(\d{3})\]$/
// Weights at/above this are "bold-family"; headings must stay at/below font-medium per the Design DNA.
const BOLD_WEIGHT_THRESHOLD = 600

/** Headings carry hierarchy through size + tracking, never weight (Design DNA). */
export function detectTypography(elements: ElementClasses[]): Violation[] {
  const out: Violation[] = []
  for (const el of elements) {
    if (!HEADINGS.has(el.name)) continue
    for (const tok of el.classes) {
      const arb = tok.value.match(ARB_WEIGHT)
      const isBold =
        BOLD.has(tok.value) ||
        (arb !== null && Number(arb[1]) >= BOLD_WEIGHT_THRESHOLD)
      if (!isBold) continue
      out.push({
        detector: "typography",
        range: tok.range,
        severity: "error",
        message: `Headings carry hierarchy through size + tracking, not weight. Use \`font-medium\`, not \`${tok.value}\`.`,
        fix: { range: tok.range, text: "font-medium" },
      })
    }
  }
  return out
}

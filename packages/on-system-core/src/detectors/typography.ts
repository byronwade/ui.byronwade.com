import type { Violation } from "../types.js";
import type { ElementClasses } from "../extract.js";

const HEADINGS = new Set(["h1", "h2", "h3", "h4", "h5", "h6"]);
const BOLD = new Set(["font-semibold", "font-bold", "font-extrabold", "font-black"]);
const ARB_WEIGHT = /^font-\[(\d{3})\]$/;

/** Headings carry hierarchy through size + tracking, never weight (Design DNA). */
export function detectTypography(elements: ElementClasses[]): Violation[] {
  const out: Violation[] = [];
  for (const el of elements) {
    if (!HEADINGS.has(el.name)) continue;
    for (const tok of el.classes) {
      const arb = tok.value.match(ARB_WEIGHT);
      const isBold = BOLD.has(tok.value) || (arb !== null && Number(arb[1]) >= 600);
      if (!isBold) continue;
      out.push({
        detector: "typography", range: tok.range, severity: "error",
        message: `Headings carry hierarchy through size + tracking, not weight. Use \`font-medium\`, not \`${tok.value}\`.`,
        fix: { range: tok.range, text: "font-medium" },
      });
    }
  }
  return out;
}

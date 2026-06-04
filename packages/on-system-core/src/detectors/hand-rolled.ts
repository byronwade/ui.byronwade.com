import type { Violation } from "../types.js";
import type { ClassToken, StyleString } from "../extract.js";

const GRADIENT_CLASS = /^(bg-gradient-|bg-\[(?:linear|radial|conic)-gradient)/;
const GRADIENT_STYLE = /(linear|radial|conic)-gradient\s*\(/;

export function detectHandRolled(classes: ClassToken[], styles: StyleString[]): Violation[] {
  const out: Violation[] = [];
  for (const tok of classes) {
    if (GRADIENT_CLASS.test(tok.value)) {
      out.push({
        detector: "hand-rolled", range: tok.range, severity: "error",
        message: `Hand-rolled gradient \`${tok.value}\`. Use a house utility: glow-brand, text-gradient-brand, or bg-grid.`,
      });
    }
  }
  for (const s of styles) {
    if (GRADIENT_STYLE.test(s.value)) {
      out.push({
        detector: "hand-rolled", range: s.range, severity: "error",
        message: `Hand-rolled gradient in style. Use a house utility: glow-brand, text-gradient-brand, or bg-grid.`,
      });
    }
  }
  return out;
}

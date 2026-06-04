import type { Violation, Manifest } from "../types.js";
import type { ClassToken } from "../extract.js";
import { findRawColor } from "../color.js";

const ARBITRARY = /^([a-z-]+)-\[([^\]]+)\]$/;
const VAR_TOKEN = /^var\(--([a-z0-9-]+)\)$/;

export function detectArbitraryValue(classes: ClassToken[], manifest: Manifest): Violation[] {
  const out: Violation[] = [];
  for (const tok of classes) {
    const m = tok.value.match(ARBITRARY);
    if (!m) continue;
    const [, prefix, inner] = m;
    if (findRawColor(inner)) continue; // handled by raw-color
    const varMatch = inner.match(VAR_TOKEN);
    if (varMatch && manifest.colorTokens.includes(varMatch[1])) {
      const replacement = `${prefix}-${varMatch[1]}`;
      out.push({
        detector: "arbitrary-value", range: tok.range, severity: "error",
        message: `Arbitrary value \`${tok.value}\` should use the token utility \`${replacement}\`.`,
        fix: { range: tok.range, text: replacement },
      });
      continue;
    }
    out.push({
      detector: "arbitrary-value", range: tok.range, severity: "error",
      message: `Arbitrary value \`${tok.value}\` is off-system. Use a token/scale utility (spacing, radius from --radius, or a color token).`,
    });
  }
  return out;
}

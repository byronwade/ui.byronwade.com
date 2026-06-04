import type { Violation, Manifest } from "../types.js";
import type { ClassToken } from "../extract.js";
import { findRawColor } from "../color.js";
import { ARBITRARY } from "../patterns.js";

const VAR_TOKEN = /^var\(--([a-z0-9-]+)\)$/;

// spacing/radius prefixes that have a token scale (negative spacing allowed)
const SCALE_PREFIX = /^-?(p[xytrbl]?|m[xytrbl]?|gap(-[xy])?|space-[xy]|rounded(-(t|b|l|r|tl|tr|bl|br|s|e|ss|se|ee|es))?)$/;
// a bare length the spacing/radius scale could express
const BARE_LENGTH = /^-?\d*\.?\d+(px|rem|em)$/;

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
    if (SCALE_PREFIX.test(prefix) && BARE_LENGTH.test(inner)) {
      out.push({
        detector: "arbitrary-value", range: tok.range, severity: "error",
        message: `Arbitrary value \`${tok.value}\` is off-system. Use the spacing/radius scale (from --radius), not a pixel value.`,
      });
    }
    // all other arbitrary values (durations, easings, calc(), %, keywords, etc.) are allowed
  }
  return out;
}

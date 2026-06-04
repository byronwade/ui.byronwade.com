import type { Violation, DetectOptions, Manifest } from "../types.js";
import type { ClassToken, StyleString } from "../extract.js";
import { findRawColor, nearestToken } from "../color.js";

const ARBITRARY = /^([a-z-]+)-\[([^\]]+)\]$/;
const STYLE_COLOR_PROPS = new Set(["color", "background", "backgroundColor", "borderColor", "fill", "stroke", "outlineColor"]);

export function detectRawColor(
  classes: ClassToken[],
  styles: StyleString[],
  manifest: Manifest,
  opts: Required<Pick<DetectOptions, "maxColorDistance">>
): Violation[] {
  const out: Violation[] = [];
  const max = opts.maxColorDistance;

  for (const tok of classes) {
    const m = tok.value.match(ARBITRARY);
    if (!m) continue;
    const [, prefix, inner] = m;
    const raw = findRawColor(inner);
    if (!raw) continue;
    const near = nearestToken(raw, manifest.colorValues, max);
    const replacement = near ? `${prefix}-${near.token}` : null;
    out.push({
      detector: "raw-color",
      range: tok.range,
      severity: "error",
      message: replacement
        ? `Raw color "${raw}" is off-system. Use \`${replacement}\` (token).`
        : `Raw color "${raw}" is off-system. Use a color token (e.g. bg-brand); no close token found.`,
      ...(replacement ? { fix: { range: tok.range, text: replacement } } : {}),
    });
  }

  for (const s of styles) {
    if (!STYLE_COLOR_PROPS.has(s.prop)) continue;
    const raw = findRawColor(s.value);
    if (!raw) continue;
    const near = nearestToken(raw, manifest.colorValues, max);
    out.push({
      detector: "raw-color",
      range: s.range,
      severity: "error",
      message: near
        ? `Raw color "${raw}" in style is off-system. Use the \`${near.token}\` token (var(--${near.token})).`
        : `Raw color "${raw}" in style is off-system. Use a design token.`,
      ...(near ? { fix: { range: s.range, text: `var(--${near.token})` } } : {}),
    });
  }
  return out;
}

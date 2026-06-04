import type { Violation, DetectOptions } from "./types.js";
import { manifest } from "./manifest.js";
import { parse } from "./parse.js";
import { extractClassTokens, extractStyleStrings, extractJsxElements, extractElementClasses } from "./extract.js";
import { detectRawColor } from "./detectors/raw-color.js";
import { detectArbitraryValue } from "./detectors/arbitrary-value.js";
import { detectHandRolled } from "./detectors/hand-rolled.js";
import { detectOffSystemComponent } from "./detectors/off-system-component.js";
import { detectTypography } from "./detectors/typography.js";

export function detect(code: string, options: DetectOptions = {}): Violation[] {
  const opts = {
    maxColorDistance: options.maxColorDistance ?? 0.1,
    offSystemComponents: options.offSystemComponents ?? "warn",
  } as const;

  const ast = parse(code);
  const classes = extractClassTokens(ast);
  const styles = extractStyleStrings(ast);
  const elements = extractJsxElements(ast);
  const elementClasses = extractElementClasses(ast);

  const violations: Violation[] = [
    ...detectRawColor(classes, styles, manifest, opts),
    ...detectArbitraryValue(classes, manifest),
    ...detectHandRolled(classes, styles),
    ...detectOffSystemComponent(elements, manifest, opts.offSystemComponents),
    ...detectTypography(elementClasses),
  ];

  return violations.sort((a, b) => a.range[0] - b.range[0]);
}

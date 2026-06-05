import type { Violation, Manifest, DetectOptions } from "../types.js"
import type { JsxElement } from "../extract.js"

export function detectOffSystemComponent(
  elements: JsxElement[],
  manifest: Manifest,
  mode: NonNullable<DetectOptions["offSystemComponents"]>,
): Violation[] {
  if (mode === "off") return []
  const out: Violation[] = []
  for (const el of elements) {
    const component = manifest.nativeToComponent[el.name]
    if (!component) continue
    out.push({
      detector: "off-system-component",
      range: el.range,
      severity: mode === "error" ? "error" : "warn",
      message: `Raw <${el.name}> where a primitive exists. Use <${component}> from @byronwade/ui.`,
    })
  }
  return out
}

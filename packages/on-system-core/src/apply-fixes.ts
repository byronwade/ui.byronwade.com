import type { Violation } from "./types.js"

/** Apply fixes right-to-left so earlier offsets stay valid. Overlapping fixes: first wins. */
export function applyFixes(code: string, violations: Violation[]): string {
  const fixes = violations
    .filter(
      (v): v is Violation & { fix: NonNullable<Violation["fix"]> } => !!v.fix,
    )
    .map((v) => v.fix)
    .sort((a, b) => b.range[0] - a.range[0])
  let out = code
  let lastStart = Infinity
  for (const f of fixes) {
    if (f.range[1] > lastStart) continue // skip overlapping
    out = out.slice(0, f.range[0]) + f.text + out.slice(f.range[1])
    lastStart = f.range[0]
  }
  return out
}

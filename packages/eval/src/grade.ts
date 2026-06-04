import { detect, type DetectorId } from "@byronwade/on-system-core";

export interface GradeFields {
  pass: boolean;
  violations: number;
  byDetector: Partial<Record<DetectorId, number>>;
  reason?: "no-code" | "parse-error";
}

/** All-five-detectors-strict grading: pass iff code extracts, parses, and has zero violations. */
export function gradeGeneration(code: string | null): GradeFields {
  if (code === null) return { pass: false, violations: 0, byDetector: {}, reason: "no-code" };
  let violations;
  try {
    violations = detect(code, { offSystemComponents: "error" });
  } catch {
    return { pass: false, violations: 0, byDetector: {}, reason: "parse-error" };
  }
  const byDetector: Partial<Record<DetectorId, number>> = {};
  for (const v of violations) byDetector[v.detector] = (byDetector[v.detector] ?? 0) + 1;
  return { pass: violations.length === 0, violations: violations.length, byDetector };
}

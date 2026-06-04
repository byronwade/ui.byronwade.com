import type { GradedResult, Condition, ConditionSummary, EvalReport, DetectorId } from "./types.js";

function summarize(condition: Condition, results: GradedResult[]): ConditionSummary {
  const rows = results.filter((r) => r.condition === condition);
  const passes = rows.filter((r) => r.pass).length;
  const total = rows.length;
  const byDetector: Partial<Record<DetectorId, number>> = {};
  let violations = 0;
  for (const r of rows) {
    violations += r.violations;
    for (const [d, n] of Object.entries(r.byDetector)) byDetector[d as DetectorId] = (byDetector[d as DetectorId] ?? 0) + (n ?? 0);
  }
  return {
    condition, total, passes,
    passRate: total ? passes / total : 0,
    meanViolations: total ? violations / total : 0,
    byDetector,
  };
}

export function aggregate(
  results: GradedResult[],
  meta: { date: string; model: string; promptSetHash: string }
): EvalReport {
  const withRule = summarize("with-rule", results);
  const baseline = summarize("baseline", results);
  return {
    ...meta,
    conditions: { "with-rule": withRule, baseline },
    lift: withRule.passRate - baseline.passRate,
    perPrompt: results,
  };
}

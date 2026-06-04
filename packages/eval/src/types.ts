import type { DetectorId } from "@byronwade/on-system-core";

export type Condition = "with-rule" | "baseline";

export interface Prompt { name: string; text: string; }

export interface GradedResult {
  prompt: string;
  condition: Condition;
  pass: boolean;                 // true iff zero violations and code extracted+parsed
  violations: number;
  byDetector: Partial<Record<DetectorId, number>>;
  reason?: "no-code" | "parse-error";  // set when pass is false for a non-violation reason
}

export interface ConditionSummary {
  condition: Condition;
  total: number;
  passes: number;
  passRate: number;              // passes / total, 0..1
  meanViolations: number;
  byDetector: Partial<Record<DetectorId, number>>;
}

export interface EvalReport {
  date: string;                  // injected (no Date.now in library code)
  model: string;
  promptSetHash: string;
  conditions: { "with-rule": ConditionSummary; baseline: ConditionSummary };
  lift: number;                  // withRule.passRate - baseline.passRate
  perPrompt: GradedResult[];
}

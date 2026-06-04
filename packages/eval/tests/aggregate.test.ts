import { describe, it, expect } from "vitest";
import { aggregate } from "../src/aggregate.js";
import type { GradedResult } from "../src/types.js";

const R = (condition: "with-rule" | "baseline", pass: boolean, violations = pass ? 0 : 2): GradedResult =>
  ({ prompt: "p", condition, pass, violations, byDetector: pass ? {} : { "raw-color": violations } });

describe("aggregate", () => {
  it("computes per-condition pass rates and the lift", () => {
    const results = [
      R("with-rule", true), R("with-rule", true), R("with-rule", false),
      R("baseline", false), R("baseline", false), R("baseline", true),
    ];
    const report = aggregate(results, { date: "2026-06-03", model: "claude-sonnet-4-6", promptSetHash: "abc123abc123" });
    expect(report.conditions["with-rule"].passRate).toBeCloseTo(2 / 3);
    expect(report.conditions.baseline.passRate).toBeCloseTo(1 / 3);
    expect(report.lift).toBeCloseTo(1 / 3);
    expect(report.conditions["with-rule"].byDetector["raw-color"]).toBe(2);
  });
});

import { describe, it, expect } from "vitest";
import { toJson, toMarkdown } from "../src/report.js";
import type { EvalReport } from "../src/types.js";

const report: EvalReport = {
  date: "2026-06-03", model: "claude-sonnet-4-6", promptSetHash: "deadbeef0000",
  conditions: {
    "with-rule": { condition: "with-rule", total: 2, passes: 2, passRate: 1, meanViolations: 0, byDetector: {} },
    baseline: { condition: "baseline", total: 2, passes: 0, passRate: 0, meanViolations: 3, byDetector: { "raw-color": 4 } },
  },
  lift: 1,
  perPrompt: [],
};

describe("report", () => {
  it("toJson round-trips", () => {
    expect(JSON.parse(toJson(report)).lift).toBe(1);
  });
  it("toMarkdown shows the headline lift as percentages", () => {
    const md = toMarkdown(report);
    expect(md).toContain("0% → 100%");
    expect(md).toContain("claude-sonnet-4-6");
  });
});

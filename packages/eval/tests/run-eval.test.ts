import { describe, it, expect } from "vitest"
import { runEval } from "../src/run-eval.js"
import { makeFakeClient } from "../src/fixtures/fake-client.js"
import type { Prompt } from "../src/types.js"

const prompts: Prompt[] = [
  { name: "a", text: "build a" },
  { name: "b", text: "build b" },
]

describe("runEval", () => {
  it("runs every prompt in both conditions and grades them", async () => {
    const report = await runEval(makeFakeClient(), prompts, "RULE TEXT", {
      date: "2026-06-03",
      model: "claude-sonnet-4-6",
      promptSetHash: "deadbeef0000",
    })
    expect(report.perPrompt).toHaveLength(4) // 2 prompts x 2 conditions
    // fake: with-rule is on-system (pass), baseline is off-system (fail)
    expect(report.conditions["with-rule"].passRate).toBe(1)
    expect(report.conditions.baseline.passRate).toBe(0)
    expect(report.lift).toBe(1)
  })
})

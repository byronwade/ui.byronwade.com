import type { AnthropicClient } from "./generate.js"
import { buildSystem } from "./generate.js"
import { extractCode } from "./extract-code.js"
import { gradeGeneration } from "./grade.js"
import { aggregate } from "./aggregate.js"
import type { Prompt, Condition, GradedResult, EvalReport } from "./types.js"

const CONDITIONS: Condition[] = ["with-rule", "baseline"]

export async function runEval(
  client: AnthropicClient,
  prompts: Prompt[],
  ruleText: string,
  meta: { date: string; model: string; promptSetHash: string },
): Promise<EvalReport> {
  const results: GradedResult[] = []
  for (const prompt of prompts) {
    for (const condition of CONDITIONS) {
      const { system, cacheSystem } = buildSystem(condition, ruleText)
      const response = await client.complete({
        system,
        user: prompt.text,
        cacheSystem,
      })
      const graded = gradeGeneration(extractCode(response))
      results.push({ prompt: prompt.name, condition, ...graded })
    }
  }
  return aggregate(results, meta)
}

import { writeFileSync, mkdirSync, readFileSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { loadPrompts, hashPrompts } from "./prompts.js"
import { runEval } from "./run-eval.js"
import { toJson, toMarkdown } from "./report.js"
import { makeAnthropicClient } from "./generate.js"
import { makeFakeClient } from "./fixtures/fake-client.js"

const MODEL = "claude-sonnet-4-6"
const root = join(dirname(fileURLToPath(import.meta.url)), "..")

async function main() {
  const argv = process.argv.slice(2)
  const dryRun = argv.includes("--dry-run")
  const today = process.env.EVAL_DATE ?? new Date().toISOString().slice(0, 10)

  const prompts = loadPrompts()
  const ruleText = readFileSync(
    join(root, "..", "..", "registry", "rules", "byronwade-ui.mdc"),
    "utf8",
  )

  let client
  if (dryRun) {
    client = makeFakeClient()
  } else {
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      console.error("ANTHROPIC_API_KEY is required (or pass --dry-run).")
      process.exit(1)
      return
    }
    client = makeAnthropicClient(apiKey, MODEL)
  }

  console.log(
    `Running eval: ${prompts.length} prompts × 2 conditions${dryRun ? " (dry-run)" : ""}…`,
  )
  const report = await runEval(client, prompts, ruleText, {
    date: today,
    model: MODEL,
    promptSetHash: hashPrompts(prompts),
  })

  const outDir = join(root, "results")
  mkdirSync(outDir, { recursive: true })
  writeFileSync(join(outDir, "latest.json"), toJson(report))
  writeFileSync(join(outDir, "latest.md"), toMarkdown(report))

  const w = report.conditions["with-rule"].passRate
  const b = report.conditions.baseline.passRate
  console.log(
    `on-system: baseline ${Math.round(b * 100)}% → with-rule ${Math.round(w * 100)}% (lift +${Math.round(report.lift * 100)}%)`,
  )
  console.log(`wrote results/latest.json + latest.md`)
}

main()

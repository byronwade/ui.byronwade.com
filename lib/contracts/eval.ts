/**
 * Eval harness — score agent UI snippets against the shared consistency bans.
 *
 * NOTE: nothing runs this yet. Harbor's DNA advertises an "Eval harness";
 * wiring it into CI is a product decision, not a cleanup.
 */

import { lintSource } from "@/lib/design/bans.mjs"
import { fewShots } from "@/lib/contracts/few-shots"

export type EvalCase = {
  id: string
  source: string
  expectOk: boolean
}

export type EvalHit = {
  id: string
  rule: string
  message: string
}

/**
 * Rules come from the shared ban module so this harness, the repository
 * gate, and the MCP `validate_ui` tool cannot disagree about what is banned.
 */
export function lintSnippet(source: string): EvalHit[] {
  return lintSource(source).map((hit: { ban: string; why: string }) => ({
    id: "snippet",
    rule: hit.ban,
    message: hit.why,
  }))
}

/** Built-in cases derived from few-shots (good must pass, bad must fail). */
export function defaultEvalCases(): EvalCase[] {
  return fewShots.flatMap((shot) => [
    { id: `${shot.id}:good`, source: shot.good, expectOk: true },
    { id: `${shot.id}:bad`, source: shot.bad, expectOk: false },
  ])
}

export function runEval(cases: EvalCase[] = defaultEvalCases()) {
  const results = cases.map((c) => {
    const hits = lintSnippet(c.source)
    const ok = hits.length === 0
    const pass = ok === c.expectOk
    return { id: c.id, pass, ok, hits, expectOk: c.expectOk }
  })
  const passed = results.filter((r) => r.pass).length
  return {
    ok: passed === results.length,
    passed,
    total: results.length,
    results,
  }
}

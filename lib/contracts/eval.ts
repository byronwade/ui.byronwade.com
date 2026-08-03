/**
 * Eval harness stub — score agent UI snippets against Meridian bans.
 * Wire into CI or offline batches; not a full visual eval.
 */

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

const rules: { id: string; re: RegExp; message: string }[] = [
  {
    id: "hex-color",
    re: /#[0-9a-fA-F]{3,8}\b/,
    message: "hex color banned",
  },
  {
    id: "shadow-util",
    re: /\bshadow-(?:sm|md|lg|xl|2xl|inner)\b/,
    message: "shadow-* banned",
  },
  {
    id: "lucide-import",
    re: /from\s+["']lucide-react["']/,
    message: "lucide-react banned",
  },
]

export function lintSnippet(source: string): EvalHit[] {
  const hits: EvalHit[] = []
  for (const rule of rules) {
    if (rule.re.test(source)) {
      hits.push({ id: "snippet", rule: rule.id, message: rule.message })
    }
  }
  return hits
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

import type { EvalReport } from "./types.js";

export function toJson(report: EvalReport): string {
  return JSON.stringify(report, null, 2) + "\n";
}

const pct = (n: number) => `${Math.round(n * 100)}%`;

export function toMarkdown(report: EvalReport): string {
  const w = report.conditions["with-rule"];
  const b = report.conditions.baseline;
  const lines = [
    `# On-system eval — ${report.date}`,
    ``,
    `Model: \`${report.model}\` · prompts: \`${report.promptSetHash}\` · ${w.total} prompts × 2 conditions`,
    ``,
    `## Headline`,
    ``,
    `**First-try on-system (zero violations): ${pct(b.passRate)} → ${pct(w.passRate)}** with the byronwade/ui rule (+${pct(report.lift)}).`,
    ``,
    `| condition | pass rate | mean violations |`,
    `| --- | --- | --- |`,
    `| baseline | ${pct(b.passRate)} | ${b.meanViolations.toFixed(2)} |`,
    `| with-rule | ${pct(w.passRate)} | ${w.meanViolations.toFixed(2)} |`,
    ``,
    `> Single generation per cell at temperature 0; a dated snapshot, not a guaranteed-stable number.`,
  ];
  return lines.join("\n") + "\n";
}

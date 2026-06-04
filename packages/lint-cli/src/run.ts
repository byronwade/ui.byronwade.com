import { readFileSync, writeFileSync } from "node:fs";
import fg from "fast-glob";
import { detect, applyFixes, type Violation } from "@byronwade/on-system-core";

export interface RunOptions { fix?: boolean; maxColorDistance?: number; offSystemComponents?: "warn" | "error" | "off"; cwd?: string; }
export interface RunResult { errorCount: number; warnCount: number; files: { file: string; violations: Violation[] }[]; }

export async function run(patterns: string[], opts: RunOptions = {}): Promise<RunResult> {
  const files = await fg(patterns, { cwd: opts.cwd ?? process.cwd(), absolute: true, dot: false });
  const result: RunResult = { errorCount: 0, warnCount: 0, files: [] };
  for (const file of files) {
    const code = readFileSync(file, "utf8");
    let violations = detect(code, { maxColorDistance: opts.maxColorDistance, offSystemComponents: opts.offSystemComponents });
    if (opts.fix && violations.some((v) => v.fix)) {
      writeFileSync(file, applyFixes(code, violations));
      violations = detect(readFileSync(file, "utf8"), { maxColorDistance: opts.maxColorDistance, offSystemComponents: opts.offSystemComponents });
    }
    for (const v of violations) v.severity === "error" ? result.errorCount++ : result.warnCount++;
    if (violations.length) result.files.push({ file, violations });
  }
  return result;
}

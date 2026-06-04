#!/usr/bin/env node
import pc from "picocolors";
import { run } from "./run.js";

async function main() {
  const argv = process.argv.slice(2);
  const fix = argv.includes("--fix");
  const distIdx = argv.indexOf("--max-color-distance");
  const maxColorDistance = distIdx >= 0 ? Number(argv[distIdx + 1]) : undefined;
  const patterns = argv.filter((a, i) =>
    !a.startsWith("--") && !(distIdx >= 0 && i === distIdx + 1));
  if (patterns.length === 0) patterns.push("**/*.{ts,tsx}");

  const res = await run(patterns, { fix, maxColorDistance });
  for (const { file, violations } of res.files) {
    console.log(pc.underline(file));
    for (const v of violations) {
      const tag = v.severity === "error" ? pc.red("error") : pc.yellow("warn ");
      console.log(`  ${tag}  ${v.message}  ${pc.dim(v.detector)}`);
    }
  }
  console.log(
    `\n${res.errorCount} error(s), ${res.warnCount} warning(s) across ${res.files.length} file(s).`
  );
  process.exit(res.errorCount > 0 ? 1 : 0);
}
main();

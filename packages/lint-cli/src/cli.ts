#!/usr/bin/env node
import pc from "picocolors"
import { run, isBlocking } from "./run.js"

async function main() {
  const argv = process.argv.slice(2)
  const fix = argv.includes("--fix")
  const distIdx = argv.indexOf("--max-color-distance")
  const maxColorDistance = distIdx >= 0 ? Number(argv[distIdx + 1]) : undefined
  const oscIdx = argv.indexOf("--off-system-components")
  const offSystemComponents =
    oscIdx >= 0 ? (argv[oscIdx + 1] as "warn" | "error" | "off") : undefined
  const edIdx = argv.indexOf("--error-detectors")
  const errorDetectors = edIdx >= 0 ? argv[edIdx + 1].split(",") : undefined
  const patterns = argv.filter(
    (a, i) =>
      !a.startsWith("--") &&
      !(distIdx >= 0 && i === distIdx + 1) &&
      !(oscIdx >= 0 && i === oscIdx + 1) &&
      !(edIdx >= 0 && i === edIdx + 1),
  )
  if (patterns.length === 0) patterns.push("**/*.{ts,tsx}")

  const res = await run(patterns, {
    fix,
    maxColorDistance,
    offSystemComponents,
    errorDetectors,
  })
  for (const { file, violations } of res.files) {
    console.log(pc.underline(file))
    for (const v of violations) {
      const blocking = isBlocking(v, errorDetectors)
      const tag = blocking ? pc.red("error") : pc.yellow("warn ")
      console.log(`  ${tag}  ${v.message}  ${pc.dim(v.detector)}`)
    }
  }
  console.log(
    `\n${res.errorCount} error(s), ${res.warnCount} warning(s) across ${res.files.length} file(s).`,
  )
  process.exit(res.errorCount > 0 ? 1 : 0)
}
main()

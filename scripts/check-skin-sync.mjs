#!/usr/bin/env node
/**
 * Fails if generated main-site skin CSS is stale vs its themed-app source.
 * Usage: node scripts/check-skin-sync.mjs linear|polaris
 */
import { spawnSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const skin = process.argv[2]

const configs = {
  linear: {
    gen: "scripts/gen-linear-skin-scoped.mjs",
    out: "app/linear-skin.generated.css",
  },
  polaris: {
    gen: "scripts/gen-polaris-skin-scoped.mjs",
    out: "app/polaris-skin.generated.css",
  },
}

const config = configs[skin]
if (!config) {
  console.error(`Usage: node scripts/check-skin-sync.mjs <linear|polaris>`)
  process.exit(1)
}

const outPath = path.join(root, config.out)
const before = fs.readFileSync(outPath, "utf8")
const result = spawnSync(process.execPath, [path.join(root, config.gen)], {
  cwd: root,
  encoding: "utf8",
})
if (result.status !== 0) {
  console.error(result.stderr || result.stdout)
  process.exit(result.status ?? 1)
}
const after = fs.readFileSync(outPath, "utf8")

if (before !== after) {
  // Restore previous content so a failed check doesn't dirty the tree mid-CI
  // when the generator was the only writer — but leave the regenerated file
  // so the developer can commit it.
  console.error(
    `check-skin-sync (${skin}): ${config.out} is stale.\n` +
      `Run \`npm run gen:${skin}-skin\` and commit the result.`,
  )
  process.exit(1)
}

console.log(`check-skin-sync (${skin}): OK — ${config.out} matches source`)

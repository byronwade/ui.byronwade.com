#!/usr/bin/env node
// update-registry.mjs
// Full registry update pipeline for local dev and automation.
//
// Steps (in order):
//   1. sync     — copy registry/ → app components + foundation CSS
//   2. build    — shadcn build → public/r/*.json
//   3. validate — check-registry + check-examples
//
// Usage:
//   npm run update:registry
//   npm run update:registry -- --skip-validate

import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const skipValidate = process.argv.includes("--skip-validate");

function run(label, cmd, args = []) {
  console.log(`\n▶ ${label}`);
  const result = spawnSync(cmd, args, { cwd: root, stdio: "inherit", shell: false });
  if (result.status !== 0) {
    console.error(`\n✗ ${label} failed (exit ${result.status ?? 1})`);
    process.exit(result.status ?? 1);
  }
}

console.log("update-registry: starting pipeline");

run("Generate `all` aggregator", "node", ["scripts/gen-all-item.mjs"]);
run("Sync registry → app", "node", ["scripts/sync-registry.mjs"]);
run("Build shadcn registry", "npx", ["shadcn", "build"]);

if (!skipValidate) {
  run("Validate manifest", "node", ["scripts/check-registry.mjs", "--built"]);
  run("Validate examples", "node", ["scripts/check-examples.mjs"]);
}

console.log("\n✓ update-registry complete");
console.log("  Next: run `npm run test:ci` before committing.");

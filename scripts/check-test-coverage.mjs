#!/usr/bin/env node
// check-test-coverage.mjs
// Ensures every registry:ui and registry:component item has a corresponding
// test file at tests/components/<name>.test.tsx.

import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const registry = JSON.parse(readFileSync(resolve(root, "registry.json"), "utf8"));

const testableTypes = new Set(["registry:ui", "registry:component"]);
const testable = registry.items.filter((item) => testableTypes.has(item.type));

const missing = testable.filter((item) => {
  const testPath = resolve(root, "tests", "components", `${item.name}.test.tsx`);
  return !existsSync(testPath);
});

if (missing.length > 0) {
  console.error(`\nMissing tests for:\n${missing.map((i) => `  - ${i.name}  (${i.type})`).join("\n")}\n`);
  console.error(`Add a test file at tests/components/<name>.test.tsx for each missing component.`);
  process.exit(1);
}

console.log(`✓ all ${testable.length} components have tests`);

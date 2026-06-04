#!/usr/bin/env node
// Fails if data.generated.json is stale vs registry.json, or any component has empty source.
import { readFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const genPath = join(root, "packages/mcp/src/data.generated.json");
const errors = [];

if (!existsSync(genPath)) {
  errors.push("data.generated.json missing — run `npm run gen:mcp-data`.");
} else {
  const before = readFileSync(genPath, "utf8");
  execFileSync("node", ["scripts/gen-mcp-data.mjs"], { cwd: root, stdio: "ignore" });
  const after = readFileSync(genPath, "utf8");
  if (before !== after) errors.push("data.generated.json is stale — run `npm run gen:mcp-data`.");
  const data = JSON.parse(after);
  for (const c of data.components) if (!c.source || c.source.length < 10) errors.push(`component ${c.name} has empty source`);
}

if (errors.length) { for (const e of errors) console.error("  - " + e); process.exit(1); }
console.log("✓ mcp data in sync with registry.json");

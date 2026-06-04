#!/usr/bin/env node
// Validates packages/mcp/src/data.generated.json against the live sources.
// The file is a gitignored generated artifact, so on a fresh checkout it won't
// exist — we generate it, then assert its content. When it already exists we
// regenerate and diff to catch a stale copy. The generator imports the TS
// catalog (content/components.ts) so it runs under tsx (Node 18+ compatible).
import { readFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const genPath = join(root, "packages/mcp/src/data.generated.json");
const errors = [];

const regen = () =>
  execFileSync("node", ["--import", "tsx", "scripts/gen-mcp-data.mjs"], { cwd: root, stdio: "ignore" });

const existed = existsSync(genPath);
const before = existed ? readFileSync(genPath, "utf8") : null;
regen();
const after = readFileSync(genPath, "utf8");
if (existed && before !== after)
  errors.push("data.generated.json is stale — run `npm run gen:mcp-data`.");

const data = JSON.parse(after);
for (const c of data.components)
  if (!c.source || c.source.length < 10) errors.push(`component ${c.name} has empty source`);
const btn = data.components.find((c) => c.name === "button");
if (!btn || !Array.isArray(btn.variants) || btn.variants.length < 18)
  errors.push("button must expose ≥18 variants in mcp data — run `npm run gen:mcp-data`");

if (errors.length) { for (const e of errors) console.error("  - " + e); process.exit(1); }
console.log("✓ mcp data in sync with registry.json");

#!/usr/bin/env node
// Validates public/llms.txt against content/components.ts. The file is a
// gitignored generated artifact, so on a fresh checkout it won't exist — we
// generate it, then assert content. The generator imports the TS catalog, so
// it runs under tsx (Node 18+ compatible).
import { readFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "public/llms.txt");
const errors = [];

const regen = () =>
  execFileSync("node", ["--import", "tsx", "scripts/gen-llms-txt.mjs"], { cwd: root, stdio: "ignore" });

const existed = existsSync(out);
const before = existed ? readFileSync(out, "utf8") : null;
regen();
const after = readFileSync(out, "utf8");
if (existed && before !== after) errors.push("public/llms.txt is stale — run `npm run gen:llms`.");
if (!after.includes("/docs/button#solid")) errors.push("llms.txt missing button variants");

if (errors.length) { for (const e of errors) console.error("  - " + e); process.exit(1); }
console.log("✓ llms.txt in sync with content/components.ts");

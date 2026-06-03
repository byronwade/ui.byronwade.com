#!/usr/bin/env node
// check-registry.mjs
// Validates registry.json manifest integrity and (optionally) shadcn build output.
//
// Usage:
//   node scripts/check-registry.mjs           # manifest only
//   node scripts/check-registry.mjs --built     # also verify public/r/*.json

import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const checkBuilt = process.argv.includes("--built");

const errors = [];
const warnings = [];

function fail(msg) {
  errors.push(msg);
}

function warn(msg) {
  warnings.push(msg);
}

function walkFiles(dir, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walkFiles(full, acc);
    else if (/\.(tsx?|jsx?)$/.test(entry)) acc.push(full);
  }
  return acc;
}

function depName(ref) {
  const m = ref.match(/^@byronwade\/(.+)$/);
  return m ? m[1] : ref;
}

const registryPath = join(root, "registry.json");
const registry = JSON.parse(readFileSync(registryPath, "utf8"));
const items = registry.items ?? [];

if (!registry.name) fail("registry.json missing top-level `name`");
if (items.length === 0) fail("registry.json has no items");

// ── Unique names ────────────────────────────────────────────────────────────
const names = items.map((i) => i.name);
const dupes = names.filter((n, idx) => names.indexOf(n) !== idx);
if (dupes.length) fail(`Duplicate item names: ${[...new Set(dupes)].join(", ")}`);
const nameSet = new Set(names);

// ── Foundation ──────────────────────────────────────────────────────────────
const foundation = items.find((i) => i.name === "foundation");
if (!foundation) fail("Missing required `foundation` item");
else {
  if (foundation.type !== "registry:base") fail("foundation must have type registry:base");
  for (const key of ["light", "dark", "theme"]) {
    if (!foundation.cssVars?.[key]) fail(`foundation.cssVars missing \`${key}\``);
  }
}

// ── Per-item checks ───────────────────────────────────────────────────────────
const referencedPaths = new Set();
const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };

for (const item of items) {
  if (!item.name) fail("Item missing `name`");
  if (!item.type) fail(`${item.name}: missing \`type\``);

  const isPublic = ["registry:ui", "registry:component"].includes(item.type);
  if (isPublic) {
    if (!item.title) fail(`${item.name}: missing \`title\``);
    if (!item.description) fail(`${item.name}: missing \`description\``);
  }

  for (const dep of item.registryDependencies ?? []) {
    const resolved = depName(dep);
    if (!nameSet.has(resolved)) {
      fail(`${item.name}: registryDependency \`${dep}\` does not match any item name`);
    }
  }

  for (const dep of item.dependencies ?? []) {
    if (!allDeps[dep]) {
      warn(`${item.name}: npm dependency \`${dep}\` not found in package.json`);
    }
  }

  for (const f of item.files ?? []) {
    if (!f.path) {
      fail(`${item.name}: file entry missing \`path\``);
      continue;
    }
    if (!f.target) fail(`${item.name}: file \`${f.path}\` missing \`target\``);

    const src = join(root, f.path);
    referencedPaths.add(f.path);

    if (!existsSync(src)) {
      fail(`${item.name}: source file missing: ${f.path}`);
    }

    if (!f.path.startsWith("registry/")) {
      fail(`${item.name}: path must start with registry/: ${f.path}`);
    }

    const subdir = f.path.split("/")[1];
    if (item.type === "registry:ui" && subdir !== "ui" && subdir !== "lib") {
      // bloom ships a lib helper alongside ui — allowed
      if (!(subdir === "lib" && item.name === "bloom")) {
        // multi-file ui items may include lib helpers (bloom)
      }
    }
    if (item.type === "registry:component" && subdir !== "components") {
      fail(`${item.name}: component files must live under registry/components/: ${f.path}`);
    }
    if (item.type === "registry:lib" && subdir !== "lib") {
      fail(`${item.name}: lib files must live under registry/lib/: ${f.path}`);
    }

    if (item.type === "registry:ui" && !f.target.startsWith("components/ui/")) {
      if (!(f.target.startsWith("lib/") && item.name === "bloom")) {
        fail(`${item.name}: ui target should be components/ui/*: ${f.target}`);
      }
    }
    if (item.type === "registry:component" && !f.target.startsWith("components/")) {
      fail(`${item.name}: component target should be components/*: ${f.target}`);
    }
    if (item.type === "registry:lib" && !f.target.startsWith("lib/")) {
      fail(`${item.name}: lib target should be lib/*: ${f.target}`);
    }
  }
}

// ── Orphan files under registry/ ─────────────────────────────────────────────
const diskFiles = walkFiles(join(root, "registry")).map((p) =>
  relative(root, p).split("\\").join("/")
);
const orphans = diskFiles.filter((p) => !referencedPaths.has(p));
if (orphans.length) {
  fail(
    `Orphan files in registry/ (not listed in registry.json):\n${orphans.map((p) => `  - ${p}`).join("\n")}`
  );
}

// ── Built output (--built) ───────────────────────────────────────────────────
if (checkBuilt) {
  const outDir = join(root, "public/r");
  if (!existsSync(outDir)) {
    fail("public/r/ missing — run `npm run registry:build` first");
  } else {
    const built = readdirSync(outDir).filter((f) => f.endsWith(".json"));
    const expected = items.filter((i) => i.name !== "registry").map((i) => `${i.name}.json`);
    const builtSet = new Set(built);
    const missingBuilt = expected.filter((f) => !builtSet.has(f));
    const extraBuilt = built.filter((f) => !expected.includes(f) && f !== "registry.json");

    if (missingBuilt.length) {
      fail(`public/r/ missing built items:\n${missingBuilt.map((f) => `  - ${f}`).join("\n")}`);
    }
    if (extraBuilt.length) {
      warn(`public/r/ has unexpected files:\n${extraBuilt.map((f) => `  - ${f}`).join("\n")}`);
    }
  }
}

// ── Report ───────────────────────────────────────────────────────────────────
console.log(`check-registry: ${items.length} items, ${referencedPaths.size} source file(s)`);

if (warnings.length) {
  console.warn(`\nWarnings (${warnings.length}):`);
  for (const w of warnings) console.warn(`  ⚠ ${w}`);
}

if (errors.length) {
  console.error(`\nErrors (${errors.length}):`);
  for (const e of errors) console.error(`  ✗ ${e}`);
  console.error("\nFix registry.json or registry/ source files, then re-run.");
  process.exit(1);
}

console.log("✓ registry manifest is valid");
if (checkBuilt) console.log("✓ public/r/ build output matches manifest");

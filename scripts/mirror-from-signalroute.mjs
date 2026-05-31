// mirror-from-signalroute.mjs
// Pulls component source from SignalRoute (the canonical source of truth) into
// registry/ for each file-bearing item in registry.json.
//
// Mapping (registry path → SignalRoute origin):
//   registry/ui/<name>.tsx        ← <SR>/components/ui/<name>.tsx
//   registry/components/<name>.tsx ← <SR>/components/dashboard/<name>.tsx
//   registry/lib/<name>.ts         ← <SR>/lib/<name>.ts
//
// Key transform: @/components/dashboard/ → @/components/
//   (SR's house components import siblings as @/components/dashboard/<x>;
//    in the registry/consumer layout those live at components/<x>.)
//   @/components/ui/... and @/lib/... are left unchanged.
//
// foundation has no files (tokens only) — skipped automatically.
// registry.json (deps/metadata) and foundation tokens are HAND-MAINTAINED;
// this script only refreshes .tsx/.ts source files.
//
// Usage:
//   SIGNALROUTE_DIR=/path/to/signalroute node scripts/mirror-from-signalroute.mjs
//   (defaults to /Users/byronwade/signalroute)

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SR = process.env.SIGNALROUTE_DIR ?? "/Users/byronwade/signalroute";
const root = join(fileURLToPath(import.meta.url), "..", "..");

// Maps the registry sub-directory to its SignalRoute counterpart
const SUBDIR_MAP = {
  ui: "components/ui",
  components: "components/dashboard",
  lib: "lib",
};

const reg = JSON.parse(readFileSync(join(root, "registry.json"), "utf8"));

let mirrored = 0;
let skipped = 0;
const missing = [];

for (const item of reg.items) {
  for (const f of item.files ?? []) {
    // f.path looks like "registry/ui/gauge.tsx"  (always 3 parts)
    const parts = f.path.split("/"); // ["registry", subdir, ...filename]
    const subdir = parts[1];         // "ui" | "components" | "lib"
    const rest = parts.slice(2);     // ["gauge.tsx"]

    const srSubdir = SUBDIR_MAP[subdir];
    if (!srSubdir) {
      console.warn(`[mirror] Unknown subdir "${subdir}" in path "${f.path}" — skipping`);
      skipped++;
      continue;
    }

    const srPath = join(SR, srSubdir, ...rest);
    const destPath = join(root, f.path);

    if (!existsSync(srPath)) {
      console.warn(`[mirror] MISSING SR source: ${srPath} (registry-only — skipping)`);
      missing.push(srPath);
      skipped++;
      continue;
    }

    const original = readFileSync(srPath, "utf8");
    const rewritten = original.replaceAll("@/components/dashboard/", "@/components/");

    mkdirSync(dirname(destPath), { recursive: true });
    writeFileSync(destPath, rewritten, "utf8");
    mirrored++;
  }
}

console.log("");
console.log(`mirror-from-signalroute: ${mirrored} file(s) mirrored, ${skipped} skipped`);
if (missing.length > 0) {
  console.log(`  Missing SR sources (registry-only, not an error):`);
  for (const p of missing) console.log(`    ${p}`);
}
console.log("");
console.log("NOTE: registry.json (deps/metadata) and the foundation token layer are");
console.log("      hand-maintained. This script only refreshes component .tsx/.ts source.");
console.log("      Run `npm run registry:build` afterwards to rebuild public/r/.");

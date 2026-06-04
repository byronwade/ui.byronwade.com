#!/usr/bin/env node
// Generates public/llms.txt — an AI entry point listing every component type,
// its install command, and its addressable variants. Sourced from
// content/components.ts so it can never drift from the docs.
import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const { components, getVariants } = await import("../content/components.ts");
const SITE = "https://ui.byronwade.com";

const lines = [
  "# byronwade/ui",
  "",
  "> Token-driven shadcn registry. Install any component with the shadcn CLI; override --brand to re-skin the whole system. Each component exposes addressable, tagged variants.",
  "",
  "## Components",
  "",
];

for (const c of [...components].sort((a, b) => a.slug.localeCompare(b.slug))) {
  lines.push(`### ${c.name} (${c.category})`);
  lines.push(c.description);
  lines.push(`Install: \`npx shadcn@latest add @byronwade/${c.slug}\``);
  if ((c.variants?.length ?? 0) > 0) {
    lines.push("Variants:");
    for (const v of getVariants(c)) {
      lines.push(`- ${v.id} — ${v.name} [${v.tags.join(", ")}] ${SITE}/docs/${c.slug}#${v.id}`);
    }
  }
  lines.push("");
}

writeFileSync(join(root, "public/llms.txt"), lines.join("\n") + "\n");
console.log(`✓ llms.txt: ${components.length} components`);

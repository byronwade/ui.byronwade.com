#!/usr/bin/env node
// Generates packages/mcp/src/data.generated.json from registry.json + rule + component sources.
import { readFileSync, writeFileSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const registry = JSON.parse(readFileSync(join(root, "registry.json"), "utf8"))
const foundation = registry.items.find((i) => i.name === "foundation")

const { components: docs, getVariants } =
  await import("../content/components.ts")
const docBySlug = new Map(docs.map((d) => [d.slug, d]))

const componentTypes = new Set(["registry:ui", "registry:component"])
const components = registry.items
  .filter((i) => componentTypes.has(i.type))
  .map((i) => {
    const doc = docBySlug.get(i.name)
    return {
      name: i.name,
      type: i.type,
      description: i.description ?? "",
      group: doc?.category ?? "",
      tags: doc?.tags ?? [],
      deps: i.registryDependencies ?? [],
      install: `npx shadcn@latest add @byronwade/${i.name}`,
      variants: doc
        ? getVariants(doc).map((v) => ({
            id: v.id,
            name: v.name,
            tags: v.tags,
            install: v.install ?? `npx shadcn@latest add @byronwade/${i.name}`,
            deepLink: `/docs/${i.name}#${v.id}`,
          }))
        : [],
      source: (i.files ?? [])
        .map((f) => readFileSync(join(root, f.path), "utf8"))
        .join("\n\n"),
    }
  })
  .sort((a, b) => a.name.localeCompare(b.name))

const theme = foundation.cssVars.theme
const light = foundation.cssVars.light
const dark = foundation.cssVars.dark
const tokens = {}
for (const key of Object.keys(theme)) {
  if (!key.startsWith("color-")) continue
  const name = key.slice("color-".length)
  const l = light[name]
  if (typeof l === "string" && l.startsWith("oklch(")) {
    tokens[name] = { light: l, dark: dark[name] ?? l }
  }
}

const utilities = [
  ...Object.keys(foundation.css?.["@layer utilities"] ?? {}),
  ...Object.keys(foundation.css ?? {}).filter((k) => k.startsWith(".")),
]
  .map((s) => s.replace(/^\./, ""))
  .sort()

const rule = readFileSync(join(root, "registry/rules/byronwade-ui.mdc"), "utf8")

const data = { components, rule, tokens, utilities }
writeFileSync(
  join(root, "packages/mcp/src/data.generated.json"),
  JSON.stringify(data, null, 2) + "\n",
)
console.log(
  `✓ mcp data: ${components.length} components, ${Object.keys(tokens).length} tokens, ${utilities.length} utilities`,
)

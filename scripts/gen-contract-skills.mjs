#!/usr/bin/env node
/**
 * Generate per-contract skill packs + mirror into .cursor / .claude.
 * Source of truth: skills/{slug}/SKILL.md
 */
import { mkdir, writeFile, cp, rm } from "node:fs/promises"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")

const packs = {
  harbor: {
    specialty: "ops",
    specialtyName: "harbor-ops",
    specialtyTitle: "Harbor ops",
    specialtyDesc:
      "Dense indexes, semantic status chips, and calm admin detail for Harbor. Use when building ops lists or record workflows.",
    specialtyBody: `# Harbor ops

Harbor's signature skill — **indexes and status**, not cinema.

## Rules

1. Default recipe: \`list-resource\`.
2. Stable row height; mono IDs; semantic status chips.
3. Selected = \`bg-brand/10\` — never status-as-brand wash.
4. Own empty / loading / error on every index.
5. No full-bleed heroes, theater tone, or overlay stickers.
6. Detail: title → description → meta → actions.
7. Prove mentally against \`/harbor\` home demo rows.

## Done

- Matches \`contracts/harbor/DESIGN.md\`
- \`npm run check:design\` clean on touched files
`,
  },
  atlas: {
    specialty: "workbench",
    specialtyName: "atlas-workbench",
    specialtyTitle: "Atlas workbench",
    specialtyDesc:
      "Keyboard-first workbench chrome, command palette patterns, and mono metadata for Atlas.",
    specialtyBody: `# Atlas workbench

Atlas's signature skill — **tooling chrome**, not ops admin or essays.

## Rules

1. Mono for paths, hashes, tool names, durations, ports.
2. Keyboard-first: visible shortcuts; no hover-only critical actions.
3. Command palette / jump patterns over mega-nav.
4. Desktop density; quiet panels with \`edge\`.
5. Object-bound AI on files/tools/runs with \`data-provenance\`.
6. Cinema at most subtle — never Meridian theater as default.
7. Prove against \`/atlas\` workbench demo.

## Done

- Matches \`contracts/atlas/DESIGN.md\`
- Keyboard affordances present before visual polish
`,
  },
  vellum: {
    specialty: "reading",
    specialtyName: "vellum-reading",
    specialtyTitle: "Vellum reading",
    specialtyDesc:
      "Typeset presets, 65ch measure, and streaming-stable prose for Vellum docs and help.",
    specialtyBody: `# Vellum reading

Vellum's signature skill — **measured prose**, not dashboards.

## Rules

1. Pick \`typesetClass\` / \`reading-ui\` / \`reading-prose\` before styling tags.
2. Measure ~65ch; never exceed 80ch.
3. Docs/help = sans reading-ui; essays = reading-prose serif.
4. Streaming-stable — reserve space; no CLS on tokens.
5. Brand for links/CTA only — not paragraph color.
6. No activity pastels, Bionic Reading, or sepia gimmicks in prose.
7. Prove against \`/vellum\` reading demo.

## Done

- Matches \`contracts/vellum/DESIGN.md\`
- Long-form never ships as full-bleed \`text-sm\`
`,
  },
}

function skill(name, description, body) {
  return `---
name: ${name}
description: ${description}
---

${body.trim()}\n`
}

function themeBody(id, name) {
  return `# ${name} theme

Closed tokens for **${name}**. Prefer skills + CI; MCP \`apply_prefs\` is optional.

## Steps

1. Read \`contracts/${id}/DESIGN.md\` and \`docs/${id}.md\`.
2. Skin via \`data-contract="${id}"\` (this site) or \`CONTRACT_ID=${id}\` in consuming apps.
3. One accent → \`--brand\`. Never invent OKLCH literals in components.
4. Closed prefs only when needed (brand / radius / paper ids) — not layout/motion marketplaces.
5. Run \`npm run check:contrast\` after token edits.
6. Optional: contract MCP \`resolve_token\` / \`apply_prefs\`.

## Anti-patterns

- Second accent or status-as-brand
- hex / rgb / hsl / arbitrary color utilities
- Copying another contract's paper (warm cinema, ink workbench, mist reading) without switching DNA
`
}

function composeBody(id, name, specialty) {
  return `# ${name} compose

Compose product wholes from **shadcn primitives** under ${name} DNA.

## Required loop (fail closed)

1. Load \`contracts/${id}/DESIGN.md\` + \`AGENTS.md\`.
2. Open this skill + \`${id}-${specialty}\`.
3. Prefer a task recipe over freeform layout.
4. \`list\` approved primitives — install missing via \`npx shadcn@latest add …\`.
5. Remap icons to \`@/lib/icons\`.
6. Compose under closed tokens (\`bg-*\`, \`edge\`, \`depth-*\`, radius intents).
7. **Done only when** \`npm run check:design\` (and platform/contrast as needed) is green.
8. Optional: MCP \`get_contract\` → \`validate_ui\` if the session is tool-wired.

## Anatomy

\`\`\`
Surface [data-contract="${id}"]
├─ quiet chrome
├─ main (recipe-driven)
└─ optional object-bound AI rail
\`\`\`

## Done

- Reused primitives — no twin Button/Card/shell
- Matches ${name} MUST / MUST NOT
- Gates green
`
}

function surfaceBody(id, name) {
  return `# ${name} surface

Density lanes for ${name}.

## Rules

1. Set \`data-surface\` (\`application\` | \`desktop\` | \`marketing\` | \`mobile\`) intentionally.
2. ${name} defaults: see \`docs/${id}.md\` density line.
3. Do not mix reading-lane measure with dense ops rows in the same band.
4. Marketing surface is secondary — never the default for app work.

## Done

- Surface matches the task
- No accidental marketing density on app indexes
`
}

function a11yBody(id, name) {
  return `# ${name} a11y

Accessibility checklist for ${name}.

## Rules

1. WCAG AA body contrast — \`npm run check:contrast\` includes \`${id}\` skin.
2. Labels on every field; \`aria-*\` preserved on primitives.
3. Keyboard path for every critical action.
4. Focus visible: \`ring-ring\` / focus-visible styles.
5. Do not rely on color alone for status — pair with text/chip labels.
6. Streaming UI (Vellum) must not trap focus or jump scroll unexpectedly.

## Done

- Contrast gate green for ${id}
- Keyboard + labels verified on new surfaces
`
}

const ids = Object.keys(packs)

for (const id of ids) {
  const meta = packs[id]
  const name = id[0].toUpperCase() + id.slice(1)
  const skills = [
    [
      `${id}-theme`,
      `Theme tokens and closed prefs for ${name}. Use when changing brand, paper, or radius under ${name}.`,
      themeBody(id, name),
    ],
    [
      `${id}-compose`,
      `Compose ${name} product UI from shadcn primitives with fail-closed gates. Use when building screens.`,
      composeBody(id, name, meta.specialty),
    ],
    [
      meta.specialtyName,
      meta.specialtyDesc,
      meta.specialtyBody,
    ],
    [
      `${id}-surface`,
      `Density and data-surface lanes for ${name}.`,
      surfaceBody(id, name),
    ],
    [
      `${id}-a11y`,
      `Accessibility and contrast checklist for ${name}.`,
      a11yBody(id, name),
    ],
  ]

  for (const [slug, desc, body] of skills) {
    const dir = join(ROOT, "skills", slug)
    await mkdir(dir, { recursive: true })
    await writeFile(join(dir, "SKILL.md"), skill(slug, desc, body))
    console.log("wrote", slug)
  }
}

// Mirror all skills/* into .cursor and .claude
async function mirror(target) {
  const skillsRoot = join(ROOT, "skills")
  const { readdir } = await import("node:fs/promises")
  const dirs = await readdir(skillsRoot, { withFileTypes: true })
  for (const d of dirs.filter((x) => x.isDirectory())) {
    const from = join(skillsRoot, d.name)
    const to = join(ROOT, target, "skills", d.name)
    await rm(to, { recursive: true, force: true })
    await cp(from, to, { recursive: true })
  }
  console.log("mirrored →", target)
}

await mirror(".cursor")
await mirror(".claude")
console.log("gen-contract-skills OK")

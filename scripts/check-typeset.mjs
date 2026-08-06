#!/usr/bin/env node
/**
 * Ensures shadcn/typeset is owned, imported, and frozen in grammar.
 * Agents pick presets — they do not invent per-tag type soup.
 */
import { readFile } from "node:fs/promises"
import { join } from "node:path"

const ROOT = process.cwd()
const hits = []

async function read(rel) {
  return readFile(join(ROOT, rel), "utf8")
}

const globals = await read("app/globals.css")
const typesetCss = await read("app/typeset.css")
const typesetTs = await read("lib/design/typeset.ts")
const markdown = await read("components/docs/markdown-body.tsx")
const index = await read("lib/design/index.ts")
const recipes = await read("lib/design/recipes.ts")

if (!globals.includes('@import "./typeset.css"') && !globals.includes("@import './typeset.css'")) {
  hits.push('globals.css: must @import "./typeset.css" after shadcn/tailwind')
}

for (const token of [
  "--typeset-size",
  "--typeset-leading",
  "--typeset-flow",
  ".typeset-docs",
  ".typeset-chat",
  ".typeset-reading",
  ".typeset-compact",
  "margin-block-start",
  "not-typeset",
]) {
  if (!typesetCss.includes(token)) {
    hits.push(`typeset.css: missing ${token}`)
  }
}

for (const id of [
  "export const typesetPresets",
  "export const typesetRhythm",
  "export const typesetLaws",
  "export function typesetClass",
]) {
  if (!typesetTs.includes(id)) {
    hits.push(`typeset.ts: missing ${id}`)
  }
}

if (!typesetTs.includes("docs") || !typesetTs.includes("chat") || !typesetTs.includes("reading") || !typesetTs.includes("compact")) {
  hits.push("typeset.ts: must freeze docs/chat/reading/compact presets")
}

if (!index.includes('export * from "@/lib/design/typeset"') && !index.includes("from '@/lib/design/typeset'")) {
  hits.push("lib/design/index.ts: must re-export typeset")
}

if (!markdown.includes("typesetClass") || !markdown.includes("ReactMarkdown")) {
  hits.push("markdown-body.tsx: must render via ReactMarkdown under typesetClass")
}

if (/className="text-\[/.test(markdown) || /className=\{cn\("mt-/.test(markdown)) {
  hits.push("markdown-body.tsx: per-tag type soup banned — typeset owns rhythm")
}

if (!recipes.includes("typesetPresets") || !recipes.includes("typesetLaws")) {
  hits.push("recipes.ts zones.frozen: must include typesetPresets + typesetLaws")
}

if (hits.length === 0) {
  console.log(
    "check:typeset OK — owned CSS, frozen presets, MarkdownBody on typeset",
  )
  process.exit(0)
}

console.error(`check:typeset FAILED — ${hits.length} issue(s)\n`)
for (const hit of hits) console.error(`  ${hit}`)
process.exit(1)

#!/usr/bin/env node
/**
 * Route parity gate.
 *
 * Every nav link a contract renders must resolve to a real route file, and
 * every route slot the platform declares must be served for the contracts
 * that claim it. Before this gate existed, three of four contracts rendered
 * Design / Skills / System in the primary nav and every one of them 404'd,
 * plus all four machine-doc URLs were missing — because the previous checks
 * only grepped source strings and never enumerated the route tree.
 *
 * Exit 1 on any contract whose declared surface does not exist on disk.
 */
import { readdir, readFile } from "node:fs/promises"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")
const APP = join(ROOT, "app")
const hits = []

/** Parse ROUTE_SLOTS out of the skeleton without a TS build step. */
const skeleton = await readFile(join(ROOT, "lib/platform/skeleton.ts"), "utf8")
const slotBlock = skeleton.match(/export const ROUTE_SLOTS = \[([\s\S]*?)\] as const/)
if (!slotBlock) {
  console.error("check:routes FAILED — cannot read ROUTE_SLOTS from skeleton.ts")
  process.exit(1)
}
const slots = [...slotBlock[1].matchAll(
  /\{\s*segment:\s*"([^"]*)",\s*label:\s*"([^"]+)",\s*nav:\s*(true|false),\s*scope:\s*"([^"]+)"/g,
)].map((m) => ({ segment: m[1], label: m[2], nav: m[3] === "true", scope: m[4] }))

if (slots.length === 0) hits.push("skeleton.ts: ROUTE_SLOTS did not parse")

/** Contract ids + what each declares as authored. */
const dnaDir = join(ROOT, "lib/contracts/dna")
const contracts = []
for (const file of (await readdir(dnaDir)).filter(
  (f) => f.endsWith(".ts") && !["index.ts", "types.ts"].includes(f),
)) {
  const src = await readFile(join(dnaDir, file), "utf8")
  const id = src.match(/id:\s*"([^"]+)"/)?.[1]
  if (!id) continue
  const authoredBlock = src.match(/authored:\s*\[([\s\S]*?)\]/)
  const authored = authoredBlock
    ? [...authoredBlock[1].matchAll(/"([^"]+)"/g)].map((m) => m[1])
    : []
  contracts.push({ id, authored })
}

async function exists(path) {
  try {
    await readFile(path)
    return true
  } catch {
    return false
  }
}

/** A segment resolves via a static tree, the dynamic tree, or a route handler. */
async function segmentResolves(id, segment) {
  const candidates = segment
    ? [
        join(APP, id, segment, "page.tsx"),
        join(APP, id, segment, "route.ts"),
        join(APP, "[contract]", segment, "page.tsx"),
        join(APP, "[contract]", segment, "route.ts"),
      ]
    : [join(APP, id, "page.tsx"), join(APP, "[contract]", "page.tsx")]
  for (const c of candidates) if (await exists(c)) return true
  return false
}

for (const { id, authored } of contracts) {
  for (const slot of slots) {
    const claimed = slot.scope === "all" || authored.includes(slot.segment)
    const resolves = await segmentResolves(id, slot.segment)
    const label = `/${id}${slot.segment ? `/${slot.segment}` : ""}`

    if (claimed && !resolves) {
      hits.push(
        `${label}: claimed (scope=${slot.scope}${
          slot.nav ? ", in nav" : ""
        }) but no page.tsx / route.ts resolves it`,
      )
    }
    /* A route that exists but is not claimed is dead surface, not a 404 —
       still worth failing: it means nav and the tree disagree. */
    if (!claimed && (await exists(join(APP, id, slot.segment, "page.tsx")))) {
      hits.push(
        `${label}: route file exists but DNA does not declare "${slot.segment}" as authored`,
      )
    }
  }

  /* Machine files are the platform's promise to agents. */
  const machine = skeleton.match(/export const MACHINE_FILES = \[([\s\S]*?)\] as const/)
  const files = machine
    ? [...machine[1].matchAll(/"([^"]+)"/g)].map((m) => m[1])
    : []
  const authorsDocs = authored.length > 0
  for (const file of files) {
    const resolves =
      (await exists(join(APP, id, file, "route.ts"))) ||
      (await exists(join(APP, "[contract]", file, "route.ts")))
    if (authorsDocs && !resolves) {
      hits.push(`/${id}/${file}: MACHINE_FILES promises it, no route serves it`)
    }
  }
}

/*
 * Rendered-link parity. The declared surface can be correct while a component
 * still links somewhere that does not exist — that is how /harbor/for-agents
 * survived: nav was fixed, but the install panel and footer still advertised
 * it. Crawl only when a server is running; skip cleanly otherwise so the gate
 * stays usable offline and in CI without a build.
 */
const BASE = process.env.CHECK_ROUTES_BASE ?? "http://localhost:3000"
let crawled = 0
async function head(url) {
  try {
    const res = await fetch(url, { redirect: "manual" })
    return res.status
  } catch {
    return null
  }
}
if ((await head(BASE)) !== null) {
  const seen = new Set()
  for (const { id, authored } of contracts) {
    for (const seg of ["", "install", "ui", "theme", "surfaces", ...authored]) {
      const page = `${BASE}/${id}${seg ? `/${seg}` : ""}`
      let html
      try {
        const res = await fetch(page)
        if (!res.ok) continue
        html = await res.text()
      } catch {
        continue
      }
      for (const m of html.matchAll(/href="(\/[^"#?]*)"/g)) {
        const href = m[1]
        if (seen.has(href)) continue
        seen.add(href)
        const status = await head(`${BASE}${href}`)
        crawled++
        if (status !== null && status >= 400) {
          hits.push(`${href}: linked from ${page} but returns ${status}`)
        }
      }
    }
  }
} else {
  console.warn(
    `check:routes — no server at ${BASE}, skipped rendered-link crawl (static parity still checked)`,
  )
}

if (hits.length === 0) {
  const authored = contracts.filter((c) => c.authored.length > 0).length
  console.log(
    `check:routes OK — ${contracts.length} contracts × ${slots.length} slots; ` +
      `${authored} authoring machine docs; ${crawled} rendered links checked`,
  )
  process.exit(0)
}

console.error(`check:routes FAILED — ${hits.length} parity break(s)\n`)
for (const h of hits) console.error(`  ${h}`)
process.exit(1)

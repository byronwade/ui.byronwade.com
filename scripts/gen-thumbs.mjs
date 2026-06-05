#!/usr/bin/env node
/**
 * Generates catalog thumbnails: screenshots each /preview/components/<slug> into
 * public/thumbs/<slug>.png with Playwright. Requires the app server running.
 *
 *   node --import tsx scripts/gen-thumbs.mjs                 # all components
 *   THUMB_ONLY=button,card,chart node --import tsx scripts/gen-thumbs.mjs
 *   BASE_URL=http://localhost:3000 node --import tsx scripts/gen-thumbs.mjs
 *
 * The cards display these as <img>, so the catalog executes zero components.
 */
import { chromium } from "playwright"
import { mkdirSync, statSync, rmSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const BASE = process.env.BASE_URL ?? "http://localhost:3000"
const OUT = join(root, "public/thumbs")
const WAIT = Number(process.env.THUMB_WAIT ?? 1200) // settle time (charts/motion/React Flow)
const MIN_BYTES = Number(process.env.THUMB_MIN ?? 8000) // below this = effectively blank → skip (clean split: ~7K blank vs ~9K+ real)
mkdirSync(OUT, { recursive: true })

const { components } = await import("../content/components.ts")
const only = process.env.THUMB_ONLY?.split(",").map((s) => s.trim())
const list = only ? components.filter((c) => only.includes(c.slug)) : components

// 4:3 logical canvas matching the card; 2x for crisp text.
const W = 720
const H = 540

const browser = await chromium.launch()
const page = await browser.newPage({
  viewport: { width: W, height: H },
  deviceScaleFactor: 2,
})

let ok = 0
const failed = []
const blank = []
for (const c of list) {
  const url = `${BASE}/preview/components/${c.slug}`
  const file = join(OUT, `${c.slug}.png`)
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 20000 })
    await page.waitForTimeout(WAIT) // let charts / motion / React Flow settle
    await page.screenshot({
      path: file,
      clip: { x: 0, y: 0, width: W, height: H },
    })
    // A near-empty capture (component that can't preview — empty React Flow,
    // device frame, etc.) is removed so the card falls back to its seeded mark.
    if (statSync(file).size < MIN_BYTES) {
      rmSync(file)
      blank.push(c.slug)
      process.stdout.write("·")
    } else {
      ok++
      process.stdout.write(".")
    }
  } catch (e) {
    failed.push(c.slug)
    process.stdout.write("x")
  }
}
await browser.close()
console.log(
  `\n✓ thumbs: ${ok} ok` +
    (blank.length
      ? `, ${blank.length} blank→fallback: ${blank.join(", ")}`
      : "") +
    (failed.length ? `, ${failed.length} failed: ${failed.join(", ")}` : ""),
)

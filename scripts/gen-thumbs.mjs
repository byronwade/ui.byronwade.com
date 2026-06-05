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
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const OUT = join(root, "public/thumbs");
mkdirSync(OUT, { recursive: true });

const { components } = await import("../content/components.ts");
const only = process.env.THUMB_ONLY?.split(",").map((s) => s.trim());
const list = only ? components.filter((c) => only.includes(c.slug)) : components;

// 4:3 logical canvas matching the card; 2x for crisp text.
const W = 720;
const H = 540;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 2 });

let ok = 0;
const failed = [];
for (const c of list) {
  const url = `${BASE}/preview/components/${c.slug}`;
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 20000 });
    await page.waitForTimeout(800); // let charts / motion / fonts settle
    await page.screenshot({ path: join(OUT, `${c.slug}.png`), clip: { x: 0, y: 0, width: W, height: H } });
    ok++;
    process.stdout.write(".");
  } catch (e) {
    failed.push(c.slug);
    process.stdout.write("x");
  }
}
await browser.close();
console.log(`\n✓ thumbs: ${ok} ok${failed.length ? `, ${failed.length} failed: ${failed.join(", ")}` : ""}`);

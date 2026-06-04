import { readFileSync, readdirSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import type { Prompt } from "./types.js";

const PROMPTS_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "prompts");

export function loadPrompts(dir: string = PROMPTS_DIR): Prompt[] {
  return readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .sort()
    .map((f) => ({ name: basename(f, ".md"), text: readFileSync(join(dir, f), "utf8").trim() }));
}

export function hashPrompts(prompts: Prompt[]): string {
  const h = createHash("sha256");
  for (const p of prompts) h.update(p.name).update("\0").update(p.text).update("\0");
  return h.digest("hex").slice(0, 12);
}

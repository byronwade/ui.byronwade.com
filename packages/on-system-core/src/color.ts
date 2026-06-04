import { parse as parseColor, differenceEuclidean } from "culori";

const HEX = /#[0-9a-fA-F]{3,8}\b/;
const FUNC = /\b(?:rgb|rgba|hsl|hsla)\s*\([^)]*\)/;
const NAMED = new Set([
  "red","green","blue","white","black","gray","grey","yellow","orange","purple",
  "pink","cyan","magenta","lime","teal","navy","maroon","olive","silver","gold",
  "indigo","violet","brown","beige","coral","crimson","salmon","khaki","tomato",
]);

/** Returns the first raw-color substring in `text`, or null. Ignores var(--token) and on-scale words. */
export function findRawColor(text: string): string | null {
  const hex = text.match(HEX); if (hex) return hex[0];
  const fn = text.match(FUNC); if (fn) return fn[0];
  for (const word of text.toLowerCase().match(/[a-z]+/g) ?? [])
    if (NAMED.has(word)) return word;
  return null;
}

const diff = differenceEuclidean("oklab");

export interface NearestResult { token: string; distance: number; }

/** Nearest color token by oklab distance, or null if none within maxDistance. */
export function nearestToken(
  raw: string,
  candidates: Record<string, { light: string; dark: string }>,
  maxDistance: number
): NearestResult | null {
  const c = parseColor(raw);
  if (!c) return null;
  let best: string | null = null;
  let bestD = Infinity;
  for (const [name, val] of Object.entries(candidates)) {
    const tLight = parseColor(val.light);
    const tDark = parseColor(val.dark);
    const dLight = tLight ? diff(c, tLight) : Infinity;
    const dDark = tDark ? diff(c, tDark) : Infinity;
    const d = Math.min(dLight, dDark);
    if (d < bestD) { bestD = d; best = name; }
  }
  if (best === null || bestD > maxDistance) return null;
  return { token: best, distance: bestD };
}

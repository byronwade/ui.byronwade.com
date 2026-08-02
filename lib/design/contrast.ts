/**
 * Frozen contrast contract — agents must audit these pairs.
 * Enforced by `npm run check:contrast` (WCAG AA ≥ 4.5:1 body).
 *
 * Colors are strict OKLCH in `app/globals.css`. Theater stages lift
 * `--brand` so links/fills stay readable on `--dock`.
 */

export const contrastLaws = {
  /** Color tokens must be `oklch(...)` or `var(--token)` — never hex/rgb/hsl. */
  colorSpace: "oklch" as const,
  /** Body text / UI chrome target. */
  wcagBody: 4.5 as const,
  /** Large text / display (≥18pt / 14pt bold). */
  wcagLarge: 3 as const,
  /** Prefer semantic muted tokens over opacity on foreground. */
  noForegroundOpacity: true,
  /** Theater (`data-tone="theater"`) must lift brand for dock contrast. */
  theaterBrandLift: true,
} as const

/** Canonical pairs the reviewer must check after any token change. */
export const contrastPairs = [
  { fg: "foreground", bg: "background", context: "paper body" },
  { fg: "muted-foreground", bg: "background", context: "paper secondary" },
  { fg: "brand", bg: "background", context: "paper link" },
  { fg: "brand-foreground", bg: "brand", context: "on-brand fill" },
  { fg: "dock-foreground", bg: "dock", context: "theater body" },
  { fg: "dock-muted", bg: "dock", context: "theater secondary" },
  { fg: "brand", bg: "dock", context: "theater link (lifted brand)" },
] as const

export type ContrastPair = (typeof contrastPairs)[number]

/**
 * Closed theme knob presets — the only live reskin values agents may offer.
 * Playgrounds import these; never invent new OKLCH literals at call sites.
 */

export const brandPresets = [
  {
    id: "teal",
    label: "Ink teal",
    brand: "oklch(0.42 0.09 200)",
    brandFg: "oklch(0.97 0.01 85)",
    brandMuted: "oklch(0.93 0.03 200)",
    accent: "oklch(0.93 0.02 200)",
  },
  {
    id: "slate",
    label: "Slate",
    brand: "oklch(0.42 0.08 250)",
    brandFg: "oklch(0.97 0.01 85)",
    brandMuted: "oklch(0.93 0.03 250)",
    accent: "oklch(0.93 0.02 250)",
  },
  {
    id: "moss",
    label: "Moss",
    brand: "oklch(0.42 0.08 155)",
    brandFg: "oklch(0.97 0.01 85)",
    brandMuted: "oklch(0.93 0.03 155)",
    accent: "oklch(0.93 0.02 155)",
  },
  {
    id: "wine",
    label: "Wine",
    brand: "oklch(0.42 0.09 15)",
    brandFg: "oklch(0.97 0.01 85)",
    brandMuted: "oklch(0.93 0.03 15)",
    accent: "oklch(0.93 0.02 15)",
  },
] as const

export type BrandPresetId = (typeof brandPresets)[number]["id"]
export type BrandPreset = (typeof brandPresets)[number]

export const radiusPresets = [
  { id: "compact", label: "Compact", value: "0.375rem" },
  { id: "default", label: "Default", value: "0.5rem" },
  { id: "soft", label: "Soft", value: "0.75rem" },
] as const

export type RadiusPresetId = (typeof radiusPresets)[number]["id"]
export type RadiusPreset = (typeof radiusPresets)[number]

export const paperPresets = [
  {
    id: "warm",
    label: "Warm paper",
    background: "oklch(0.965 0.01 72)",
    foreground: "oklch(0.28 0.02 55)",
    card: "oklch(0.98 0.008 72)",
  },
  {
    id: "cool",
    label: "Cool paper",
    background: "oklch(0.96 0.01 230)",
    foreground: "oklch(0.28 0.02 240)",
    card: "oklch(0.98 0.008 230)",
  },
  {
    id: "night",
    label: "Night",
    background: "oklch(0.22 0.016 50)",
    foreground: "oklch(0.94 0.01 75)",
    card: "oklch(0.27 0.016 50)",
  },
] as const

export type PaperPresetId = (typeof paperPresets)[number]["id"]
export type PaperPreset = (typeof paperPresets)[number]

/** Default playground selection — compact radius = Cursor-like control dialect. */
export const knobDefaults = {
  brand: "teal",
  radius: "compact",
  paper: "warm",
} as const satisfies {
  brand: BrandPresetId
  radius: RadiusPresetId
  paper: PaperPresetId
}

export function getBrandPreset(id: BrandPresetId): BrandPreset {
  const found = brandPresets.find((p) => p.id === id)
  return found ?? brandPresets[0]
}

export function getRadiusPreset(id: RadiusPresetId): RadiusPreset {
  const found = radiusPresets.find((p) => p.id === id)
  return found ?? radiusPresets[1]
}

export function getPaperPreset(id: PaperPresetId): PaperPreset {
  const found = paperPresets.find((p) => p.id === id)
  return found ?? paperPresets[0]
}

/** Scoped CSS vars a playground may write onto a proof root. */
export function knobStyleVars(input: {
  brand: BrandPreset
  radius: RadiusPreset
  paper: PaperPreset
}): Record<string, string> {
  return {
    "--brand": input.brand.brand,
    "--brand-foreground": input.brand.brandFg,
    "--brand-muted": input.brand.brandMuted,
    "--accent": input.brand.accent,
    "--primary": input.brand.brand,
    "--primary-foreground": input.brand.brandFg,
    "--ring": input.brand.brand,
    "--success": input.brand.brand,
    "--chart-1": input.brand.brand,
    "--sidebar-primary": input.brand.brand,
    "--sidebar-ring": input.brand.brand,
    "--background": input.paper.background,
    "--foreground": input.paper.foreground,
    "--card": input.paper.card,
    "--card-foreground": input.paper.foreground,
    "--popover": input.paper.card,
    "--popover-foreground": input.paper.foreground,
    "--radius": input.radius.value,
  }
}

/**
 * Closed consumer prefs — the only theme tweaks users/agents may set.
 *
 * Layout shells, density, and motion are NOT prefs (laws / recipes).
 * Prefs = brand · radius · paper preset IDs only. Fail closed on freeform OKLCH.
 */

import {
  brandPresets,
  getBrandPreset,
  getPaperPreset,
  getRadiusPreset,
  knobDefaults,
  knobStyleVars,
  paperPresets,
  radiusPresets,
  type BrandPresetId,
  type PaperPresetId,
  type RadiusPresetId,
} from "@/lib/design/knobs"

export const PREFS_FILE = "app/contract-prefs.css" as const
export const PREFS_JSON_FILE = "contract.prefs.json" as const

export type ContractPrefs = {
  contractId: string
  brand: BrandPresetId
  radius: RadiusPresetId
  paper: PaperPresetId
  /** Optional default density lane — still a closed surface id. */
  surface?: "application" | "marketing" | "mobile" | "desktop"
}

export type PrefsCatalog = {
  brand: readonly { id: BrandPresetId; label: string }[]
  radius: readonly { id: RadiusPresetId; label: string }[]
  paper: readonly { id: PaperPresetId; label: string }[]
  defaults: typeof knobDefaults
  notPrefs: readonly string[]
}

export const prefsNotAllowed = [
  "Freeform hex / OKLCH color pickers",
  "Second brand accent",
  "Layout builders or preferred-layout marketplaces",
  "Animation catalogs as user settings",
  "Per-component theme overrides",
] as const

export function prefsCatalog(): PrefsCatalog {
  return {
    brand: brandPresets.map((p) => ({ id: p.id, label: p.label })),
    radius: radiusPresets.map((p) => ({ id: p.id, label: p.label })),
    paper: paperPresets.map((p) => ({ id: p.id, label: p.label })),
    defaults: knobDefaults,
    notPrefs: prefsNotAllowed,
  }
}

export function parsePrefs(input: unknown): {
  ok: boolean
  prefs?: ContractPrefs
  hits: { ban: string; fix: string }[]
} {
  const hits: { ban: string; fix: string }[] = []
  if (!input || typeof input !== "object") {
    return {
      ok: false,
      hits: [{ ban: "invalid-prefs", fix: "Pass an object with brand/radius/paper ids" }],
    }
  }
  const raw = input as Record<string, unknown>
  const contractId =
    typeof raw.contractId === "string" && raw.contractId
      ? raw.contractId
      : "meridian"

  const brand = String(raw.brand ?? knobDefaults.brand)
  const radius = String(raw.radius ?? knobDefaults.radius)
  const paper = String(raw.paper ?? knobDefaults.paper)

  if (!brandPresets.some((p) => p.id === brand)) {
    hits.push({
      ban: "unknown-brand",
      fix: `Use brand: ${brandPresets.map((p) => p.id).join(" | ")}`,
    })
  }
  if (!radiusPresets.some((p) => p.id === radius)) {
    hits.push({
      ban: "unknown-radius",
      fix: `Use radius: ${radiusPresets.map((p) => p.id).join(" | ")}`,
    })
  }
  if (!paperPresets.some((p) => p.id === paper)) {
    hits.push({
      ban: "unknown-paper",
      fix: `Use paper: ${paperPresets.map((p) => p.id).join(" | ")}`,
    })
  }

  let surface: ContractPrefs["surface"]
  if (raw.surface !== undefined) {
    const s = String(raw.surface)
    if (!["application", "marketing", "mobile", "desktop"].includes(s)) {
      hits.push({
        ban: "unknown-surface",
        fix: "surface?: application | marketing | mobile | desktop",
      })
    } else {
      surface = s as ContractPrefs["surface"]
    }
  }

  // Reject freeform color fields if someone tries
  for (const key of Object.keys(raw)) {
    if (
      ![
        "contractId",
        "brand",
        "radius",
        "paper",
        "surface",
      ].includes(key)
    ) {
      hits.push({
        ban: "unknown-pref-key",
        fix: `Remove "${key}" — only closed preset ids are allowed`,
      })
    }
  }

  if (hits.length) return { ok: false, hits }

  return {
    ok: true,
    prefs: {
      contractId,
      brand: brand as BrandPresetId,
      radius: radius as RadiusPresetId,
      paper: paper as PaperPresetId,
      ...(surface ? { surface } : {}),
    },
    hits: [],
  }
}

/** Emit a paste-ready CSS override file from closed prefs. */
export function prefsToCss(prefs: ContractPrefs): string {
  const vars = knobStyleVars({
    brand: getBrandPreset(prefs.brand),
    radius: getRadiusPreset(prefs.radius),
    paper: getPaperPreset(prefs.paper),
  })
  const lines = Object.entries(vars).map(([k, v]) => `  ${k}: ${v};`)
  const colorScheme = prefs.paper === "night" ? "dark" : "light"
  return `/* contract-prefs — generated from closed preset ids. Do not invent OKLCH here.
 * contractId=${prefs.contractId} brand=${prefs.brand} radius=${prefs.radius} paper=${prefs.paper}
 * Re-apply via MCP apply_prefs. Layout/motion are laws, not prefs.
 */
:root {
  color-scheme: ${colorScheme};
${lines.join("\n")}
}
`
}

export function prefsToJson(prefs: ContractPrefs): string {
  return `${JSON.stringify(prefs, null, 2)}\n`
}

export function applyPrefsResult(input: unknown) {
  const parsed = parsePrefs(input)
  if (!parsed.ok || !parsed.prefs) {
    return {
      ok: false as const,
      hits: parsed.hits,
      next: "Fix unknown ids, then call apply_prefs again.",
      catalog: prefsCatalog(),
    }
  }
  const css = prefsToCss(parsed.prefs)
  const json = prefsToJson(parsed.prefs)
  return {
    ok: true as const,
    prefs: parsed.prefs,
    files: {
      css: { path: PREFS_FILE, contents: css },
      json: { path: PREFS_JSON_FILE, contents: json },
    },
    importHint: `Import in your global CSS: @import "./contract-prefs.css"; (or paste :root block into globals.css)`,
    instruction:
      "Write the CSS file, keep JSON next to the project for agents, then validate_ui on any new classNames. Do not invent colors outside these presets.",
    catalog: prefsCatalog(),
  }
}

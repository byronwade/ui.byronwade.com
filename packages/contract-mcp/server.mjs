#!/usr/bin/env node
/**
 * Lightweight design-contract MCP — consistency kit only.
 *
 * Exists so agents stay consistent: closed tokens, bans, primitives, recipes.
 * CONTRACT_ID selects DNA (default: meridian). Tool names are platform-locked.
 *
 * Tools: get_contract · resolve_token · validate_ui · list_primitives · get_recipe
 */

import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"
import { createInterface } from "node:readline"

import { lintSource, mechanicalBans } from "../../lib/design/bans.mjs"

const CONTRACT_ID = (process.env.CONTRACT_ID ?? "meridian").toLowerCase()
const SITE = process.env.CONTRACT_SITE ?? "https://ui.byronwade.com"
const CONTRACT_URL =
  process.env.CONTRACT_URL ?? `${SITE}/r/${CONTRACT_ID}.contract.json`

const MCP_TOOLS = [
  "get_contract",
  "resolve_token",
  "validate_ui",
  "list_primitives",
  "get_recipe",
]

/** Embedded fallback — keep in sync with lib/platform/consistency.ts via gen:contract */
const FALLBACK_MANDATE = {
  purpose:
    "Keep application UI consistent across the product. Creativity is content + composition — never new tokens, shadows, or twin components.",
  beforeUi: [
    "Call get_contract and obey must / mustNot",
    "Resolve colors/radii/depths only via resolve_token (closed set)",
    "Compose only list_primitives — never fork Button/Card/shell twins",
    "Pick a get_recipe intent when the surface matches",
  ],
  beforeDone: [
    "Run validate_ui on every new className / snippet",
    "Own empty, loading, and error on resource surfaces",
    "Selected rows/items use bg-brand/10",
    "Icons only from @/lib/icons",
    "Depth only via edge / depth-*",
  ],
  must: [
    "OKLCH semantic tokens only",
    "One accent → --brand (selected = bg-brand/10)",
    "Closed radii: pill/control full · input lg · panel 2xl · shell 3xl",
    "data-surface for density",
    "Object-bound AI with outcome-then-trace",
    "Same MCP tools on every design contract",
  ],
  mustNot: [
    "Invent hex / rgb / hsl / arbitrary colors",
    "Use Tailwind shadow-*",
    "Import lucide-react directly",
    "Second brand accent",
    "font-bold on display headings",
    "Twin components or bespoke shells",
    "Fork MCP tools for one contract only",
  ],
}

const FALLBACK_TOKENS = {
  colorRoles: [
    "background",
    "foreground",
    "card",
    "popover",
    "primary",
    "secondary",
    "muted",
    "accent",
    "destructive",
    "warning",
    "success",
    "brand",
    "brand-muted",
    "border",
    "input",
    "ring",
    "dock",
    "sidebar",
  ],
  radiusIntents: {
    control: "rounded-full",
    pill: "rounded-full",
    input: "rounded-lg",
    panel: "rounded-2xl",
    shell: "rounded-3xl",
  },
  depthIntents: [
    "depth-none",
    "depth-soft",
    "depth-raised",
    "depth-100",
    "depth-300",
    "depth-400",
    "depth-600",
  ],
  surfaces: ["application", "marketing", "mobile", "desktop"],
}

const FALLBACK_PRIMITIVES = [
  "button",
  "input",
  "textarea",
  "select",
  "checkbox",
  "switch",
  "table",
  "card",
  "dialog",
  "sheet",
  "tabs",
  "tooltip",
  "dropdown-menu",
  "sonner",
  "separator",
  "badge",
]

const FALLBACK_RECIPES = [
  {
    id: "list-resource",
    must: ["stable row height", "mono metadata", "empty/loading/error", "bg-brand/10 selected"],
    never: ["marketing cards for rows", "raw hex", "shadow-*"],
  },
  {
    id: "agent-rail",
    must: ["outcome-then-trace", "data-provenance", "bg-activity-* for verbs only"],
    never: ["activity as brand", "hidden errors"],
  },
  {
    id: "empty-recovery",
    must: ["role=alert on errors", "one clear CTA"],
    never: ["illustration zoo", "multiple competing CTAs"],
  },
]

let cached = null

async function loadKit() {
  if (cached) return cached
  try {
    const res = await fetch(CONTRACT_URL, {
      headers: { Accept: "application/json" },
    })
    if (res.ok) {
      cached = await res.json()
      return cached
    }
  } catch {
    /* offline */
  }
  try {
    const here = dirname(fileURLToPath(import.meta.url))
    cached = JSON.parse(
      readFileSync(join(here, `../../public/r/${CONTRACT_ID}.contract.json`), "utf8"),
    )
    return cached
  } catch {
    cached = {
      id: CONTRACT_ID,
      mandate: FALLBACK_MANDATE,
      tokens: FALLBACK_TOKENS,
      primitives: FALLBACK_PRIMITIVES,
      recipes: FALLBACK_RECIPES,
      banned: FALLBACK_MANDATE.mustNot,
    }
    return cached
  }
}

/** Every response carries the consistency reminder — agents cannot miss it. */
function withMandate(kit, payload) {
  return {
    contract: kit.id ?? CONTRACT_ID,
    obey: {
      purpose: kit.mandate?.purpose ?? FALLBACK_MANDATE.purpose,
      must: kit.mandate?.must ?? FALLBACK_MANDATE.must,
      mustNot: kit.mandate?.mustNot ?? FALLBACK_MANDATE.mustNot,
    },
    ...payload,
  }
}

function toolList() {
  return [
    {
      name: "get_contract",
      description:
        "REQUIRED FIRST. Return the lightweight consistency kit: must/mustNot, closed tokens, bans, primitives, recipes. Call before writing any UI.",
      inputSchema: { type: "object", properties: {} },
    },
    {
      name: "resolve_token",
      description:
        "Resolve a closed token (color | radius | depth | surface). Inventing values is forbidden — only these closed sets.",
      inputSchema: {
        type: "object",
        properties: {
          kind: {
            type: "string",
            enum: ["color", "radius", "depth", "surface"],
          },
          name: { type: "string" },
        },
        required: ["kind", "name"],
      },
    },
    {
      name: "validate_ui",
      description:
        "REQUIRED BEFORE DONE. Lint a className/snippet against every mechanical consistency ban — the same rules the repository gate enforces.",
      inputSchema: {
        type: "object",
        properties: { source: { type: "string" } },
        required: ["source"],
      },
    },
    {
      name: "list_primitives",
      description:
        "List approved shadcn primitives. Compose these only — never invent twin components or app shells.",
      inputSchema: { type: "object", properties: {} },
    },
    {
      name: "get_recipe",
      description:
        "Fetch a task recipe (list-resource, agent-rail, …) with must/never rules that keep surfaces consistent.",
      inputSchema: {
        type: "object",
        properties: { id: { type: "string" } },
        required: ["id"],
      },
    },
  ]
}

/**
 * Lint against the SAME rules the repository gate runs (lib/design/bans.mjs).
 * A verdict here that disagreed with CI would make this tool worse than
 * useless — agents are told to call it before claiming done.
 */
function validateUi(source) {
  const hits = lintSource(source)
  return {
    ok: hits.length === 0,
    checked: mechanicalBans.length,
    hits,
    next: hits.length
      ? "Fix every hit, then call validate_ui again before shipping."
      : "Consistency check passed — still obey must/mustNot for structure.",
  }
}

async function callTool(name, args = {}) {
  if (!MCP_TOOLS.includes(name)) {
    return {
      error: `Unknown tool: ${name}`,
      platformTools: MCP_TOOLS,
      hint: "Tool names are platform-locked — do not invent per-contract tools.",
    }
  }
  const kit = await loadKit()
  const tokens = kit.tokens ?? FALLBACK_TOKENS

  switch (name) {
    case "get_contract":
      return withMandate(kit, {
        instruction:
          "Obey mandate.must / mandate.mustNot for ALL UI. Do not invent tokens. validate_ui before done.",
        aesthetic: kit.aesthetic,
        urls: kit.urls,
        tokens: {
          colorRoles: tokens.colorRoles,
          radiusIntents: tokens.radiusIntents ?? FALLBACK_TOKENS.radiusIntents,
          depthIntents: tokens.depthIntents ?? FALLBACK_TOKENS.depthIntents,
          surfaces: tokens.surfaces,
          typesetPresets: tokens.typesetPresets,
        },
        banned: kit.banned ?? kit.consistencyBans,
        primitives: kit.primitives ?? FALLBACK_PRIMITIVES,
        recipes: (kit.recipes ?? FALLBACK_RECIPES).map((r) => ({
          id: r.id,
          must: r.must,
          never: r.never,
        })),
        beforeUi: kit.mandate?.beforeUi ?? FALLBACK_MANDATE.beforeUi,
        beforeDone: kit.mandate?.beforeDone ?? FALLBACK_MANDATE.beforeDone,
      })

    case "resolve_token": {
      const { kind, name: token } = args
      if (kind === "color") {
        const roles = tokens.colorRoles ?? FALLBACK_TOKENS.colorRoles
        const ok = roles.includes(token)
        return withMandate(kit, {
          ok,
          kind,
          name: token,
          value: ok ? `var(--${token})` : null,
          utilities: ok ? [`bg-${token}`, `text-${token}`, `border-${token}`] : [],
          message: ok
            ? "Closed color role — use these utilities only."
            : "UNKNOWN color role — do not invent. Pick from tokens.colorRoles.",
        })
      }
      if (kind === "radius") {
        const map = tokens.radiusIntents ?? FALLBACK_TOKENS.radiusIntents
        const value = map[token]
        return withMandate(kit, {
          ok: Boolean(value),
          kind,
          name: token,
          value: value ?? null,
          message: value
            ? "Closed radius intent."
            : `UNKNOWN radius intent — use: ${Object.keys(map).join(", ")}`,
        })
      }
      if (kind === "depth") {
        const list = tokens.depthIntents ?? FALLBACK_TOKENS.depthIntents
        const value = list.includes(token)
          ? token
          : list.includes(`depth-${token}`)
            ? `depth-${token}`
            : null
        return withMandate(kit, {
          ok: Boolean(value),
          kind,
          name: token,
          value,
          message: value
            ? "Closed depth intent — never Tailwind shadow-*."
            : `UNKNOWN depth — use: ${list.join(", ")}`,
        })
      }
      if (kind === "surface") {
        const list = tokens.surfaces ?? FALLBACK_TOKENS.surfaces
        const ok = list.includes(token)
        return withMandate(kit, {
          ok,
          kind,
          name: token,
          value: ok ? token : null,
          surfaces: list,
          message: ok
            ? "Set data-surface to this value."
            : `UNKNOWN surface — use: ${list.join(", ")}`,
        })
      }
      return withMandate(kit, { ok: false, message: "unknown kind" })
    }

    case "validate_ui":
      return withMandate(kit, validateUi(String(args.source ?? "")))

    case "list_primitives":
      return withMandate(kit, {
        primitives: kit.primitives ?? FALLBACK_PRIMITIVES,
        instruction:
          "Compose these shadcn atoms only. New components are almost always wrong — prefer a rule or a recipe.",
      })

    case "get_recipe": {
      const recipes = kit.recipes ?? FALLBACK_RECIPES
      const recipe = recipes.find((r) => r.id === args.id)
      if (!recipe) {
        return withMandate(kit, {
          ok: false,
          message: `Unknown recipe: ${args.id}`,
          available: recipes.map((r) => r.id),
        })
      }
      return withMandate(kit, {
        ok: true,
        instruction: "Follow recipe.must exactly. Never do recipe.never.",
        recipe: {
          id: recipe.id,
          intent: recipe.intent,
          surface: recipe.surface,
          must: recipe.must,
          never: recipe.never,
        },
      })
    }

    default:
      return { error: `Unhandled tool: ${name}` }
  }
}

async function handle(message) {
  const { id, method, params } = message
  if (method === "initialize") {
    return {
      jsonrpc: "2.0",
      id,
      result: {
        protocolVersion: "2024-11-05",
        capabilities: { tools: {} },
        serverInfo: {
          name: `${CONTRACT_ID}-consistency`,
          version: "1.1.0",
          platform: "design-contracts",
          instructions:
            "Open-source consistency MCP. Call get_contract before UI. Call validate_ui before done. Obey must/mustNot — do not invent tokens.",
        },
      },
    }
  }
  if (method === "tools/list") {
    return { jsonrpc: "2.0", id, result: { tools: toolList() } }
  }
  if (method === "tools/call") {
    const result = await callTool(params?.name, params?.arguments ?? {})
    return {
      jsonrpc: "2.0",
      id,
      result: {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      },
    }
  }
  if (method === "notifications/initialized") return null
  return {
    jsonrpc: "2.0",
    id,
    error: { code: -32_601, message: `Method not found: ${method}` },
  }
}

const rl = createInterface({ input: process.stdin, crlfDelay: Infinity })
rl.on("line", async (line) => {
  const trimmed = line.trim()
  if (!trimmed) return
  let msg
  try {
    msg = JSON.parse(trimmed)
  } catch {
    return
  }
  const res = await handle(msg)
  if (res) process.stdout.write(`${JSON.stringify(res)}\n`)
})

process.stderr.write(
  `[contract-mcp] consistency-kit id=${CONTRACT_ID} tools=${MCP_TOOLS.join(",")}\n`,
)

#!/usr/bin/env node
/**
 * Lightweight design-contract MCP — consistency kit only.
 *
 * Differentiator vs shadcn MCP: that installs registry components; this one
 * fail-closes agents on closed tokens, recipes, and validate_ui.
 *
 * CONTRACT_ID selects DNA (default: meridian). Fetches live
 * /r/{id}.contract.json so it works from any project via npx.
 *
 * Tools: get_contract · resolve_token · validate_ui · list_primitives · get_recipe
 * Prompts: build_surface · done_gate
 * Resources: contract://kit · contract://mandate
 */

import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"
import { createInterface } from "node:readline"

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
    "Closed radii: control rounded-lg · pill rounded-full · input rounded-lg · panel rounded-2xl · shell rounded-3xl",
    "data-surface for density",
    "Object-bound AI with outcome-then-trace",
    "Same MCP tools on every design contract",
  ],
  mustNot: [
    "Invent hex / rgb / hsl / arbitrary colors",
    "Use Tailwind shadow-*",
    "Import lucide-react or @phosphor-icons/react directly",
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
    control: "rounded-lg",
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

const here = dirname(fileURLToPath(import.meta.url))
let cached = null

function readKitSnapshot() {
  try {
    return JSON.parse(readFileSync(join(here, "kit.json"), "utf8"))
  } catch {
    return null
  }
}

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
    cached = JSON.parse(
      readFileSync(join(here, `../../public/r/${CONTRACT_ID}.contract.json`), "utf8"),
    )
    return cached
  } catch {
    /* fall through */
  }
  const snap = readKitSnapshot()
  if (snap) {
    cached = {
      id: CONTRACT_ID,
      mandate: snap.mandate ?? FALLBACK_MANDATE,
      tokens: snap.tokens ?? FALLBACK_TOKENS,
      primitives: snap.primitives ?? FALLBACK_PRIMITIVES,
      recipes: snap.recipes ?? FALLBACK_RECIPES,
      banned: snap.mandate?.mustNot ?? FALLBACK_MANDATE.mustNot,
      urls: {
        contract: CONTRACT_URL,
        install: `${SITE}/${CONTRACT_ID}/install`,
      },
    }
    return cached
  }
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

function primitiveEntries(kit) {
  const list = kit.primitives ?? FALLBACK_PRIMITIVES
  return list.map((id) => ({
    id,
    importPath: `@/components/ui/${id}`,
    shadcn: `npx shadcn@latest add ${id}`,
  }))
}

function toolList() {
  return [
    {
      name: "get_contract",
      description:
        "REQUIRED FIRST. Return the lightweight consistency kit: must/mustNot, closed tokens, bans, primitives, recipes. Call before writing any UI. Pair with shadcn MCP/CLI for atom installs — this tool is the design law, not a registry browser.",
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
        "REQUIRED BEFORE DONE. Lint a className/snippet against consistency bans (hex, shadow-*, lucide/phosphor direct imports, arbitrary color).",
      inputSchema: {
        type: "object",
        properties: { source: { type: "string" } },
        required: ["source"],
      },
    },
    {
      name: "list_primitives",
      description:
        "List approved shadcn primitives with importPath + shadcn add command. Compose these only — never invent twin components or app shells.",
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

function promptList() {
  return [
    {
      name: "build_surface",
      description:
        "Golden path: load contract → pick recipe → compose shadcn atoms under closed tokens → validate_ui.",
      arguments: [
        {
          name: "intent",
          description: "Recipe id (list-resource, agent-rail, empty-recovery, …)",
          required: false,
        },
      ],
    },
    {
      name: "done_gate",
      description:
        "Done checklist — force validate_ui + mandate before claiming the UI is finished.",
      arguments: [],
    },
  ]
}

async function getPrompt(name, args = {}) {
  const kit = await loadKit()
  const intent = args.intent || "list-resource"
  if (name === "build_surface") {
    return {
      description: `Build a ${kit.name ?? CONTRACT_ID} surface under the consistency kit`,
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: [
              `You are installing the ${kit.name ?? CONTRACT_ID} design contract into this project.`,
              "",
              "1. Call get_contract. Obey obey.must / obey.mustNot — do not invent tokens.",
              `2. Call get_recipe with id="${intent}" (or another recipe if a better fit).`,
              "3. Call list_primitives. Install missing atoms with shadcn CLI or shadcn MCP.",
              "4. Compose UI using only closed tokens (resolve_token) and recipe.must.",
              "5. Call validate_ui on every new className/snippet. Fix hits until ok=true.",
              "6. Own empty / loading / error on resource surfaces. Selected = bg-brand/10.",
              "",
              `Contract JSON: ${kit.urls?.contract ?? CONTRACT_URL}`,
              `Install docs: ${kit.urls?.install ?? `${SITE}/${CONTRACT_ID}/install`}`,
            ].join("\n"),
          },
        },
      ],
    }
  }
  if (name === "done_gate") {
    return {
      description: "Fail-closed done gate for design-contract UI",
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: [
              "Before claiming done:",
              "- [ ] get_contract was called this session",
              "- [ ] No invented hex / rgb / hsl / shadow-* / twin components",
              "- [ ] validate_ui passed on every new snippet",
              "- [ ] Empty, loading, and error states exist where resources load",
              "- [ ] Icons from @/lib/icons only",
              "",
              "If any box is unchecked, fix it now — do not ship.",
            ].join("\n"),
          },
        },
      ],
    }
  }
  return null
}

async function resourceList() {
  return {
    resources: [
      {
        uri: "contract://kit",
        name: `${CONTRACT_ID} consistency kit`,
        description: "Slim contract JSON (mandate, tokens, primitives, recipes)",
        mimeType: "application/json",
      },
      {
        uri: "contract://mandate",
        name: `${CONTRACT_ID} mandate`,
        description: "must / mustNot / beforeUi / beforeDone only",
        mimeType: "application/json",
      },
    ],
  }
}

async function readResource(uri) {
  const kit = await loadKit()
  if (uri === "contract://kit") {
    return {
      contents: [
        {
          uri,
          mimeType: "application/json",
          text: JSON.stringify(
            withMandate(kit, {
              aesthetic: kit.aesthetic,
              urls: kit.urls,
              tokens: kit.tokens,
              primitives: primitiveEntries(kit),
              recipes: kit.recipes,
              banned: kit.banned ?? kit.consistencyBans,
            }),
            null,
            2,
          ),
        },
      ],
    }
  }
  if (uri === "contract://mandate") {
    return {
      contents: [
        {
          uri,
          mimeType: "application/json",
          text: JSON.stringify(kit.mandate ?? FALLBACK_MANDATE, null, 2),
        },
      ],
    }
  }
  return null
}

function validateUi(kit, source) {
  const hits = []
  if (/#[0-9a-fA-F]{3,8}\b/.test(source)) {
    hits.push({ ban: "hex-color", fix: "Use semantic tokens (bg-brand, text-foreground)" })
  }
  if (/\b(?:rgb|hsl)a?\(/.test(source)) {
    hits.push({ ban: "rgb-hsl-literal", fix: "OKLCH tokens / utilities only" })
  }
  if (/\bshadow-(?:sm|md|lg|xl|2xl|inner)\b/.test(source)) {
    hits.push({ ban: "tailwind-shadow", fix: "Use edge / depth-soft / depth-raised" })
  }
  if (/\bfont-bold\b/.test(source)) {
    hits.push({ ban: "font-bold-display", fix: "font-normal / font-medium for hierarchy" })
  }
  if (/from\s+["']lucide-react["']/.test(source)) {
    hits.push({ ban: "lucide-import", fix: 'import from "@/lib/icons"' })
  }
  if (/from\s+["']@phosphor-icons\/react["']/.test(source)) {
    hits.push({
      ban: "phosphor-direct-import",
      fix: 'import from "@/lib/icons" (duotone default)',
    })
  }
  if (/\b(?:text|bg|border)-\[[^\]]+\]/.test(source)) {
    hits.push({ ban: "arbitrary-color-utility", fix: "Closed semantic utilities only" })
  }
  if (/\bdvh\b/.test(source)) {
    hits.push({ ban: "dvh-height", fix: "Prefer min-h-svh / h-svh patterns from the kit" })
  }
  const bans = kit.consistencyBans ?? []
  return {
    ok: hits.length === 0,
    hits,
    consistencyBans: bans,
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
          "Obey mandate.must / mandate.mustNot for ALL UI. Do not invent tokens. validate_ui before done. Use shadcn CLI/MCP only to install approved primitives — not to invent a second design system.",
        workflow: [
          "get_contract",
          "get_recipe (optional)",
          "list_primitives → shadcn add",
          "compose under closed tokens",
          "validate_ui",
        ],
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
        primitives: primitiveEntries(kit),
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
      return withMandate(kit, validateUi(kit, String(args.source ?? "")))

    case "list_primitives":
      return withMandate(kit, {
        primitives: primitiveEntries(kit),
        instruction:
          "Compose these shadcn atoms only. Install with the shadcn field or shadcn MCP. New components are almost always wrong — prefer a rule or a recipe.",
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
        capabilities: {
          tools: {},
          prompts: {},
          resources: {},
        },
        serverInfo: {
          name: `${CONTRACT_ID}-consistency`,
          version: "1.2.0",
          platform: "design-contracts",
          instructions: [
            "Fail-closed design-contract MCP (open source).",
            "Unlike shadcn MCP (component install), this server is the consistency law.",
            "REQUIRED FIRST: get_contract. REQUIRED BEFORE DONE: validate_ui.",
            "Prompts: build_surface, done_gate. Resources: contract://kit, contract://mandate.",
            `CONTRACT_ID=${CONTRACT_ID}. Kit URL: ${CONTRACT_URL}`,
          ].join(" "),
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
  if (method === "prompts/list") {
    return { jsonrpc: "2.0", id, result: { prompts: promptList() } }
  }
  if (method === "prompts/get") {
    const prompt = await getPrompt(params?.name, params?.arguments ?? {})
    if (!prompt) {
      return {
        jsonrpc: "2.0",
        id,
        error: { code: -32602, message: `Unknown prompt: ${params?.name}` },
      }
    }
    return { jsonrpc: "2.0", id, result: prompt }
  }
  if (method === "resources/list") {
    return { jsonrpc: "2.0", id, result: await resourceList() }
  }
  if (method === "resources/read") {
    const body = await readResource(params?.uri)
    if (!body) {
      return {
        jsonrpc: "2.0",
        id,
        error: { code: -32602, message: `Unknown resource: ${params?.uri}` },
      }
    }
    return { jsonrpc: "2.0", id, result: body }
  }
  if (method === "notifications/initialized") return null
  if (method === "ping") {
    return { jsonrpc: "2.0", id, result: {} }
  }
  return {
    jsonrpc: "2.0",
    id,
    error: { code: -32601, message: `Method not found: ${method}` },
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
  `[contract-mcp] consistency-kit id=${CONTRACT_ID} tools=${MCP_TOOLS.join(",")} prompts=build_surface,done_gate\n`,
)

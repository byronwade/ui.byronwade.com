#!/usr/bin/env node
/**
 * Meridian MCP server (stdio JSON-RPC stub).
 *
 * Tools:
 *   get_contract · resolve_token · validate_ui · list_primitives · get_recipe
 *
 * Fetches the live contract from ui.byronwade.com when available; falls back
 * to embedded minimal grammar so offline agents still get closed tokens.
 */

import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

const CONTRACT_URL =
  process.env.MERIDIAN_CONTRACT_URL ??
  "https://ui.byronwade.com/r/meridian.contract.json"

const COLOR_ROLES = [
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
]

const PRIMITIVES = [
  "button",
  "input",
  "select",
  "table",
  "card",
  "dialog",
  "sheet",
  "tabs",
  "tooltip",
  "sonner",
]

const BANNED = [
  "hex colors",
  "rgb()/hsl() literals",
  "shadow-*",
  "font-bold on display",
  "lucide-react direct import",
  "second brand accent",
]

let cachedContract = null

async function loadContract() {
  if (cachedContract) return cachedContract
  try {
    const res = await fetch(CONTRACT_URL, {
      headers: { Accept: "application/json" },
    })
    if (res.ok) {
      cachedContract = await res.json()
      return cachedContract
    }
  } catch {
    /* offline fallback */
  }
  try {
    const here = dirname(fileURLToPath(import.meta.url))
    const local = join(here, "../../public/r/meridian.contract.json")
    cachedContract = JSON.parse(readFileSync(local, "utf8"))
    return cachedContract
  } catch {
    cachedContract = {
      id: "meridian",
      frozen: { colorRoles: COLOR_ROLES, banned: BANNED },
      taskRecipes: [],
    }
    return cachedContract
  }
}

function toolList() {
  return [
    {
      name: "get_contract",
      description: "Return the Meridian design contract JSON (frozen grammar + laws).",
      inputSchema: { type: "object", properties: {} },
    },
    {
      name: "resolve_token",
      description: "Resolve a semantic color/radius/depth token to its closed value.",
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
        "Lint a className / snippet against Meridian bans (hex, shadow-*, etc.).",
      inputSchema: {
        type: "object",
        properties: {
          source: { type: "string" },
        },
        required: ["source"],
      },
    },
    {
      name: "list_primitives",
      description: "List approved shadcn primitives to compose (no twin zoo).",
      inputSchema: { type: "object", properties: {} },
    },
    {
      name: "get_recipe",
      description: "Fetch a task recipe (list-resource, agent-rail, …).",
      inputSchema: {
        type: "object",
        properties: {
          id: { type: "string" },
        },
        required: ["id"],
      },
    },
  ]
}

function validateUi(source) {
  const hits = []
  if (/#[0-9a-fA-F]{3,8}\b/.test(source)) hits.push("hex color banned")
  if (/\b(?:rgb|hsl)a?\(/.test(source)) hits.push("rgb/hsl literal banned")
  if (/\bshadow-(?:sm|md|lg|xl|2xl|inner)\b/.test(source)) {
    hits.push("Tailwind shadow-* banned — use depth-*")
  }
  if (/\bfont-bold\b/.test(source)) hits.push("font-bold on display banned")
  if (/from\s+["']lucide-react["']/.test(source)) {
    hits.push("lucide-react import banned — use @/lib/icons")
  }
  if (/text-\[[^\]]+\]/.test(source) || /bg-\[[^\]]+\]/.test(source)) {
    hits.push("arbitrary color utility banned")
  }
  return {
    ok: hits.length === 0,
    hits,
    banned: BANNED,
  }
}

async function callTool(name, args = {}) {
  const contract = await loadContract()
  switch (name) {
    case "get_contract":
      return contract
    case "resolve_token": {
      const { kind, name } = args
      if (kind === "color") {
        const ok = (contract.frozen?.colorRoles ?? COLOR_ROLES).includes(name)
        return {
          ok,
          token: ok ? `var(--${name})` : null,
          utility: ok ? [`bg-${name}`, `text-${name}`, `border-${name}`] : [],
          message: ok ? "closed role" : "unknown color role — do not invent",
        }
      }
      if (kind === "radius") {
        const map = {
          control: "rounded-full",
          input: "rounded-lg",
          panel: "rounded-2xl",
          shell: "rounded-3xl",
        }
        return { ok: Boolean(map[name]), token: map[name] ?? null }
      }
      if (kind === "depth") {
        const ok = ["none", "soft", "raised", "100", "300", "400", "600"].some(
          (d) => name === d || name === `depth-${d}`,
        )
        return {
          ok,
          token: ok
            ? name.startsWith("depth-")
              ? name
              : `depth-${name}`
            : null,
        }
      }
      if (kind === "surface") {
        const list = contract.shellSurfaces ?? [
          "application",
          "marketing",
          "mobile",
          "desktop",
        ]
        return { ok: list.includes(name), token: name, surfaces: list }
      }
      return { ok: false, message: "unknown kind" }
    }
    case "validate_ui":
      return validateUi(String(args.source ?? ""))
    case "list_primitives":
      return {
        primitives: contract.primitives ?? PRIMITIVES,
        rule: "Compose these — never invent twin components.",
      }
    case "get_recipe": {
      const recipes = contract.taskRecipes ?? []
      const recipe = recipes.find((r) => r.id === args.id)
      if (!recipe) {
        return {
          ok: false,
          message: `Unknown recipe: ${args.id}`,
          available: recipes.map((r) => r.id),
        }
      }
      return { ok: true, recipe }
    }
    default:
      return { error: `Unknown tool: ${name}` }
  }
}

/** Minimal MCP-style JSON-RPC over stdio (line-delimited). */
async function handle(message) {
  const { id, method, params } = message
  if (method === "initialize") {
    return {
      jsonrpc: "2.0",
      id,
      result: {
        protocolVersion: "2024-11-05",
        capabilities: { tools: {} },
        serverInfo: { name: "meridian", version: "0.1.0" },
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
  if (method === "notifications/initialized") {
    return null
  }
  return {
    jsonrpc: "2.0",
    id,
    error: { code: -32601, message: `Method not found: ${method}` },
  }
}

import { createInterface } from "node:readline"

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
  "[meridian-mcp] ready — tools: get_contract, resolve_token, validate_ui, list_primitives, get_recipe\n",
)

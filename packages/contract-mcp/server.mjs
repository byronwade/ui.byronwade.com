#!/usr/bin/env node
/**
 * Shared design-contract MCP server.
 *
 * CONTRACT_ID selects which DNA/contract JSON to load (default: meridian).
 * Tool names are PLATFORM-LOCKED — never fork a sibling tool list per contract.
 *
 * Tools: get_contract · resolve_token · validate_ui · list_primitives · get_recipe
 */

import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"
import { createInterface } from "node:readline"

const CONTRACT_ID = (process.env.CONTRACT_ID ?? "meridian").toLowerCase()
const SITE = process.env.CONTRACT_SITE ?? "https://ui.byronwade.com"
const CONTRACT_URL =
  process.env.CONTRACT_URL ?? `${SITE}/r/${CONTRACT_ID}.contract.json`

/** Keep in sync with lib/platform/skeleton.ts MCP_TOOLS */
const MCP_TOOLS = [
  "get_contract",
  "resolve_token",
  "validate_ui",
  "list_primitives",
  "get_recipe",
]

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
    /* offline */
  }
  try {
    const here = dirname(fileURLToPath(import.meta.url))
    const local = join(here, `../../public/r/${CONTRACT_ID}.contract.json`)
    cachedContract = JSON.parse(readFileSync(local, "utf8"))
    return cachedContract
  } catch {
    cachedContract = {
      id: CONTRACT_ID,
      platform: { mcpTools: MCP_TOOLS },
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
      description: `Return the ${CONTRACT_ID} design contract JSON (platform + DNA + grammar).`,
      inputSchema: { type: "object", properties: {} },
    },
    {
      name: "resolve_token",
      description:
        "Resolve a semantic color/radius/depth/surface token to its closed value.",
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
        "Lint a className / snippet against platform bans (hex, shadow-*, …).",
      inputSchema: {
        type: "object",
        properties: { source: { type: "string" } },
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
        properties: { id: { type: "string" } },
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
  return { ok: hits.length === 0, hits, banned: BANNED }
}

async function callTool(name, args = {}) {
  if (!MCP_TOOLS.includes(name)) {
    return {
      error: `Unknown tool: ${name}`,
      platformTools: MCP_TOOLS,
      hint: "Tool names are platform-locked — do not invent per-contract tools.",
    }
  }
  const contract = await loadContract()
  switch (name) {
    case "get_contract":
      return contract
    case "resolve_token": {
      const { kind, name: token } = args
      if (kind === "color") {
        const ok = (contract.frozen?.colorRoles ?? COLOR_ROLES).includes(token)
        return {
          ok,
          token: ok ? `var(--${token})` : null,
          utility: ok
            ? [`bg-${token}`, `text-${token}`, `border-${token}`]
            : [],
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
        return { ok: Boolean(map[token]), token: map[token] ?? null }
      }
      if (kind === "depth") {
        const ok = ["none", "soft", "raised", "100", "300", "400", "600"].some(
          (d) => token === d || token === `depth-${d}`,
        )
        return {
          ok,
          token: ok
            ? token.startsWith("depth-")
              ? token
              : `depth-${token}`
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
        return { ok: list.includes(token), token, surfaces: list }
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
          name: `${CONTRACT_ID}-contract`,
          version: "1.0.0",
          platform: "design-contracts",
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
  `[contract-mcp] id=${CONTRACT_ID} tools=${MCP_TOOLS.join(",")}\n`,
)

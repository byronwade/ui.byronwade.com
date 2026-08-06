/**
 * Paste-ready install DX for every design contract.
 * Same shape for Meridian / Harbor / Atlas / Vellum — only ids change.
 *
 * Product job: law book + verified skills + fail-closed gates into ANY project.
 * Contract MCP is an optional accelerator; shadcn MCP/CLI installs atoms.
 */

import { advertisedThemeSkill } from "@/lib/contracts/routes"
import { getDna } from "@/lib/contracts/dna"
import { MCP_TOOLS, contractUrls, pathTemplates } from "@/lib/platform/skeleton"

const SITE = "https://ui.byronwade.com"
const REPO = "byronwade/ui.byronwade.com"

export type ContractInstall = {
  id: string
  name: string
  status: string
  skillsNpx: string
  skillsNpxTheme: string
  themeSkillNote: string
  /** Primary: works from any project via npx + remote contract JSON. */
  mcpNpx: string
  mcpCommand: string
  /** Contributor checkout path (optional). */
  mcpLocalCommand: string
  mcpCursorJson: string
  contractJsonUrl: string
  contractJsonCurl: string
  machineUrls: {
    design: string
    agents: string
    architecture: string
    llms: string
  }
  shadcnInit: string
  shadcnAdd: string
  /** Pair with shadcn MCP for component delivery — different job. */
  shadcnMcpNote: string
  checkCli: string
  agentLoop: readonly string[]
  tools: readonly string[]
  pages: {
    install: string
    ui: string
    theme: string
    surfaces: string
    agents: string
    design: string
  }
}

export function getContractInstall(contractId: string): ContractInstall | null {
  const dna = getDna(contractId)
  if (!dna) return null

  const urls = contractUrls(dna.id, SITE)
  const base = pathTemplates.base(dna.id)
  const themeSkill = advertisedThemeSkill(dna.id)
  const themeIsNative = themeSkill === `${dna.id}-theme`

  const mcpNpx = `npx -y --package=github:${REPO} contract-mcp`
  const mcpCommand = `CONTRACT_ID=${dna.id} CONTRACT_SITE=${SITE} ${mcpNpx}`
  const mcpLocalCommand = `CONTRACT_ID=${dna.id} node packages/contract-mcp/server.mjs`

  const mcpCursorJson = JSON.stringify(
    {
      mcpServers: {
        [`${dna.id}-contract`]: {
          command: "npx",
          args: ["-y", `--package=github:${REPO}`, "contract-mcp"],
          env: {
            CONTRACT_ID: dna.id,
            CONTRACT_SITE: SITE,
          },
        },
        shadcn: {
          command: "npx",
          args: ["shadcn@latest", "mcp"],
        },
      },
    },
    null,
    2,
  )

  return {
    id: dna.id,
    name: dna.name,
    status: dna.status,
    skillsNpx: `npx skills add ${REPO}`,
    skillsNpxTheme: `npx skills add ${REPO} --skill ${themeSkill}`,
    themeSkillNote: themeIsNative
      ? `${dna.name} theme skill`
      : `Platform theme skill (${themeSkill}) — DNA skins via CONTRACT_ID=${dna.id}`,
    mcpNpx,
    mcpCommand,
    mcpLocalCommand,
    mcpCursorJson,
    contractJsonUrl: urls.contract,
    contractJsonCurl: `curl -sS ${urls.contract}`,
    machineUrls: {
      design: urls.design,
      agents: urls.agents,
      architecture: urls.architecture,
      llms: urls.llms,
    },
    shadcnInit: "npx shadcn@latest init -d --base radix",
    shadcnAdd: "npx shadcn@latest add button card input table tabs dialog",
    shadcnMcpNote:
      "shadcn MCP/CLI installs atoms. Law book + skills + npm run validate enforce the system. Contract MCP is optional.",
    checkCli: "npm run validate",
    agentLoop: [
      `Load /${dna.id}/design.md + /${dna.id}/agents.md (REQUIRED FIRST)`,
      `Open ${dna.id}-* skill (compose / specialty) — verified cookbook`,
      "Pick a task recipe — list-resource / object-detail / agent-rail / …",
      "list_primitives + shadcn add — compose approved atoms only; never twin kits",
      "npm run validate — REQUIRED BEFORE DONE (check:design · platform · contrast)",
      "Optional MCP: get_contract → validate_ui when the session is tool-wired",
    ],
    tools: MCP_TOOLS,
    pages: {
      install: `${base}/install`,
      ui: `${base}/ui`,
      theme: `${base}/theme`,
      surfaces: `${base}/surfaces`,
      agents: `${base}/for-agents`,
      design: `${base}/design`,
    },
  }
}

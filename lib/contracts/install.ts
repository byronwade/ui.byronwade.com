/**
 * Paste-ready install DX for every design contract.
 * Same shape for Meridian / Harbor / Atlas / Vellum — only ids change.
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
  mcpCommand: string
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
  checkCli: string
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
  const mcpCommand = `CONTRACT_ID=${dna.id} node packages/contract-mcp/server.mjs`
  const themeSkill = advertisedThemeSkill(dna.id)
  const themeIsNative = themeSkill === `${dna.id}-theme`

  const mcpCursorJson = JSON.stringify(
    {
      mcpServers: {
        [`${dna.id}-contract`]: {
          command: "node",
          args: ["packages/contract-mcp/server.mjs"],
          env: {
            CONTRACT_ID: dna.id,
          },
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
    mcpCommand,
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
    checkCli: "npm run check:meridian",
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

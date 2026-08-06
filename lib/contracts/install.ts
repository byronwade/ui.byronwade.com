/**
 * Paste-ready install DX for every design contract.
 * Same shape for Meridian / Harbor / Atlas / Vellum — only ids change.
 */

import { MCP_TOOLS, contractUrls, pathTemplates } from "@/lib/platform/skeleton"
import { getDna } from "@/lib/contracts/dna"

const SITE = "https://ui.byronwade.com"
const REPO = "byronwade/ui.byronwade.com"

export type ContractInstall = {
  id: string
  name: string
  status: string
  skillsNpx: string
  skillsNpxTheme: string
  mcpCommand: string
  mcpCursorJson: string
  contractJsonUrl: string
  contractJsonCurl: string
  /** Only present when the contract has authored its machine docs. */
  machineUrls: {
    design: string
    agents: string
    architecture: string
    llms: string
  } | null
  shadcnInit: string
  shadcnAdd: string
  checkCli: string
  tools: readonly string[]
  pages: {
    install: string
    ui: string
    theme: string
    surfaces: string
    /** Null until the contract authors its agents page. */
    agents: string | null
  }
}

export function getContractInstall(contractId: string): ContractInstall | null {
  const dna = getDna(contractId)
  if (!dna) return null

  const urls = contractUrls(dna.id, SITE)
  const authored = dna.authored ?? []
  const base = pathTemplates.base(dna.id)
  const mcpCommand = `CONTRACT_ID=${dna.id} node packages/contract-mcp/server.mjs`

  const mcpCursorJson = JSON.stringify(
    {
      mcpServers: {
        [`${dna.id}-contract`]: {
          command: "node",
          args: [
            // Clone the repo (or point at your checkout) then:
            "packages/contract-mcp/server.mjs",
          ],
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
    skillsNpxTheme: `npx skills add ${REPO} --skill ${dna.id}-theme`,
    mcpCommand,
    mcpCursorJson,
    contractJsonUrl: urls.contract,
    contractJsonCurl: `curl -sS ${urls.contract}`,
    /* A "soon" contract has no authored docs yet — advertising the URLs
       would hand agents four 404s. See ROUTE_SLOTS scope: "authored". */
    machineUrls: authored.includes("design")
      ? {
          design: urls.design,
          agents: urls.agents,
          architecture: urls.architecture,
          llms: urls.llms,
        }
      : null,
    shadcnInit: "npx shadcn@latest init -d --base radix",
    shadcnAdd: "npx shadcn@latest add button card input table tabs dialog",
    checkCli: `npm run meridian-check`,
    tools: MCP_TOOLS,
    pages: {
      install: `${base}/install`,
      ui: `${base}/ui`,
      theme: `${base}/theme`,
      surfaces: `${base}/surfaces`,
      agents: authored.includes("for-agents") ? `${base}/for-agents` : null,
    },
  }
}

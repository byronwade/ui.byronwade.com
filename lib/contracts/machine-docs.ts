/**
 * Machine markdown for every contract.
 * Meridian prefers repo SSOT files; others get a DNA + platform kit brief.
 */

import { getDna } from "@/lib/contracts/dna"
import { getContractInstall } from "@/lib/contracts/install"
import { loadSource } from "@/lib/docs/load-source"
import { MCP_TOOLS, PLATFORM_VERSION } from "@/lib/platform/skeleton"
import { agentMandate } from "@/lib/platform/consistency"

async function readIfAllowed(rel: string) {
  try {
    return await loadSource(rel)
  } catch {
    return null
  }
}

export async function getDesignMarkdown(contractId: string): Promise<string> {
  if (contractId === "meridian") {
    const src = await readIfAllowed("design.md")
    if (src) return src
  }

  const dna = getDna(contractId)
  const install = getContractInstall(contractId)
  if (!dna || !install) {
    return `# ${contractId}\n\nUnknown contract.\n`
  }

  return `# ${dna.name} — design contract

> ${dna.tagline}

**Status:** \`${dna.status}\` · **Version:** \`${dna.version}\` · **Platform:** \`${PLATFORM_VERSION}\`

## Aesthetic (DNA)

${dna.aesthetic}

## Features

${dna.features.map((f) => `- ${f}`).join("\n")}

## Hard rules

${agentMandate.must.map((m) => `- MUST: ${m}`).join("\n")}

${agentMandate.mustNot.map((m) => `- MUST NOT: ${m}`).join("\n")}

## Install

\`\`\`bash
${install.mcpCommand}
\`\`\`

Contract JSON: ${install.contractJsonUrl}

Skills:

\`\`\`bash
${install.skillsNpx}
\`\`\`

## Compose

Use shadcn primitives (\`npx shadcn@latest add …\`). Never fork twin component kits.
Skin via \`data-contract="${dna.id}"\` / \`CONTRACT_ID=${dna.id}\`.

## Machine endpoints

- ${install.machineUrls.design}
- ${install.machineUrls.agents}
- ${install.machineUrls.architecture}
- ${install.machineUrls.llms}
- ${install.contractJsonUrl}
`
}

export async function getAgentsMarkdown(contractId: string): Promise<string> {
  if (contractId === "meridian") {
    const src = await readIfAllowed("agents.md")
    if (src) return src
  }

  const dna = getDna(contractId)
  const install = getContractInstall(contractId)
  if (!dna || !install) {
    return `# ${contractId} agents\n\nUnknown contract.\n`
  }

  return `# ${dna.name} — agents.md

## 0. Hard rules (fail closed)

Call \`get_contract\` before shipping UI. Call \`validate_ui\` before done.
Compose shadcn under this contract's tokens — do not invent OKLCH.

## 1. Load order (mandatory)

1. \`get_contract\` (MCP) or fetch \`${install.contractJsonUrl}\`
2. This file + design.md
3. Skills via \`${install.skillsNpx}\`
4. Build UI · \`validate_ui\`

## 2. Platform consistency (all contracts)

Architecture is shared. Change filenames / MCP tools / JSON keys in \`lib/platform/skeleton.ts\` for **every** contract — never fork for ${dna.name} alone.
Design DNA may differ (\`${dna.id}\` aesthetic). Structure must not.

## 3–6. DNA · material · skills · agents

Aesthetic: ${dna.aesthetic}

MCP tools: ${MCP_TOOLS.map((t) => `\`${t}\``).join(" · ")}

Theme skill (platform pack until \`${dna.id}-*\` ships):

\`\`\`bash
${install.skillsNpxTheme}
\`\`\`

## 7. Negotiated endpoints

- design.md · agents.md · architecture.md · llms.txt under \`/${dna.id}/\`
- Machine kit: \`${install.contractJsonUrl}\`

## 8. Done gate

- [ ] \`get_contract\` run
- [ ] Tokens / radii / depth from kit only
- [ ] \`validate_ui\` pass
- [ ] No forked MCP tools or twin component kits
`
}

export async function getArchitectureMarkdown(
  contractId: string,
): Promise<string> {
  if (contractId === "meridian") {
    const src = await readIfAllowed("docs/architecture.md")
    if (src) return src
  }

  const dna = getDna(contractId)
  if (!dna) return `# architecture\n\nUnknown contract.\n`

  const shared = await readIfAllowed("docs/architecture.md")
  const preface = `# ${dna.name} — architecture

> Platform architecture is shared. DNA = \`${dna.id}\`.

${dna.aesthetic}

---

`

  return shared ? preface + shared : preface
}

export async function getLlmsTxt(contractId: string): Promise<string> {
  if (contractId === "meridian") {
    const src = await readIfAllowed("llms.txt")
    if (src) return src
  }

  const dna = getDna(contractId)
  const install = getContractInstall(contractId)
  if (!dna || !install) return `# ${contractId}\n`

  return `# ${dna.name}

> ${dna.tagline}

## Start here

- Design: ${install.machineUrls.design}
- Agents: ${install.machineUrls.agents}
- Contract JSON: ${install.contractJsonUrl}
- Install UI: https://ui.byronwade.com/${dna.id}/install

## MCP

\`\`\`bash
${install.mcpCommand}
\`\`\`

Tools: ${MCP_TOOLS.join(", ")}

## Aesthetic

${dna.aesthetic}
`
}

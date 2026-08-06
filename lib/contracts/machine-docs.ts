/**
 * Machine markdown for every contract.
 * Prefer authored law books under contracts/{id}/; Meridian also keeps root SSOT.
 */

import { getDna } from "@/lib/contracts/dna"
import { getContractInstall } from "@/lib/contracts/install"
import { loadSource } from "@/lib/docs/load-source"
import { MCP_TOOLS, PLATFORM_VERSION } from "@/lib/platform/skeleton"

async function readIfAllowed(rel: string) {
  try {
    return await loadSource(rel)
  } catch {
    return null
  }
}

async function loadLawBook(
  contractId: string,
  file: "DESIGN.md" | "AGENTS.md",
): Promise<string | null> {
  const dna = getDna(contractId)
  if (!dna) return null
  const fromContracts = await readIfAllowed(`${dna.lawBookDir}/${file}`)
  if (fromContracts) return fromContracts
  if (contractId === "meridian") {
    const root = file === "DESIGN.md" ? "design.md" : "agents.md"
    return readIfAllowed(root)
  }
  return null
}

export async function getDesignMarkdown(contractId: string): Promise<string> {
  const authored = await loadLawBook(contractId, "DESIGN.md")
  if (authored) return authored

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

${dna.must.map((m) => `- MUST: ${m}`).join("\n")}

${dna.mustNot.map((m) => `- MUST NOT: ${m}`).join("\n")}

## Install

Law book + skills first. Contract MCP optional.

\`\`\`bash
${install.skillsNpx}
\`\`\`

Contract JSON: ${install.contractJsonUrl}

## Compose

Use shadcn primitives. Never fork twin component kits.
Skin via \`data-contract="${dna.id}"\`.
Run \`npm run validate\` before done.
`
}

export async function getAgentsMarkdown(contractId: string): Promise<string> {
  const authored = await loadLawBook(contractId, "AGENTS.md")
  if (authored) return authored

  const dna = getDna(contractId)
  const install = getContractInstall(contractId)
  if (!dna || !install) {
    return `# ${contractId} agents\n\nUnknown contract.\n`
  }

  return `# ${dna.name} — agents.md

## 0. Hard rules (fail closed)

Read DESIGN.md first. Compose shadcn under this contract's tokens — do not invent OKLCH.
Pass \`npm run validate\` before done. Contract MCP is optional.

## 1. Load order (mandatory)

1. \`docs/platform.md\` + \`docs/${dna.id}.md\`
2. This file + design.md
3. Skills via \`${install.skillsNpx}\`
4. Recipe → compose → validate gates

## 2. Platform consistency (all contracts)

Architecture is shared. Change filenames / MCP tools / JSON keys in \`lib/platform/skeleton.ts\` for **every** contract — never fork for ${dna.name} alone.
Design DNA may differ (\`${dna.id}\` aesthetic). Structure must not.

## 3. Design influences → mapping

See \`docs/${dna.id}.md\`.

## 4. Material laws (app chrome)

${dna.aesthetic}

## 5. Skills

${dna.skillSlugs.map((s) => `- \`${s}\``).join("\n")}

## 6. Agents

Author → reviewer against DESIGN.md + skills.

## 7. Negotiated endpoints

- design.md · agents.md · architecture.md · llms.txt under \`/${dna.id}/\`
- Machine kit: \`${install.contractJsonUrl}\`

## 8. Done gate

- [ ] Law book loaded
- [ ] Skill followed
- [ ] Tokens / radii / depth from kit only
- [ ] \`npm run validate\` green
- [ ] Optional MCP \`validate_ui\` if tool-wired
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
- DNA: https://ui.byronwade.com/${dna.id}/system/${dna.id === "meridian" ? "meridian" : dna.id}
- Contract JSON: ${install.contractJsonUrl}
- Install UI: https://ui.byronwade.com/${dna.id}/install

## Agent stack

Law book + \`${dna.id}-*\` skills + \`npm run validate\` (required).
Contract MCP optional:

\`\`\`bash
${install.mcpCommand}
\`\`\`

Tools: ${MCP_TOOLS.join(", ")}

## Aesthetic

${dna.aesthetic}

## Skills

${dna.skillSlugs.map((s) => `- ${s}`).join("\n")}
`
}

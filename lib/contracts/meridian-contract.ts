/**
 * Serializable Meridian contract — generated into public/r/meridian.contract.json
 * and served to MCP / CLI consumers.
 */

import {
  activityRoles,
  banned,
  colorRoles,
  depths,
  provenanceRoles,
  radii,
  surfaces,
} from "@/lib/design/grammar"
import { uxLaws, dxLaws, dxLoadTiers } from "@/lib/design/experience"
import { typesetLaws, typesetPresets } from "@/lib/design/typeset"
import { shellLaws, shellRhythm } from "@/lib/design/shell"
import { zones } from "@/lib/design/recipes"
import { taskRecipes } from "@/lib/contracts/task-recipes"
import { fewShots } from "@/lib/contracts/few-shots"
import { MCP_PRICE_USD } from "@/lib/contracts/catalog"

export function buildMeridianContract() {
  return {
    $schema: "https://ui.byronwade.com/r/meridian.contract.schema.json",
    id: "meridian",
    name: "Meridian",
    version: "0.1.0",
    priceMonthlyUsd: MCP_PRICE_USD,
    mcp: {
      slug: "meridian",
      tools: [
        "get_contract",
        "resolve_token",
        "validate_ui",
        "list_primitives",
        "get_recipe",
      ],
    },
    urls: {
      home: "https://ui.byronwade.com/meridian",
      design: "https://ui.byronwade.com/meridian/design.md",
      agents: "https://ui.byronwade.com/meridian/agents.md",
      llms: "https://ui.byronwade.com/meridian/llms.txt",
      contract: "https://ui.byronwade.com/r/meridian.contract.json",
    },
    frozen: {
      colorRoles,
      activityRoles,
      provenanceRoles,
      radii,
      depths,
      surfaces,
      banned,
      zones: zones.frozen,
    },
    laws: {
      ux: uxLaws,
      dx: dxLaws,
      dxLoadTiers,
      typeset: typesetLaws,
      shell: shellLaws,
    },
    typesetPresets: [...typesetPresets],
    shellSurfaces: Object.keys(shellRhythm),
    taskRecipes,
    fewShots,
  }
}

export type MeridianContract = ReturnType<typeof buildMeridianContract>

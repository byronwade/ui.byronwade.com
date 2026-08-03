/**
 * Meridian live contract — DNA + Meridian grammar through the platform builder.
 * Other contracts use the same builder with their DNA (+ grammar when live).
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
import { meridianDna } from "@/lib/contracts/dna/meridian"
import {
  buildContractEnvelope,
  type ContractJson,
} from "@/lib/platform/build-contract"

export function meridianGrammar() {
  return {
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
  }
}

export function buildMeridianContract(): ContractJson {
  return buildContractEnvelope(meridianDna, meridianGrammar())
}

export type MeridianContract = ReturnType<typeof buildMeridianContract>

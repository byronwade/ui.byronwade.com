/**
 * Meridian live contract — DNA + Meridian grammar through the slim kit builder.
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
import { typesetPresets } from "@/lib/design/typeset"
import { meridianDna } from "@/lib/contracts/dna/meridian"
import {
  buildContractEnvelope,
  type ContractJson,
} from "@/lib/platform/build-contract"

export function meridianGrammar() {
  return {
    colorRoles,
    radii,
    depths,
    surfaces,
    activityRoles,
    provenanceRoles,
    banned,
    typesetPresets: [...typesetPresets],
  }
}

export function buildMeridianContract(): ContractJson {
  return buildContractEnvelope(meridianDna, meridianGrammar())
}

export type MeridianContract = ReturnType<typeof buildMeridianContract>

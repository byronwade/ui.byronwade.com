import type { Metadata } from "next"

import { ContractAgentsLabPage } from "@/components/contracts/pages/agents-lab-page"

export const metadata: Metadata = {
  title: "Agents",
  description: "Agents for the Atlas design contract — install, UI, and shells under this DNA.",
}

export default function Page() {
  return <ContractAgentsLabPage contractId="atlas" />
}

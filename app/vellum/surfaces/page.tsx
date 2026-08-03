import type { Metadata } from "next"

import { ContractSurfacesLabPage } from "@/components/contracts/pages/surfaces-lab-page"

export const metadata: Metadata = {
  title: "Surfaces",
  description: "Surfaces for the Vellum design contract — install, UI, and shells under this DNA.",
}

export default function Page() {
  return <ContractSurfacesLabPage contractId="vellum" />
}

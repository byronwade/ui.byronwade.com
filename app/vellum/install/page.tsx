import type { Metadata } from "next"

import { ContractInstallPage } from "@/components/contracts/pages/install-page"

export const metadata: Metadata = {
  title: "Install",
  description: "Install for the Vellum design contract — install, UI, and shells under this DNA.",
}

export default function Page() {
  return <ContractInstallPage contractId="vellum" />
}

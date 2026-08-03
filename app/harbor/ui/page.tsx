import type { Metadata } from "next"

import { ContractUiPage } from "@/components/contracts/pages/ui-page"

export const metadata: Metadata = {
  title: "UI",
  description: "UI for the Harbor design contract — install, UI, and shells under this DNA.",
}

export default function Page() {
  return <ContractUiPage contractId="harbor" />
}

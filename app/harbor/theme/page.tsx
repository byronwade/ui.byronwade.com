import type { Metadata } from "next"

import { ContractThemeLabPage } from "@/components/contracts/pages/theme-lab-page"

export const metadata: Metadata = {
  title: "Theme",
  description: "Theme for the Harbor design contract — install, UI, and shells under this DNA.",
}

export default function Page() {
  return <ContractThemeLabPage contractId="harbor" />
}

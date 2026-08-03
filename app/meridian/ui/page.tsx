import type { Metadata } from "next"

import { ContractUiPage } from "@/components/contracts/pages/ui-page"

export const metadata: Metadata = {
  title: "UI",
  description: "UI for the Meridian design contract — MCP, API, npx, and shared UI under Meridian DNA.",
}

export default function Page() {
  return <ContractUiPage contractId="meridian" />
}

import type { Metadata } from "next"

import { ContractInstallPage } from "@/components/contracts/pages/install-page"

export const metadata: Metadata = {
  title: "Install",
  description: "Install for the Meridian design contract — MCP, API, npx, and shared UI under Meridian DNA.",
}

export default function Page() {
  return <ContractInstallPage contractId="meridian" />
}

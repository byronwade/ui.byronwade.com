import type { Metadata } from "next"

import { CatalogHero } from "@/components/catalog/catalog-hero"
import { ContractList } from "@/components/catalog/contract-list"
import { HowItWorks } from "@/components/catalog/how-it-works"
import { Pricing } from "@/components/catalog/pricing"

export const metadata: Metadata = {
  title: "Design contracts",
  description:
    "Strict AI design systems agents install over MCP — Meridian and siblings. $9/mo per contract server.",
  openGraph: {
    title: "Design contracts · ui.byronwade.com",
    description:
      "A soft catalog of fail-closed AI design contracts. Install Meridian MCP — ship coherent app UI.",
  },
}

/**
 * Platform homepage — cinematic catalog of design contracts.
 * Individual systems (Meridian, …) live under /{contract}.
 */
export default function HomePage() {
  return (
    <main data-slot="contracts-home">
      <CatalogHero />
      <ContractList />
      <HowItWorks />
      <Pricing />
    </main>
  )
}

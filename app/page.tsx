import type { Metadata } from "next"

import { CatalogHero } from "@/components/catalog/catalog-hero"
import { ContractList } from "@/components/catalog/contract-list"
import { HowItWorks } from "@/components/catalog/how-it-works"
import { Pricing } from "@/components/catalog/pricing"

export const metadata: Metadata = {
  title: "Design systems for AI agents",
  description:
    "Open-source AI design systems for developers. Install a design-contract MCP in Cursor or Claude — ship coherent app UI.",
  openGraph: {
    title: "Design contracts · open source",
    description:
      "Fail-closed design systems delivered as MCP servers. Free to install — stdio runs on your machine.",
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

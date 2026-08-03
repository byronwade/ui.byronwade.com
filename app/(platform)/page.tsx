import type { Metadata } from "next"

import { CatalogHero } from "@/components/catalog/catalog-hero"
import { ContractList } from "@/components/catalog/contract-list"
import { HowItWorks } from "@/components/catalog/how-it-works"
import { Pricing } from "@/components/catalog/pricing"

export const metadata: Metadata = {
  title: {
    absolute: "Design contracts · ui.byronwade.com",
  },
  description:
    "Platform index of open-source AI design systems. Open a contract to experience that DNA end-to-end.",
}

/**
 * Platform homepage — technical catalog shell.
 * Individual systems live under /{contract} with their own skins.
 */
export default function HomePage() {
  return (
    <main data-slot="contracts-home" data-site="platform">
      <CatalogHero />
      <ContractList />
      <HowItWorks />
      <Pricing />
    </main>
  )
}

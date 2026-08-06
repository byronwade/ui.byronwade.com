import type { Metadata } from "next"

import { AgentStack } from "@/components/catalog/agent-stack"
import { CatalogHero } from "@/components/catalog/catalog-hero"
import { ContractList } from "@/components/catalog/contract-list"
import { HowItWorks } from "@/components/catalog/how-it-works"
import { Pricing } from "@/components/catalog/pricing"

export const metadata: Metadata = {
  title: {
    absolute: "Design contracts · MCP · markdown · skills",
  },
  description:
    "First open catalog of fail-closed design systems that install as MCP — with design.md as the law book and optional skills as the cookbook.",
}

/**
 * Platform homepage — technical catalog shell.
 * Individual systems live under /{contract} with their own skins.
 */
export default function HomePage() {
  return (
    <main data-slot="contracts-home" data-site="platform">
      <CatalogHero />
      <AgentStack />
      <ContractList />
      <HowItWorks />
      <Pricing />
    </main>
  )
}

import type { Metadata } from "next"

import { ContractThemeLabPage } from "@/components/contracts/pages/theme-lab-page"
import { getContract } from "@/lib/contracts/catalog"

type Params = { params: Promise<{ contract: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { contract: id } = await params
  const name = getContract(id)?.name ?? id
  return { title: "Theme", description: `Tokens, knobs, and contrast pairs for this contract. — ${name}.` }
}

export default async function Page({ params }: Params) {
  const { contract: id } = await params
  return <ContractThemeLabPage contractId={id} />
}

import type { Metadata } from "next"

import { ContractUiPage } from "@/components/contracts/pages/ui-page"
import { getContract } from "@/lib/contracts/catalog"

type Params = { params: Promise<{ contract: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { contract: id } = await params
  const name = getContract(id)?.name ?? id
  return { title: "UI", description: `The shared shadcn primitive set rendered with this contract's tokens. — ${name}.` }
}

export default async function Page({ params }: Params) {
  const { contract: id } = await params
  return <ContractUiPage contractId={id} />
}

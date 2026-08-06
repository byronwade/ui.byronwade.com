import type { Metadata } from "next"

import { ContractSurfacesLabPage } from "@/components/contracts/pages/surfaces-lab-page"
import { getContract } from "@/lib/contracts/catalog"

type Params = { params: Promise<{ contract: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { contract: id } = await params
  const name = getContract(id)?.name ?? id
  return { title: "Surfaces", description: `Workbench and composer shells restyled by this contract. — ${name}.` }
}

export default async function Page({ params }: Params) {
  const { contract: id } = await params
  return <ContractSurfacesLabPage contractId={id} />
}

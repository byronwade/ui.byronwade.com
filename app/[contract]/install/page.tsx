import type { Metadata } from "next"

import { ContractInstallPage } from "@/components/contracts/pages/install-page"
import { getContract } from "@/lib/contracts/catalog"

type Params = { params: Promise<{ contract: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { contract: id } = await params
  const name = getContract(id)?.name ?? id
  return { title: "Install", description: `MCP, JSON API, npx skills, and shadcn under this DNA. — ${name}.` }
}

export default async function Page({ params }: Params) {
  const { contract: id } = await params
  return <ContractInstallPage contractId={id} />
}

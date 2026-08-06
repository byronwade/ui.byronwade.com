import { notFound } from "next/navigation"

import { ContractExperience } from "@/components/contracts/contract-experience"
import { getContract } from "@/lib/contracts/catalog"

export default async function ContractHomePage({
  params,
}: {
  params: Promise<{ contract: string }>
}) {
  const { contract: id } = await params
  const contract = getContract(id)
  if (!contract) notFound()
  return <ContractExperience contract={contract} />
}

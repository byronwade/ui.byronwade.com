import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { ContractExperience } from "@/components/contracts/contract-experience"
import { getContract } from "@/lib/contracts/catalog"

export const metadata: Metadata = {
  title: "Atlas",
  description:
    "Atlas design contract — developer workbench. Experience the DNA on this page.",
}

export default function AtlasPage() {
  const contract = getContract("atlas")
  if (!contract) notFound()
  return <ContractExperience contract={contract} />
}

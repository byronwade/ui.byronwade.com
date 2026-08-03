import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { ContractExperience } from "@/components/contracts/contract-experience"
import { getContract } from "@/lib/contracts/catalog"

export const metadata: Metadata = {
  title: "Harbor",
  description:
    "Harbor design contract — calm ops admin. Experience the DNA on this page.",
}

export default function HarborPage() {
  const contract = getContract("harbor")
  if (!contract) notFound()
  return <ContractExperience contract={contract} />
}

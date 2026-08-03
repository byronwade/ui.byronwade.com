import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { ContractExperience } from "@/components/contracts/contract-experience"
import { getContract } from "@/lib/contracts/catalog"

export const metadata: Metadata = {
  title: "Vellum",
  description:
    "Vellum design contract — reading-first docs. Experience the DNA on this page.",
}

export default function VellumPage() {
  const contract = getContract("vellum")
  if (!contract) notFound()
  return <ContractExperience contract={contract} />
}

import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { ComingSoonContract } from "@/components/catalog/coming-soon"
import { getContract } from "@/lib/contracts/catalog"

export const metadata: Metadata = {
  title: "Vellum",
  description:
    "Vellum design contract — reading-first docs. Preview as an MCP server.",
}

export default function VellumPage() {
  const contract = getContract("vellum")
  if (!contract) notFound()
  return <ComingSoonContract contract={contract} />
}

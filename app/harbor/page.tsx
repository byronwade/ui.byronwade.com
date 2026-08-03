import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { ComingSoonContract } from "@/components/catalog/coming-soon"
import { getContract } from "@/lib/contracts/catalog"

export const metadata: Metadata = {
  title: "Harbor",
  description:
    "Harbor design contract — calm ops admin. Coming soon as an MCP server.",
}

export default function HarborPage() {
  const contract = getContract("harbor")
  if (!contract) notFound()
  return <ComingSoonContract contract={contract} />
}

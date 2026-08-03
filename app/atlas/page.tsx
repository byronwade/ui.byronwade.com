import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { ComingSoonContract } from "@/components/catalog/coming-soon"
import { getContract } from "@/lib/contracts/catalog"

export const metadata: Metadata = {
  title: "Atlas",
  description:
    "Atlas design contract — developer workbench. Coming soon as an MCP server.",
}

export default function AtlasPage() {
  const contract = getContract("atlas")
  if (!contract) notFound()
  return <ComingSoonContract contract={contract} />
}

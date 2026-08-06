import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { ContractFrame } from "@/components/chrome/contract-frame"
import { designContracts, getContract } from "@/lib/contracts/catalog"

/**
 * Every contract except Meridian is served from this one dynamic tree.
 *
 * Meridian keeps a static `app/meridian/**` tree because it authors extra
 * routes (skills, system docs, machine files); Next resolves static segments
 * before dynamic ones, so it wins automatically.
 *
 * Adding a contract is a DNA pack plus a skin block — never a route file.
 */
export function generateStaticParams() {
  return designContracts
    .filter((c) => c.id !== "meridian")
    .map((c) => ({ contract: c.id }))
}

export const dynamicParams = false

type Params = { params: Promise<{ contract: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { contract: id } = await params
  const contract = getContract(id)
  if (!contract) return {}
  return {
    title: { default: contract.name, template: `%s · ${contract.name}` },
    description: `${contract.name} design contract — ${contract.tagline}`,
  }
}

export default async function ContractLayout({
  params,
  children,
}: Params & { children: React.ReactNode }) {
  const { contract: id } = await params
  if (!getContract(id)) notFound()
  return <ContractFrame contractId={id}>{children}</ContractFrame>
}

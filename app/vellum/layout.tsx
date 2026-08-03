import type { Metadata } from "next"

import { ContractFrame } from "@/components/chrome/contract-frame"

export const metadata: Metadata = {
  title: {
    default: "Vellum",
    template: "%s · Vellum",
  },
  description:
    "Vellum design contract — reading-first docs & help. Mist lanes, measured prose.",
}

export default function VellumLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ContractFrame contractId="vellum">{children}</ContractFrame>
}

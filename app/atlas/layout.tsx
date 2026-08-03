import type { Metadata } from "next"

import { ContractFrame } from "@/components/chrome/contract-frame"

export const metadata: Metadata = {
  title: {
    default: "Atlas",
    template: "%s · Atlas",
  },
  description:
    "Atlas design contract — developer workbench. Ink chrome, mono metadata, keyboard-first.",
}

export default function AtlasLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ContractFrame contractId="atlas">{children}</ContractFrame>
}

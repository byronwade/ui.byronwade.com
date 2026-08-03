import type { Metadata } from "next"

import { ContractFrame } from "@/components/chrome/contract-frame"

export const metadata: Metadata = {
  title: {
    default: "Harbor",
    template: "%s · Harbor",
  },
  description:
    "Harbor design contract — calm ops admin. Quiet paper, semantic status, dense indexes.",
}

export default function HarborLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ContractFrame contractId="harbor">{children}</ContractFrame>
}

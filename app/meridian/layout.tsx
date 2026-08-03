import type { Metadata } from "next"

import { ContractFrame } from "@/components/chrome/contract-frame"

export const metadata: Metadata = {
  title: {
    default: "Meridian",
    template: "%s · Meridian",
  },
  description:
    "Meridian design contract — cinematic app UI for AI agents. Soft warm neutrals, one deep accent, typed grammar, MCP-ready.",
  openGraph: {
    title: "Meridian · Design contract",
    description:
      "Fail-closed AI design contract. Compose shadcn under Meridian laws.",
  },
}

export default function MeridianLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ContractFrame contractId="meridian">{children}</ContractFrame>
}

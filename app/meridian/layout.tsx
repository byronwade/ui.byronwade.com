import type { Metadata } from "next"

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

/**
 * Meridian contract shell — nested under the site root catalog.
 */
export default function MeridianLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

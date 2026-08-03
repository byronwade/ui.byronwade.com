import type { Metadata } from "next"
import Link from "next/link"
import { DocShell } from "@/components/docs/doc-shell"
import { MarkdownBody } from "@/components/docs/markdown-body"
import { Button } from "@/components/ui/button"
import { getDoc, requireSource } from "@/lib/docs/catalog"
import { loadSource } from "@/lib/docs/load-source"

const doc = getDoc("design")

export const metadata: Metadata = {
  title: "Design",
  description: doc.summary,
}

export default async function DesignPage() {
  const source = await loadSource(requireSource(doc))

  return (
    <DocShell
      eyebrow="Contract"
      title="Design"
      lead="The Meridian AI contract — cinematic laws, frozen grammar, and the MUST list. Read it as design; copy it as markdown."
      filename={doc.filename}
      rawHref={doc.rawHref}
      source={source}
      actions={
        <Button variant="ghost" size="default" asChild>
          <Link href="/meridian/agents.md">Agents</Link>
        </Button>
      }
    >
      <MarkdownBody source={source} />
    </DocShell>
  )
}

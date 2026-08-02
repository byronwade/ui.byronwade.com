import type { Metadata } from "next"
import Link from "next/link"
import { DocShell } from "@/components/docs/doc-shell"
import { MarkdownBody } from "@/components/docs/markdown-body"
import { Button } from "@/components/ui/button"
import { getDoc, requireSource } from "@/lib/docs/catalog"
import { loadSource } from "@/lib/docs/load-source"

const doc = getDoc("architecture")

export const metadata: Metadata = {
  title: "Architecture",
  description: doc.summary,
}

export default async function ArchitecturePage() {
  const source = await loadSource(requireSource(doc))

  return (
    <DocShell
      eyebrow="System"
      title="Architecture"
      lead="How Meridian layers contract, typed grammar, tokens, and cinema wholes — for humans and agents."
      filename={doc.filename}
      rawHref={doc.rawHref}
      source={source}
      actions={
        <Button variant="ghost" size="default" asChild>
          <Link href="/design">Design</Link>
        </Button>
      }
    >
      <MarkdownBody source={source} />
    </DocShell>
  )
}

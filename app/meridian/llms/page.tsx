import type { Metadata } from "next"
import { DocShell } from "@/components/docs/doc-shell"
import { MarkdownBody } from "@/components/docs/markdown-body"
import { getDoc, requireSource } from "@/lib/docs/catalog"
import { loadSource } from "@/lib/docs/load-source"

const doc = getDoc("llms")

export const metadata: Metadata = {
  title: "llms.txt",
  description: doc.summary,
}

export default async function LlmsPage() {
  const source = await loadSource(requireSource(doc))

  return (
    <DocShell
      eyebrow="Discovery"
      title="llms.txt"
      lead="The agent discovery map — designed for reading, copyable as the source file."
      filename={doc.filename}
      rawHref={doc.rawHref}
      source={source}
    >
      <MarkdownBody source={source} />
    </DocShell>
  )
}

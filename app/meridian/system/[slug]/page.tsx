import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { DocShell } from "@/components/docs/doc-shell"
import { MarkdownBody } from "@/components/docs/markdown-body"
import { Button } from "@/components/ui/button"
import { loadSource } from "@/lib/docs/load-source"
import { getSystemDoc, systemDocs } from "@/lib/docs/system-docs"

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return systemDocs.map((doc) => ({ slug: doc.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const doc = getSystemDoc(slug)
  if (!doc) return { title: "System" }
  return { title: doc.title, description: doc.summary }
}

export default async function SystemDocPage({ params }: Props) {
  const { slug } = await params
  const doc = getSystemDoc(slug)
  if (!doc) notFound()

  const source = await loadSource(doc.sourcePath)

  return (
    <DocShell
      eyebrow="System"
      title={doc.title}
      lead={doc.summary}
      filename={doc.filename}
      rawHref={`/meridian/system/${doc.slug}/raw`}
      source={source}
      actions={
        <>
          <Button variant="outline" size="default" asChild>
            <Link href="/meridian/system">All specs</Link>
          </Button>
          <Button variant="ghost" size="default" asChild>
            <Link href="/meridian/design">Design</Link>
          </Button>
        </>
      }
    >
      <MarkdownBody source={source} />
    </DocShell>
  )
}

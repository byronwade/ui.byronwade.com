import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { CopyButton } from "@/components/docs/copy-button"
import { DocShell } from "@/components/docs/doc-shell"
import { MarkdownBody } from "@/components/docs/markdown-body"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { CaretLeft } from "@/lib/icons"
import {
  FEATURED_ORDER,
  getSkill,
  getSkillSlugs,
  type SkillSlug,
} from "@/lib/skills/catalog"
import { skillProofs } from "@/lib/site/skill-proofs"

type SkillPageProps = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getSkillSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: SkillPageProps): Promise<Metadata> {
  const { slug } = await params
  const skill = await getSkill(slug)
  if (!skill) return { title: "Skill" }
  return {
    title: skill.name,
    description: skill.description,
  }
}

export default async function SkillDetailPage({ params }: SkillPageProps) {
  const { slug } = await params
  if (!FEATURED_ORDER.includes(slug as SkillSlug)) notFound()

  const skill = await getSkill(slug)
  if (!skill) notFound()
  const proof = skillProofs.find((p) => p.slug === skill.slug)

  return (
    <DocShell
      eyebrow="Skill"
      title={skill.name}
      lead={skill.description}
      filename={skill.path}
      source={skill.source}
      measure="reading"
      actions={
        <>
          <Button variant="outline" size="default" asChild>
            <Link href="/skills">
              <CaretLeft className="size-4" data-icon="inline-start" />
              Back
            </Link>
          </Button>
          {proof ? (
            <Button variant="default" size="default" asChild>
              <Link href={proof.proveHref}>{proof.proveLabel}</Link>
            </Button>
          ) : null}
          <CopyButton value={skill.install} label="Install" size="default" />
        </>
      }
    >
      <div className="mb-8 flex flex-wrap items-center gap-2 sm:hidden">
        <Button variant="outline" size="touch" asChild>
          <Link href="/skills">
            <CaretLeft className="size-4" data-icon="inline-start" />
            Back to skills
          </Link>
        </Button>
      </div>

      <section className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="font-mono text-[10px]">
            skills.sh
          </Badge>
          <Badge variant="outline" className="font-mono text-[10px]">
            {skill.slug}
          </Badge>
        </div>
        <Card className="py-0">
          <CardHeader className="gap-1 py-4">
            <CardTitle className="font-mono text-xs tracking-tight break-all">
              {skill.install}
            </CardTitle>
          </CardHeader>
        </Card>
        {proof ? (
          <Card className="py-0">
            <CardHeader className="gap-1 py-4">
              <p className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
                Prove on site · step {String(proof.step).padStart(2, "0")}
              </p>
              <CardTitle className="text-sm tracking-tight">
                <Link
                  href={proof.proveHref}
                  className="transition-opacity hover:opacity-70"
                >
                  {proof.proveLabel}
                </Link>
              </CardTitle>
              <p className="text-sm text-muted-foreground">{proof.summary}</p>
            </CardHeader>
          </Card>
        ) : null}
      </section>

      <div className="mt-12">
        <MarkdownBody source={skill.body} />
      </div>

      <div className="mt-14 flex flex-wrap gap-2 border-t border-border/70 pt-8">
        {proof ? (
          <Button variant="default" size="default" asChild>
            <Link href={proof.proveHref}>{proof.proveLabel}</Link>
          </Button>
        ) : null}
        <Button variant="outline" size="default" asChild>
          <Link href="/skills">
            <CaretLeft className="size-4" data-icon="inline-start" />
            Back to skills
          </Link>
        </Button>
      </div>
    </DocShell>
  )
}

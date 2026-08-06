import Link from "next/link"
import { notFound } from "next/navigation"

import { CopyButton } from "@/components/docs/copy-button"
import { DocShell } from "@/components/docs/doc-shell"
import { MarkdownBody } from "@/components/docs/markdown-body"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { getContract } from "@/lib/contracts/catalog"
import { contractSkillSlugs } from "@/lib/contracts/routes"
import { CaretLeft } from "@/lib/icons"
import { pathTemplates } from "@/lib/platform/skeleton"
import { getSkill } from "@/lib/skills/catalog"

async function ContractSkillDetailPage({
  contractId,
  slug,
}: {
  contractId: string
  slug: string
}) {
  const contract = getContract(contractId)
  if (!contract) notFound()
  if (!contractSkillSlugs(contractId).includes(slug)) notFound()

  const skill = await getSkill(slug)
  if (!skill) notFound()
  const base = pathTemplates.base(contractId)

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
            <Link href={`${base}/skills`}>
              <CaretLeft className="size-4" data-icon="inline-start" />
              Back
            </Link>
          </Button>
          <Button variant="default" size="default" asChild>
            <Link href={`${base}/surfaces`}>Prove on surfaces</Link>
          </Button>
          <CopyButton value={skill.install} label="Install" size="default" />
        </>
      }
    >
      <section className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="font-mono text-[10px]">
            {contract.name}
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
      </section>

      <div className="mt-12">
        <MarkdownBody source={skill.body} />
      </div>

      <div className="mt-14 flex flex-wrap gap-2 border-t border-border/70 pt-8">
        <Button variant="outline" size="default" asChild>
          <Link href={`${base}/skills`}>
            <CaretLeft className="size-4" data-icon="inline-start" />
            Back to skills
          </Link>
        </Button>
        <Button variant="ghost" size="default" asChild>
          <Link href={`${base}/for-agents`}>For agents</Link>
        </Button>
      </div>
    </DocShell>
  )
}

export { ContractSkillDetailPage }

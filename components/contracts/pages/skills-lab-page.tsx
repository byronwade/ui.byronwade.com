import Link from "next/link"

import { CopyButton } from "@/components/docs/copy-button"
import { DocShell } from "@/components/docs/doc-shell"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getContract } from "@/lib/contracts/catalog"
import { getContractInstall } from "@/lib/contracts/install"
import { contractSkillSlugs } from "@/lib/contracts/routes"
import { pathTemplates } from "@/lib/platform/skeleton"
import { listSkillsForContract } from "@/lib/skills/catalog"
import { notFound } from "next/navigation"

async function ContractSkillsLabPage({ contractId }: { contractId: string }) {
  const contract = getContract(contractId)
  const install = getContractInstall(contractId)
  if (!contract || !install) notFound()
  const base = pathTemplates.base(contractId)
  const slugs = contractSkillSlugs(contractId)
  const skills = await listSkillsForContract(contractId)

  return (
    <DocShell
      eyebrow="Skills"
      title={`${contract.name} agent skills`}
      lead={`${contract.name} ships a native skill pack — verified cookbooks for theme, compose, and DNA specialty. Law book + skills + CI gates are required; contract MCP is optional.`}
      actions={
        <>
          <Button variant="outline" size="default" asChild>
            <Link href={`${base}/install`}>Full install</Link>
          </Button>
          <Button variant="ghost" size="default" asChild>
            <Link href={`${base}/for-agents`}>For agents</Link>
          </Button>
        </>
      }
      measure="split"
      className="pb-24"
    >
      <div className="space-y-6">
        <Card size="sm">
          <CardHeader>
            <CardTitle>npx install</CardTitle>
            <CardDescription>{install.themeSkillNote}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start justify-between gap-3 rounded-lg bg-muted/40 p-3 edge">
              <pre className="overflow-x-auto font-mono text-[12px] text-foreground">
                {install.skillsNpx}
              </pre>
              <CopyButton value={install.skillsNpx} label="Copy" size="sm" />
            </div>
            <div className="flex items-start justify-between gap-3 rounded-lg bg-muted/40 p-3 edge">
              <pre className="overflow-x-auto font-mono text-[12px] text-foreground">
                {install.skillsNpxTheme}
              </pre>
              <CopyButton
                value={install.skillsNpxTheme}
                label="Copy"
                size="sm"
              />
            </div>
          </CardContent>
        </Card>

        <ul className="grid gap-3 sm:grid-cols-2">
          {(skills.length > 0 ? skills : slugs.map((slug) => ({ slug }))).map(
            (item) => {
              const slug = item.slug
              const meta = skills.find((s) => s.slug === slug)
              return (
                <li key={slug}>
                  <Link
                    href={`${base}/skills/${slug}`}
                    className="block rounded-2xl bg-card p-4 transition-colors hover:bg-muted/30 edge"
                  >
                    <p className="font-mono text-[12px] text-foreground">
                      {slug}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {meta?.description ??
                        `Native ${contract.name} skill · prove on ${base}`}
                    </p>
                  </Link>
                </li>
              )
            },
          )}
        </ul>
      </div>
    </DocShell>
  )
}

export { ContractSkillsLabPage }

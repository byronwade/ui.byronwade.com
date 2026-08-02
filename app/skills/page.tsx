import type { Metadata } from "next"
import Link from "next/link"
import { CopyButton } from "@/components/docs/copy-button"
import { DocShell } from "@/components/docs/doc-shell"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { CaretRight } from "@/lib/icons"
import { listSkills, SKILLS_REPO } from "@/lib/skills/catalog"

export const metadata: Metadata = {
  title: "Skills",
  description:
    "Top Meridian agent skills — theme, compose, cinematic, surfaces, a11y. Ready for skills.sh.",
}

export default async function SkillsPage() {
  const skills = await listSkills()
  const installAll = `npx skills add ${SKILLS_REPO}`

  return (
    <DocShell
      eyebrow="Skills"
      title="Top skills for Meridian."
      lead="Agent skills that keep AIs on-system — theme knobs, surfaces, composition, cinema, and contrast. Canonical source lives in skills/ for skills.sh."
      measure="wide"
      actions={
        <>
          <CopyButton value={installAll} label="Install all" size="default" />
          <Button variant="ghost" size="default" asChild>
            <Link href="/for-agents">Agents</Link>
          </Button>
        </>
      }
    >
      <section className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="font-mono text-[10px]">
            skills.sh
          </Badge>
          <p className="text-sm text-muted-foreground">
            Listing soon — install from the repo today.
          </p>
        </div>
        <Card className="py-0">
          <CardHeader className="gap-1 py-4">
            <CardTitle className="font-mono text-xs tracking-tight">
              {installAll}
            </CardTitle>
            <CardDescription>
              Discovers every skill under{" "}
              <span className="font-mono text-[12px]">skills/</span>.
            </CardDescription>
          </CardHeader>
        </Card>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-medium tracking-[-0.03em] md:text-2xl">
          Featured
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Five skills cover the Meridian loop — re-skin, pick a surface, compose
          wholes, stage cinema, audit contrast.
        </p>

        <ul className="mt-8 grid gap-3 md:grid-cols-2">
          {skills.map((skill) => (
            <li key={skill.slug}>
              <Card className="h-full py-0 transition-colors hover:bg-muted/30">
                <CardHeader className="gap-1.5 py-5">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-mono text-[10px] tracking-[0.14em] text-brand uppercase">
                      {String(skill.order + 1).padStart(2, "0")}
                    </p>
                    <Badge variant="outline" className="font-mono text-[10px]">
                      {skill.name}
                    </Badge>
                  </div>
                  <CardTitle className="text-base tracking-tight">
                    <Link
                      href={skill.href}
                      className="transition-opacity hover:opacity-70"
                    >
                      {skill.name}
                    </Link>
                  </CardTitle>
                  <CardDescription className="line-clamp-3 leading-relaxed">
                    {skill.description}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="flex flex-wrap items-center justify-between gap-2 border-t border-border/60 py-3">
                  <CopyButton
                    value={skill.install}
                    label="Install"
                    size="sm"
                  />
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={skill.href}>
                      Details
                      <CaretRight className="size-3.5" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </li>
          ))}
        </ul>
      </section>
    </DocShell>
  )
}

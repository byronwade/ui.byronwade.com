import type { Metadata } from "next"
import Link from "next/link"
import { CopyButton } from "@/components/docs/copy-button"
import { DocShell, DocLinkRow } from "@/components/docs/doc-shell"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { zones } from "@/lib/design"
import { getDoc } from "@/lib/docs/catalog"
import { loadSource } from "@/lib/docs/load-source"

export const metadata: Metadata = {
  title: "Agents",
  description:
    "How AIs load Meridian — contract, skills, agents, frozen vs creative.",
}

const skillFiles = [
  {
    name: "meridian-theme",
    path: "skills/meridian-theme/SKILL.md",
    href: "/skills/meridian-theme",
    use: "Re-skin knobs; keep one deep accent",
  },
  {
    name: "meridian-compose",
    path: "skills/meridian-compose/SKILL.md",
    href: "/skills/meridian-compose",
    use: "Build product wholes from shadcn + grammar",
  },
  {
    name: "meridian-cinematic",
    path: "skills/meridian-cinematic/SKILL.md",
    href: "/skills/meridian-cinematic",
    use: "Full-bleed frames under cinematic laws",
  },
  {
    name: "meridian-surface",
    path: "skills/meridian-surface/SKILL.md",
    href: "/skills/meridian-surface",
    use: "Pick data-surface + density",
  },
  {
    name: "meridian-a11y",
    path: "skills/meridian-a11y/SKILL.md",
    href: "/skills/meridian-a11y",
    use: "OKLCH + contrast audit on every UI change",
  },
] as const

const agentFiles = [
  {
    name: "meridian-author",
    path: ".cursor/agents/meridian-author.md",
    use: "Implement under design.md + lib/design",
  },
  {
    name: "meridian-reviewer",
    path: ".cursor/agents/meridian-reviewer.md",
    use: "Audit MUST / banned / cinema / contrast",
  },
] as const

export default async function ForAgentsPage() {
  const design = getDoc("design")
  const architecture = getDoc("architecture")
  const llms = getDoc("llms")
  const agentsDoc = getDoc("for-agents")
  const agentsSource = await loadSource(agentsDoc.sourcePath!)

  const skills = await Promise.all(
    skillFiles.map(async (skill) => ({
      ...skill,
      source: await loadSource(skill.path),
    })),
  )
  const agents = await Promise.all(
    agentFiles.map(async (agent) => ({
      ...agent,
      source: await loadSource(agent.path),
    })),
  )

  return (
    <DocShell
      eyebrow="For agents"
      title="Built so models stay true."
      lead="Soft warm neutrals. One deep accent. Full-bleed cinema. TypeScript freezes the vocabulary; creativity stays in the story. Contrast is audited."
      filename={agentsDoc.filename}
      source={agentsSource}
      rawHref={agentsDoc.rawHref}
      actions={
        <>
          <Button variant="outline" size="default" asChild>
            <Link href="/design">Design</Link>
          </Button>
          <Button variant="ghost" size="default" asChild>
            <Link href="/theme">Theme</Link>
          </Button>
        </>
      }
    >
      <section>
        <h2 className="text-xl font-medium tracking-[-0.03em] text-foreground md:text-2xl">
          Start here
        </h2>
        <DocLinkRow
          items={[
            {
              href: "/design.md",
              label: "design.md",
              summary: `${design.summary} Negotiated URL.`,
            },
            {
              href: "/agents.md",
              label: "agents.md",
              summary: "This guide — designed for humans, markdown for agents.",
            },
            {
              href: "/llms.txt",
              label: "llms.txt",
              summary: llms.summary,
            },
            {
              href: "/architecture.md",
              label: "architecture.md",
              summary: architecture.summary,
            },
          ]}
        />
      </section>

      <Separator className="my-14" />

      <section>
        <h2 className="text-xl font-medium tracking-[-0.03em] text-foreground md:text-2xl">
          Frozen vs creative
        </h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <Badge variant="secondary" className="font-mono text-[10px]">
                frozen
              </Badge>
              <CardTitle className="mt-2 font-mono text-sm text-brand">
                Locked
              </CardTitle>
              <CardDescription>
                Color, radius, depth, surfaces, bans, cinema laws, contrast.
              </CardDescription>
            </CardHeader>
            <ul className="space-y-2 px-(--card-spacing) pb-(--card-spacing)">
              {zones.frozen.map((item) => (
                <li
                  key={item}
                  className="font-mono text-sm text-muted-foreground"
                >
                  {item}
                </li>
              ))}
            </ul>
          </Card>
          <Card
            data-tone="theater"
            className="bg-dock text-dock-foreground edge"
          >
            <CardHeader>
              <Badge className="font-mono text-[10px]">creative</Badge>
              <CardTitle className="mt-2 font-mono text-sm text-brand">
                Free
              </CardTitle>
              <CardDescription className="text-dock-muted">
                Copy, IA, domain objects, frame sequence, shadcn composition.
              </CardDescription>
            </CardHeader>
            <ul className="space-y-2 px-(--card-spacing) pb-(--card-spacing)">
              {zones.creative.map((item) => (
                <li key={item} className="font-mono text-sm text-dock-muted">
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </section>

      <Separator className="my-14" />

      <section>
        <h2 className="text-xl font-medium tracking-[-0.03em] text-foreground md:text-2xl">
          Load order
        </h2>
        <ol className="mt-5 space-y-3">
          {[
            "design.md — contract",
            "lib/design/ — grammar, recipes, contrast",
            "Matching skill under skills/ (see /skills)",
            "Compose shadcn primitives into wholes",
            "npm run check:design && npm run check:contrast",
          ].map((step, i) => (
            <li
              key={step}
              className="flex gap-3 text-[1.0625rem] leading-relaxed tracking-tight text-foreground"
            >
              <span className="font-mono text-sm text-muted-foreground">
                {i + 1}.
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <Separator className="my-14" />

      <section id="skills" className="scroll-mt-24">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-medium tracking-[-0.03em] text-foreground md:text-2xl">
              Skills
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Canonical under{" "}
              <span className="font-mono text-[12px]">skills/</span> — browse
              the full index or copy a file.
            </p>
          </div>
          <Button variant="outline" size="default" asChild>
            <Link href="/skills">All skills</Link>
          </Button>
        </div>
        <ul className="mt-6 space-y-3">
          {skills.map((skill) => (
            <FileCard
              key={skill.name}
              kind="skill"
              name={skill.name}
              use={skill.use}
              source={skill.source}
              href={skill.href}
            />
          ))}
        </ul>
      </section>

      <Separator className="my-14" />

      <section id="agents" className="scroll-mt-24">
        <h2 className="text-xl font-medium tracking-[-0.03em] text-foreground md:text-2xl">
          Agents
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Author implements; reviewer audits cinema laws, bans, and contrast.
        </p>
        <ul className="mt-6 space-y-3">
          {agents.map((agent) => (
            <FileCard
              key={agent.name}
              kind="agent"
              name={agent.name}
              use={agent.use}
              source={agent.source}
            />
          ))}
        </ul>
      </section>
    </DocShell>
  )
}

function FileCard({
  kind,
  name,
  use,
  source,
  href,
}: {
  kind: "skill" | "agent"
  name: string
  use: string
  source: string
  href?: string
}) {
  return (
    <li>
      <Card>
        <CardHeader className="has-data-[slot=card-action]:grid-cols-[1fr_auto]">
          <Badge variant="secondary" className="w-fit font-mono text-[10px]">
            {kind}
          </Badge>
          <CardTitle className="mt-1 font-mono text-sm break-all">
            {href ? (
              <Link href={href} className="transition-opacity hover:opacity-70">
                {name}
              </Link>
            ) : (
              name
            )}
          </CardTitle>
          <CardDescription>{use}</CardDescription>
          <CardAction className="sm:hidden">
            <CopyButton value={source} label="Copy" size="icon-touch" />
          </CardAction>
        </CardHeader>
        <CardFooter className="hidden flex-wrap gap-2 border-t-0 bg-transparent sm:flex">
          <CopyButton value={source} label="Copy file" size="default" />
          {href ? (
            <Button variant="ghost" size="default" asChild>
              <Link href={href}>Details</Link>
            </Button>
          ) : null}
        </CardFooter>
      </Card>
    </li>
  )
}

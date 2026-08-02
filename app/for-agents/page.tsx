import type { Metadata } from "next"
import Link from "next/link"
import { CopyButton } from "@/components/docs/copy-button"
import { DocShell, DocLinkRow } from "@/components/docs/doc-shell"
import { Button } from "@/components/ui/button"
import { zones } from "@/lib/design"
import { getDoc } from "@/lib/docs/catalog"
import { loadSource } from "@/lib/docs/load-source"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Agents",
  description:
    "How AIs load Meridian — contract, skills, agents, frozen vs creative.",
}

const skillFiles = [
  {
    name: "meridian-theme",
    path: ".cursor/skills/meridian-theme/SKILL.md",
    use: "Re-skin knobs; keep one deep accent",
  },
  {
    name: "meridian-surface",
    path: ".cursor/skills/meridian-surface/SKILL.md",
    use: "Pick data-surface + density",
  },
  {
    name: "meridian-compose",
    path: ".cursor/skills/meridian-compose/SKILL.md",
    use: "Build product wholes from shadcn + grammar",
  },
  {
    name: "meridian-cinematic",
    path: ".cursor/skills/meridian-cinematic/SKILL.md",
    use: "Full-bleed frames under cinematic laws",
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
    use: "Audit MUST / banned / cinema laws",
  },
] as const

export default async function ForAgentsPage() {
  const design = getDoc("design")
  const architecture = getDoc("architecture")
  const llms = getDoc("llms")

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
      lead="Soft warm neutrals. One deep accent. Full-bleed cinema. TypeScript freezes the vocabulary; creativity stays in the story."
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
              href: design.href,
              label: design.filename!,
              summary: design.summary,
            },
            {
              href: architecture.href,
              label: architecture.filename!,
              summary: architecture.summary,
            },
            {
              href: llms.href,
              label: llms.filename!,
              summary: llms.summary,
            },
            {
              href: "/theme",
              label: "Theme grammar",
              summary: "Live knobs, roles, density, and bans.",
            },
          ]}
        />
      </section>

      <section className="mt-14">
        <h2 className="text-xl font-medium tracking-[-0.03em] text-foreground md:text-2xl">
          Frozen vs creative
        </h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-card p-5 edge md:p-6">
            <p className="font-mono text-[11px] tracking-[0.14em] text-brand uppercase">
              Frozen
            </p>
            <ul className="mt-4 space-y-2">
              {zones.frozen.map((item) => (
                <li
                  key={item}
                  className="font-mono text-sm text-muted-foreground"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl bg-dock p-5 text-dock-foreground md:p-6">
            <p className="font-mono text-[11px] tracking-[0.14em] text-brand uppercase">
              Creative
            </p>
            <ul className="mt-4 space-y-2">
              {zones.creative.map((item) => (
                <li
                  key={item}
                  className="font-mono text-sm text-dock-foreground/70"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-xl font-medium tracking-[-0.03em] text-foreground md:text-2xl">
          Load order
        </h2>
        <ol className="mt-5 space-y-3">
          {[
            "design.md — contract",
            "lib/design/ — grammar, recipes, cx",
            "Matching skill under .cursor/skills/",
            "BleedImage for cinema · ReadingArticle for docs",
            "npm run check:design",
          ].map((step, i) => (
            <li
              key={step}
              className="flex gap-3 text-[1.0625rem] leading-relaxed tracking-tight text-foreground/90"
            >
              <span className="font-mono text-sm text-muted-foreground">
                {i + 1}.
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <section id="skills" className="mt-14 scroll-mt-24">
        <h2 className="text-xl font-medium tracking-[-0.03em] text-foreground md:text-2xl">
          Skills
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Copy the skill file into your agent context.
        </p>
        <ul className="mt-6 space-y-3">
          {skills.map((skill) => (
            <FileCard
              key={skill.name}
              kind="skill"
              name={skill.name}
              use={skill.use}
              source={skill.source}
            />
          ))}
        </ul>
      </section>

      <section id="agents" className="mt-14 scroll-mt-24">
        <h2 className="text-xl font-medium tracking-[-0.03em] text-foreground md:text-2xl">
          Agents
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Author implements; reviewer audits cinema laws and bans.
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
}: {
  kind: "skill" | "agent"
  name: string
  use: string
  source: string
}) {
  return (
    <li className="rounded-2xl bg-card p-4 edge">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
            {kind}
          </p>
          <p className="mt-1 font-mono text-sm break-all text-foreground">
            {name}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">{use}</p>
        </div>
        <CopyButton
          value={source}
          label="Copy"
          size="icon-touch"
          className="shrink-0 sm:hidden"
        />
      </div>
      <CopyButton
        value={source}
        label="Copy file"
        size="touch"
        className={cn("mt-3 hidden w-full sm:inline-flex sm:w-auto")}
      />
    </li>
  )
}

import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { aiStack } from "@/lib/theme-showcase";

export const metadata: Metadata = {
  title: "For agents",
  description:
    "How AIs load Meridian — design.md, skills, agents, and theme architecture.",
};

const skills = [
  {
    name: "meridian-theme",
    path: ".cursor/skills/meridian-theme",
    use: "Re-skin tokens; keep accent DNA",
  },
  {
    name: "meridian-surface",
    path: ".cursor/skills/meridian-surface",
    use: "Pick data-surface + density",
  },
  {
    name: "meridian-compose",
    path: ".cursor/skills/meridian-compose",
    use: "Build product wholes from shadcn + tokens",
  },
] as const;

const agents = [
  {
    name: "meridian-author",
    path: ".cursor/agents/meridian-author.md",
    use: "Implement UI end-to-end under design.md",
  },
  {
    name: "meridian-reviewer",
    path: ".cursor/agents/meridian-reviewer.md",
    use: "Audit diffs against MUST / MUST NOT",
  },
] as const;

export default function ForAgentsPage() {
  return (
    <main className="px-5 pt-20 pb-24 md:px-8 md:pt-24 md:pb-32">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-xs tracking-[0.18em] text-muted-foreground uppercase">
          For agents
        </p>
        <h1 className="mt-4 max-w-[20ch] text-3xl font-medium tracking-[-0.035em] md:text-5xl">
          Built so models can ship on-theme UI.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed tracking-tight text-muted-foreground">
          Meridian is architecture for AIs: a short contract, theme knobs,
          surface remaps, skills, and agents. Humans showcase the theme —
          agents author the product.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild>
            <a href="/design.md">Fetch design.md</a>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/theme">Theme showcase</Link>
          </Button>
        </div>

        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {aiStack.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="rounded-2xl bg-card p-4 transition-colors edge hover:bg-muted/30"
            >
              <p className="font-mono text-[10px] tracking-[0.14em] text-brand uppercase">
                {item.label}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.summary}
              </p>
            </Link>
          ))}
        </div>

        <Separator className="my-14" />

        <section id="architecture" className="scroll-mt-24">
          <h2 className="text-2xl font-medium tracking-[-0.03em]">
            Load order
          </h2>
          <ol className="reading-ui mt-5 list-decimal space-y-3 pl-5 text-sm leading-relaxed text-muted-foreground">
            <li>
              <span className="font-mono text-foreground">design.md</span> —
              MUST / MUST NOT and theme knobs
            </li>
            <li>
              <span className="font-mono text-foreground">
                docs/architecture.md
              </span>{" "}
              — layer map
            </li>
            <li>Matching skill under{" "}
              <span className="font-mono text-foreground">.cursor/skills/</span>
            </li>
            <li>
              Canonical whole{" "}
              <span className="font-mono text-foreground">
                components/surfaces/workbench.tsx
              </span>
            </li>
            <li>
              Tokens in{" "}
              <span className="font-mono text-foreground">app/globals.css</span>
            </li>
          </ol>
        </section>

        <Separator className="my-14" />

        <section id="skills" className="scroll-mt-24">
          <h2 className="text-2xl font-medium tracking-[-0.03em]">Skills</h2>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Progressive workflows — loaded when the task matches. Mirrored for
            Claude under{" "}
            <span className="font-mono text-foreground">.claude/skills/</span>.
          </p>
          <ul className="mt-6 space-y-3">
            {skills.map((skill) => (
              <li
                key={skill.name}
                className="flex flex-wrap items-baseline justify-between gap-2 rounded-2xl bg-card px-4 py-3 edge"
              >
                <div>
                  <Badge variant="secondary" className="font-mono text-[10px]">
                    skill
                  </Badge>
                  <p className="mt-2 font-mono text-sm text-foreground">
                    {skill.name}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {skill.use}
                  </p>
                </div>
                <p className="font-mono text-[11px] text-muted-foreground">
                  {skill.path}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <Separator className="my-14" />

        <section id="agents" className="scroll-mt-24">
          <h2 className="text-2xl font-medium tracking-[-0.03em]">Agents</h2>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Roles with checklists. Always-on rule:{" "}
            <span className="font-mono text-foreground">
              .cursor/rules/meridian.mdc
            </span>
            .
          </p>
          <ul className="mt-6 space-y-3">
            {agents.map((agent) => (
              <li
                key={agent.name}
                className="flex flex-wrap items-baseline justify-between gap-2 rounded-2xl bg-card px-4 py-3 edge"
              >
                <div>
                  <Badge variant="secondary" className="font-mono text-[10px]">
                    agent
                  </Badge>
                  <p className="mt-2 font-mono text-sm text-foreground">
                    {agent.name}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {agent.use}
                  </p>
                </div>
                <p className="font-mono text-[11px] text-muted-foreground">
                  {agent.path}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <Separator className="my-14" />

        <section>
          <h2 className="text-2xl font-medium tracking-[-0.03em]">
            Machine endpoints
          </h2>
          <dl className="mt-6 grid gap-3 sm:grid-cols-2">
            {(
              [
                ["/design.md", "AI contract (raw markdown)"],
                ["/llms.txt", "Discovery map for AI crawlers"],
                ["/theme", "Live theme showcase"],
                ["/surfaces", "Four surface proofs"],
              ] as const
            ).map(([href, label]) => (
              <div
                key={href}
                className="rounded-2xl bg-muted/30 px-4 py-3"
              >
                <dt className="font-mono text-sm text-foreground">
                  <a href={href} className="hover:underline">
                    {href}
                  </a>
                </dt>
                <dd className="mt-1 text-sm text-muted-foreground">{label}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </main>
  );
}

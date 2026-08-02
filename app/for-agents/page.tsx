import type { Metadata } from "next"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ReadingArticle } from "@/components/reading/article"
import { zones, designCn, typeClass } from "@/lib/design"
import { aiStack } from "@/lib/theme-showcase"

export const metadata: Metadata = {
  title: "For agents",
  description:
    "How AIs load Meridian — soft neutrals, one accent, typed cinematic grammar, structured reading.",
}

const skills = [
  {
    name: "meridian-theme",
    use: "Re-skin knobs; keep one deep accent",
  },
  {
    name: "meridian-surface",
    use: "Pick data-surface + density",
  },
  {
    name: "meridian-compose",
    use: "Build product wholes from shadcn + grammar",
  },
  {
    name: "meridian-cinematic",
    use: "Full-bleed frames under cinematic laws",
  },
] as const

const agents = [
  {
    name: "meridian-author",
    use: "Implement under design.md + lib/design",
  },
  {
    name: "meridian-reviewer",
    use: "Audit MUST / banned / cinema laws",
  },
] as const

export default function ForAgentsPage() {
  return (
    <main className="px-5 pt-20 pb-24 md:px-8 md:pt-24 md:pb-32">
      <div className="mx-auto max-w-6xl">
        <ReadingArticle
          lane="ui"
          eyebrow="For agents"
          title="Built so models can’t drift — and still invent."
          lead="Soft warm neutrals. One deep accent. Full-bleed cinema. Structured reading. TypeScript freezes the vocabulary; creativity stays in the story."
        >
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <a href="/design.md">Fetch design.md</a>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/theme">Theme grammar</Link>
            </Button>
          </div>
        </ReadingArticle>

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

        <section id="zones" className="scroll-mt-24">
          <h2 className={designCn(typeClass("title"), "text-2xl")}>
            Frozen vs creative
          </h2>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div className="rounded-3xl bg-card p-6 edge">
              <p className={designCn(typeClass("label"), "text-brand")}>
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
            <div className="rounded-3xl bg-dock p-6 text-dock-foreground">
              <p className={designCn(typeClass("label"), "text-brand")}>
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

        <Separator className="my-14" />

        <section id="architecture" className="scroll-mt-24">
          <ReadingArticle lane="ui" title="Load order">
            <ol className="list-decimal space-y-3 pl-5">
              <li>
                <span className="font-mono text-foreground">design.md</span>
              </li>
              <li>
                <span className="font-mono text-foreground">lib/design/</span> —
                grammar, recipes, cx
              </li>
              <li>
                Matching skill under{" "}
                <span className="font-mono text-foreground">
                  .cursor/skills/
                </span>
              </li>
              <li>
                Full-bleed via{" "}
                <span className="font-mono text-foreground">BleedImage</span>;
                reading via{" "}
                <span className="font-mono text-foreground">
                  ReadingArticle
                </span>
              </li>
              <li>
                Run{" "}
                <span className="font-mono text-foreground">
                  npm run check:design
                </span>
              </li>
            </ol>
          </ReadingArticle>
        </section>

        <Separator className="my-14" />

        <section id="skills" className="scroll-mt-24">
          <h2 className={designCn(typeClass("title"), "text-2xl")}>Skills</h2>
          <ul className="mt-6 space-y-3">
            {skills.map((skill) => (
              <li
                key={skill.name}
                className="rounded-2xl bg-card px-4 py-3 edge"
              >
                <Badge variant="secondary" className="font-mono text-[10px]">
                  skill
                </Badge>
                <p className="mt-2 font-mono text-sm">{skill.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">{skill.use}</p>
              </li>
            ))}
          </ul>
        </section>

        <Separator className="my-14" />

        <section id="agents" className="scroll-mt-24">
          <h2 className={designCn(typeClass("title"), "text-2xl")}>Agents</h2>
          <ul className="mt-6 space-y-3">
            {agents.map((agent) => (
              <li
                key={agent.name}
                className="rounded-2xl bg-card px-4 py-3 edge"
              >
                <Badge variant="secondary" className="font-mono text-[10px]">
                  agent
                </Badge>
                <p className="mt-2 font-mono text-sm">{agent.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">{agent.use}</p>
              </li>
            ))}
          </ul>
        </section>

        <Separator className="my-14" />

        <section>
          <h2 className={designCn(typeClass("title"), "text-2xl")}>
            Machine endpoints
          </h2>
          <dl className="mt-6 grid gap-3 sm:grid-cols-2">
            {(
              [
                ["/design.md", "AI contract"],
                ["/llms.txt", "Discovery map"],
                ["/theme", "Live grammar"],
                ["/surfaces", "Surface proofs"],
              ] as const
            ).map(([href, label]) => (
              <div key={href} className="rounded-2xl bg-muted/40 px-4 py-3">
                <dt className="font-mono text-sm">
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
  )
}

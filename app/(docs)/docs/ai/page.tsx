import type { Metadata } from "next"
import type { ReactNode } from "react"
import Link from "next/link"
import {
  BookOpen,
  Palette,
  SlidersHorizontal,
  StackSimple,
  Wheelchair,
} from "@/lib/icons"

import { CodeBlock } from "@/app/(docs)/_components/code-block"
import { BLEED, DocsIntro } from "@/app/(docs)/_components/docs-prose"
import { GuidePager } from "@/app/(docs)/_components/guide-pager"
import { REGISTRY_URL } from "@/content/guides"

export const metadata: Metadata = {
  title: "AI rules, byronwade/ui",
  description:
    "Install one design-system rule so your AI agent keeps building with byronwade/ui components and tokens.",
}

/* ---------------------------------------------------------------------------
   AI rules = a file you hand your agent. Distinct signature: the hero is the
   rule rendered as a code editor (filename tab + line numbers). @byronwade/
   design-rules is a real registry item.
--------------------------------------------------------------------------- */

const RULE_LINES = [
  "---",
  "description: byronwade/ui, how agents build UI",
  "alwaysApply: true",
  "---",
  "",
  "# Compose from the system. Never hardcode color.",
  "",
  "- Reach for @byronwade/ui components; add missing",
  "  ones with shadcn, don't rebuild from scratch.",
  "- Tokens only: bg-brand, text-muted-foreground.",
  "  Never hex, rgb, or Tailwind palette colors.",
  "- Re-skin through --brand alone, rings, charts,",
  "  and success states follow automatically.",
  "- Depth is the `edge` hairline. No drop shadows.",
  "- Long-form copy: reading-ui (docs) or",
  "  reading-prose (essays). UI chrome stays",
  "  font-sans + text-sm. Cap measure at 65ch.",
]

const ENFORCES: {
  icon: typeof StackSimple
  title: string
  body: ReactNode
}[] = [
  {
    icon: StackSimple,
    title: "Compose, don't reinvent",
    body: "Existing component before a bespoke div.",
  },
  {
    icon: Palette,
    title: "Tokens, not hex",
    body: "Semantic tokens only, never raw colors.",
  },
  {
    icon: SlidersHorizontal,
    title: "Re-skin via --brand",
    body: (
      <>
        One variable drives the{" "}
        <Link
          href="/docs/theming"
          className="text-brand underline-offset-4 hover:underline"
        >
          brand
        </Link>{" "}
        accent.
      </>
    ),
  },
  {
    icon: Wheelchair,
    title: "A11y + dark free",
    body: "Labels, focus, keyboard; dark from tokens.",
  },
  {
    icon: BookOpen,
    title: "Readability lanes",
    body: (
      <>
        <Link
          href="/docs/readability"
          className="text-brand underline-offset-4 hover:underline"
        >
          reading-ui / reading-prose
        </Link>{" "}
        for copy; text-sm for UI.
      </>
    ),
  },
]

const TOOLS: { name: string; path: string; note?: string }[] = [
  {
    name: "Cursor",
    path: ".cursor/rules/byronwade-ui.mdc",
    note: "installed by the command",
  },
  { name: "Claude Code", path: "CLAUDE.md" },
  { name: "GitHub Copilot", path: ".github/copilot-instructions.md" },
  { name: "Codex / AGENTS", path: "AGENTS.md" },
  { name: "Windsurf", path: ".windsurfrules" },
]

export default function AiPage() {
  return (
    <article className="max-w-none">
      {/* ============================ HERO, the rule file ============== */}
      <section className="grid items-center gap-10 py-12 lg:grid-cols-[5fr_7fr] lg:py-16">
        <div className="animate-in fade-in slide-in-from-bottom-3 duration-700">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">
            Foundation · AI rules
          </p>
          <h1 className="mt-4 text-[clamp(2.25rem,6vw,4rem)] font-normal leading-[1.05] tracking-tight text-foreground text-balance">
            Teach your agent the system once.
          </h1>
          <DocsIntro className="max-w-md">
            One{" "}
            <Link
              href="/docs/installation"
              className="text-brand underline-offset-4 hover:underline"
            >
              installable
            </Link>{" "}
            rule keeps Cursor, Claude, Copilot, Windsurf and Codex building on
            the same{" "}
            <Link
              href="/docs/foundation"
              className="text-brand underline-offset-4 hover:underline"
            >
              tokens
            </Link>
            , no re-explaining on every edit.
          </DocsIntro>
          <div className="mt-6">
            <CodeBlock
              lang="bash"
              code={`npx shadcn@latest add @byronwade/design-rules`}
            />
          </div>
        </div>

        {/* The rule file itself, in the same CodeBlock every other page uses. */}
        <div className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both duration-700 [animation-delay:150ms]">
          <p className="mb-2 font-mono text-[11px] tracking-wide text-muted-foreground uppercase">
            byronwade-ui.mdc
          </p>
          <CodeBlock lang="markdown" code={RULE_LINES.join("\n")} />
        </div>
      </section>

      {/* ============================ WHAT IT ENFORCES (strip) ========== */}
      <section className={`${BLEED} border-y border-border bg-card`}>
        <div className="py-14">
          <p className="mb-8 font-mono text-xs uppercase tracking-[0.2em] text-brand">
            What the rule enforces
          </p>
          <div className="grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-5">
            {ENFORCES.map(({ icon: Icon, title, body }) => (
              <div key={title}>
                <span className="inline-flex size-9 items-center justify-center rounded-xl bg-brand/10 text-brand">
                  <Icon className="size-5" />
                </span>
                <h2 className="mt-4 text-base font-medium tracking-tight text-foreground">
                  {title}
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground text-pretty">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ EVERY TOOL ======================== */}
      <section className="py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">
            Every tool, one rule
          </p>
          <p className="font-mono text-[11px] text-muted-foreground">
            raw: {REGISTRY_URL}/r/design-rules.json
          </p>
        </div>
        <div className="mt-6 divide-y divide-edge overflow-hidden rounded-2xl edge">
          {TOOLS.map((t) => (
            <div
              key={t.name}
              className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 bg-card px-5 py-4"
            >
              <span className="text-sm font-medium text-foreground">
                {t.name}
              </span>
              <div className="flex items-center gap-3">
                {t.note ? (
                  <span className="text-xs text-muted-foreground">
                    {t.note}
                  </span>
                ) : null}
                <code className="font-mono text-[12px] text-brand">
                  {t.path}
                </code>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================ NAV ============================== */}
      <GuidePager current="/docs/ai" />
    </article>
  )
}

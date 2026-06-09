import type { Metadata } from "next"
import Link from "next/link"

import { CodeBlock } from "@/app/(docs)/_components/code-block"
import { GuidePager } from "@/app/(docs)/_components/guide-pager"
import { DocsIntro } from "@/app/(docs)/_components/docs-prose"
import {
  ReadabilityPlayground,
  ReadabilityShowcase,
} from "@/app/(docs)/_components/readability-playground"
import {
  DESIGN_DECISIONS,
  RESEARCH_SOURCES,
} from "@/app/(docs)/_components/readability-tokens"

export const metadata: Metadata = {
  title: "Readability, byronwade/ui",
  description:
    "Why byronwade/ui encodes evidence-based web reading in foundation — two lanes, 65ch measure, and reading-ui / reading-prose utilities.",
}

const BLEED = "-mx-6 px-6 sm:-mx-8 sm:px-8 lg:-mx-10 lg:px-10"

export default function ReadabilityPage() {
  return (
    <article className="max-w-none">
      {/* ============================ HERO ============================= */}
      <section
        className={`relative ${BLEED} overflow-hidden border-b border-border`}
      >
        <div className="glow-brand pointer-events-none absolute inset-x-0 -top-24 h-56 opacity-40" />
        <div className="relative py-12 lg:py-16">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">
            Foundation · Readability
          </p>
          <h1 className="mt-4 max-w-3xl text-[clamp(2.25rem,6vw,4rem)] font-normal leading-[1.05] tracking-tight text-foreground text-balance">
            We chose calm <span className="text-brand">and</span> readable.
          </h1>
          <DocsIntro className="mt-6">
            Most design systems optimize for dashboards — then leave long-form
            copy to guesswork. byronwade/ui bakes peer-reviewed web reading
            parameters into{" "}
            <Link
              href="/docs/foundation"
              className="text-brand underline-offset-4 hover:underline"
            >
              foundation
            </Link>{" "}
            so articles, docs, and UI chrome each get the lane they deserve.
            This page is the reasoning, not a literature review.
          </DocsIntro>
        </div>
      </section>

      {/* ============================ THESIS =========================== */}
      <section className="py-16">
        <div className="reading-prose text-foreground">
          <p>
            Readable web typography is not about mimicking paper, e-ink, or
            speed-reading hacks. Emissive screens reward capped measure,
            generous line height, neutral letter-spacing on paragraphs, and
            semantic token contrast. The research agrees on those constraints
            even when it disagrees on which font is fastest for you personally.
          </p>
          <p>
            So we did not ship a “reading theme.” We shipped utilities —
            <span className="font-mono text-[0.9em] text-brand">
              {" "}
              reading-ui
            </span>{" "}
            and{" "}
            <span className="font-mono text-[0.9em] text-brand">
              reading-prose
            </span>{" "}
            — and wired them into the{" "}
            <Link
              href="/docs/ai"
              className="text-brand underline-offset-4 hover:underline"
            >
              AI rule
            </Link>
            , marketing layouts, and this documentation. The accent stays on
            surfaces; the science stays on copy.
          </p>
        </div>
      </section>

      {/* ============================ DECISIONS ======================== */}
      <section className={`${BLEED} border-y border-border bg-card`}>
        <div className="py-14">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">
            Why we took this road
          </p>
          <h2 className="mt-3 text-3xl font-normal tracking-tight text-foreground text-balance sm:text-4xl">
            Research → decision → utility.
          </h2>
          <ol className="mt-10 space-y-8">
            {DESIGN_DECISIONS.map((d) => (
              <li
                key={d.step}
                className="grid gap-4 border-b border-border/60 pb-8 last:border-0 last:pb-0 lg:grid-cols-[4rem_1fr]"
              >
                <span className="font-mono text-sm text-brand">{d.step}</span>
                <div className="space-y-3">
                  <h3 className="text-xl font-normal tracking-tight text-foreground">
                    {d.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    <span className="text-foreground">Because · </span>
                    {d.because}
                  </p>
                  <p className="text-sm leading-relaxed text-foreground">
                    <span className="font-mono text-[11px] text-brand">
                      We chose ·{" "}
                    </span>
                    {d.weChose}
                  </p>
                  <a
                    href={d.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block font-mono text-[11px] text-muted-foreground underline-offset-4 hover:text-brand hover:underline"
                  >
                    {d.source} ↗
                  </a>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ============================ SHOWCASE ========================= */}
      <section
        className={`relative ${BLEED} overflow-hidden border-b border-border`}
      >
        <div className="relative py-12 sm:py-16">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">
            Three lanes
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl font-normal tracking-tight text-foreground text-balance sm:text-4xl">
            Same words. Different job.
          </h2>
          <p className="reading-ui mt-4 text-foreground text-pretty">
            One paragraph rendered three ways — UI density, docs sans, essay
            serif. The lanes draw on the same{" "}
            <Link
              href="/docs/typography"
              className="text-brand underline-offset-4 hover:underline"
            >
              type families
            </Link>
            , but only the reading lanes get measure caps and paragraph spacing.
            This is the system working as designed.
          </p>
          <ReadabilityShowcase />
        </div>
      </section>

      {/* ============================ PLAYGROUND ======================= */}
      <section className="py-16">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">
          Explore the bounds
        </p>
        <h2 className="mt-3 text-3xl font-normal tracking-tight text-foreground text-balance sm:text-4xl">
          Stress-test measure and rhythm.
        </h2>
        <p className="reading-ui mt-4 text-foreground text-pretty">
          Drag past 80ch to feel WCAG friction. Pull below 45ch to feel rhythm
          break. Defaults match foundation, and the same caps route correctly
          across{" "}
          <Link
            href="/docs/surfaces"
            className="text-brand underline-offset-4 hover:underline"
          >
            application and marketing surfaces
          </Link>{" "}
          — you should rarely need to override.
        </p>
        <ReadabilityPlayground />
      </section>

      {/* ============================ SHIPPED ============================ */}
      <section className={`${BLEED} border-y border-border bg-card`}>
        <div className="py-14">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">
            Shipped in foundation
          </p>
          <h2 className="mt-3 text-3xl font-normal tracking-tight text-foreground text-balance sm:text-4xl">
            Use the utilities. Don&apos;t re-roll.
          </h2>
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            <CodeBlock
              lang="tsx"
              code={`// Docs, release notes, in-app help
<article className="reading-ui text-foreground">
  <p>65ch sans body at 16px / 1.6.</p>
</article>

// Essays, manifestos, article variant
<article className="reading-prose text-foreground">
  <p>65ch serif body at 18px / 1.7.</p>
</article>

// Width only
<div className="reading-measure">…</div>`}
            />
            <CodeBlock
              lang="tsx"
              code={`// marketing-layout article variant — reading-prose baked in
<MarketingLayout variant="article">
  {essayParagraphs}
</MarketingLayout>

// marketing-layout docs-marketing — reading-ui on main
<MarketingLayout variant="docs-marketing" sidebar={…}>
  {guideContent}
</MarketingLayout>`}
            />
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                util: "reading-measure",
                desc: "65ch max-width only",
              },
              {
                util: "reading-ui",
                desc: "Docs lane · sans · 16px · headings, lists, links",
              },
              {
                util: "reading-prose",
                desc: "Essay lane · serif · 18px · full in-flow typography",
              },
              {
                util: "reading-lead",
                desc: "Optional opener — slightly larger first paragraph",
              },
              {
                util: "reading-muted",
                desc: "Secondary copy inside a lane — AA-friendly mix",
              },
              {
                util: "reading-demo-break",
                desc: "Full-width band above demos — breaks reading measure",
              },
            ].map((u) => (
              <div key={u.util} className="rounded-2xl edge bg-background p-4">
                <p className="font-mono text-xs text-brand">{u.util}</p>
                <p className="mt-2 text-sm text-muted-foreground">{u.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ SOURCES ========================== */}
      <section className="py-16">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">
          Primary sources
        </p>
        <ul className="mt-6 space-y-3">
          {RESEARCH_SOURCES.map((s) => (
            <li key={s.href} className="text-sm">
              <a
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="text-brand underline-offset-4 hover:underline"
              >
                {s.label}
              </a>
              <span className="text-muted-foreground"> — {s.note}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ============================ NAV ============================== */}
      <GuidePager current="/docs/readability" />
    </article>
  )
}

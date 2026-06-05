import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Philosophy — byronwade/ui",
  description:
    "The whole idea, start to finish — why byronwade/ui is calm, warm, token-driven, and entirely yours.",
}

/* ---------------------------------------------------------------------------
   Philosophy = the manifesto. Distinct signature: editorial, serif-led prose
   with numbered tenets and a start-to-finish journey through the Get Started
   pages. Rich, not bland — big type, the green accent, edge cards, small token
   demos woven in.
--------------------------------------------------------------------------- */

const BLEED = "-mx-6 px-6 sm:-mx-8 sm:px-8 lg:-mx-10 lg:px-10"

const TENETS: {
  n: string
  title: string
  body: string
  demo?: React.ReactNode
}[] = [
  {
    n: "01",
    title: "Warm, never stark",
    body: "A warm paper canvas and warm near-black ink — never pure white, never pure black. Clinical neutrals keep you at arm's length; a little warmth invites you to stay and read.",
    demo: (
      <div className="flex gap-2">
        <span className="h-10 flex-1 rounded-lg edge bg-background" />
        <span className="h-10 flex-1 rounded-lg edge bg-card" />
        <span className="h-10 flex-1 rounded-lg edge bg-muted" />
        <span className="h-10 flex-1 rounded-lg edge bg-foreground" />
      </div>
    ),
  },
  {
    n: "02",
    title: "One accent",
    body: "Every emphatic thing — rings, charts, success, active states — derives from a single brand token. One voltage, used sparingly, reads as confidence; a rainbow reads as noise.",
    demo: (
      <div className="flex items-center gap-2">
        {[
          "bg-brand",
          "bg-brand/60",
          "bg-brand/30",
          "bg-brand/15",
          "bg-brand/10",
        ].map((c) => (
          <span key={c} className={`h-10 flex-1 rounded-lg edge ${c}`} />
        ))}
      </div>
    ),
  },
  {
    n: "03",
    title: "Tokens, never raw color",
    body: "Nothing is hardcoded. Every value is a semantic token, so dark mode and a full re-skin come for free — change one variable, not a hundred call sites.",
  },
  {
    n: "04",
    title: "Depth is a hairline",
    body: "No drop shadows. A single inset edge gives a surface just enough presence to sit into its background. Flatness, executed with care, reads as quality.",
    demo: (
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl edge bg-card p-3 text-xs text-muted-foreground">
          edge
        </div>
        <div className="rounded-xl bg-card p-3 text-xs text-muted-foreground">
          none
        </div>
      </div>
    ),
  },
  {
    n: "05",
    title: "Restraint in type",
    body: "Hierarchy comes from size, tracking, and the typeface — not heavy weights or color. Three families, each with one job: sans for interface, mono for data, serif for reading.",
  },
  {
    n: "06",
    title: "Compose, don't reinvent",
    body: "Primitives become composites become whole pages. Consistency isn't enforced; it's the natural byproduct of always reaching for what already exists.",
  },
  {
    n: "07",
    title: "Every page earns a hero",
    body: "No generic, repeated card grids. Each surface gets one signature moment that belongs only to it — the catalog, the terminal, the swatch wall, the specimen.",
  },
  {
    n: "08",
    title: "Yours to own",
    body: "Installed via the shadcn registry, the code is copied into your repo — no runtime dependency, no lock-in. And the design rules ship too, so your AI agent stays on-system on every edit.",
  },
]

const JOURNEY: { step: string; href: string; label: string; blurb: string }[] =
  [
    {
      step: "01",
      href: "/docs",
      label: "Introduction",
      blurb: "What it is and the catalog at a glance.",
    },
    {
      step: "02",
      href: "/docs/installation",
      label: "Installation",
      blurb: "Wire the foundation, add components.",
    },
    {
      step: "03",
      href: "/docs/foundation",
      label: "Foundation",
      blurb: "The tokens everything is built on.",
    },
    {
      step: "04",
      href: "/docs/theming",
      label: "Theming",
      blurb: "Re-skin the whole system from one variable.",
    },
    {
      step: "05",
      href: "/docs/typography",
      label: "Typography",
      blurb: "The three families and the scale.",
    },
    {
      step: "06",
      href: "/docs/ai",
      label: "AI rules",
      blurb: "Keep your agent building on-system.",
    },
  ]

export default function PhilosophyPage() {
  return (
    <article className="max-w-none">
      {/* ============================ HERO ============================= */}
      <section
        className={`relative ${BLEED} overflow-hidden border-b border-border`}
      >
        <div className="glow-brand pointer-events-none absolute inset-x-0 -top-24 h-56 opacity-50" />
        <div className="relative max-w-3xl py-16 sm:py-24">
          <p className="animate-in fade-in slide-in-from-bottom-3 font-mono text-xs uppercase tracking-[0.2em] text-brand duration-700">
            Foundation · Philosophy
          </p>
          <h1 className="mt-6 text-[clamp(2.5rem,7vw,5rem)] font-normal leading-[0.98] tracking-tight text-foreground text-balance">
            Calm software, built to last.
          </h1>
          <p className="mt-8 font-serif text-[clamp(1.25rem,2.5vw,1.75rem)] leading-[1.5] text-foreground text-pretty">
            Most systems drift — every surface reinvents its own buttons,
            spacing, and color. This one is the opposite: a single, quiet,
            content-first aesthetic that any project can adopt in minutes and
            make its own from one variable. These are the convictions it&apos;s
            built on.
          </p>
        </div>
      </section>

      {/* ============================ TENETS ========================== */}
      <section className="py-16">
        <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2">
          {TENETS.map((t) => (
            <div key={t.n}>
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-sm text-brand">{t.n}</span>
                <h2 className="text-xl font-normal tracking-tight text-foreground">
                  {t.title}
                </h2>
              </div>
              <p className="mt-3 font-serif text-[1.0625rem] leading-relaxed text-muted-foreground text-pretty">
                {t.body}
              </p>
              {t.demo ? <div className="mt-4">{t.demo}</div> : null}
            </div>
          ))}
        </div>
      </section>

      {/* ============================ PULL QUOTE ====================== */}
      <section className={`${BLEED} border-y border-border bg-card`}>
        <div className="py-20">
          <blockquote className="mx-auto max-w-3xl text-center font-serif text-[clamp(1.75rem,5vw,3rem)] italic leading-snug text-foreground text-balance">
            “Good design gets out of the way. The system stays quiet so your
            product can be the loudest thing in the room.”
          </blockquote>
        </div>
      </section>

      {/* ============================ JOURNEY ========================= */}
      <section className="py-16">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">
          Start to finish
        </p>
        <h2 className="mt-3 max-w-2xl text-3xl font-normal tracking-tight text-foreground text-balance sm:text-4xl">
          The whole path, in order.
        </h2>
        <div className="mt-8 divide-y divide-border overflow-hidden rounded-2xl edge">
          {JOURNEY.map((j) => (
            <Link
              key={j.href}
              href={j.href}
              className="group flex items-center gap-4 bg-card px-5 py-4 transition-colors hover:bg-accent/50"
            >
              <span className="font-mono text-sm text-brand">{j.step}</span>
              <span className="w-32 shrink-0 text-sm font-medium text-foreground">
                {j.label}
              </span>
              <span className="min-w-0 flex-1 truncate text-sm text-muted-foreground">
                {j.blurb}
              </span>
              <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
            </Link>
          ))}
        </div>
      </section>

      {/* ============================ NAV ============================== */}
      <div className="flex flex-wrap gap-x-6 gap-y-3 border-t border-border pt-8 text-sm">
        <Link
          href="/docs/installation"
          className="inline-flex items-center gap-1.5 text-brand underline-offset-4 hover:underline"
        >
          Next: Installation
          <ArrowRight className="size-3.5" />
        </Link>
        <Link
          href="/docs"
          className="inline-flex items-center gap-1.5 text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          Back to Introduction
        </Link>
      </div>
    </article>
  )
}

import type { Metadata } from "next"
import Link from "next/link"
import { Check } from "lucide-react"

import { CodeBlock } from "@/app/(docs)/_components/code-block"
import { BLEED } from "@/app/(docs)/_components/docs-prose"
import { GuidePager } from "@/app/(docs)/_components/guide-pager"

export const metadata: Metadata = {
  title: "Typography, byronwade/ui",
  description:
    "Three type families, one editorial scale, tracking and weight rules, and the restraint that keeps byronwade/ui calm and readable.",
}

/* ---------------------------------------------------------------------------
   Typography = a type-forward specimen. Distinct signature: the hero is three
   oversized glyphs (the three families), not a headline. Token-driven throughout.
--------------------------------------------------------------------------- */

const SCALE: { cls: string; size: string; use: string }[] = [
  {
    cls: "text-[clamp(2.5rem,9vw,6rem)]",
    size: "Display · 96",
    use: "Marketing heroes, styleguide mastheads",
  },
  { cls: "text-6xl", size: "Title · 60", use: "Landing page titles" },
  { cls: "text-4xl", size: "Heading · 36", use: "Page titles, section heroes" },
  {
    cls: "text-2xl",
    size: "Subhead · 24",
    use: "Section headings, card titles",
  },
  { cls: "text-lg", size: "Body L · 18", use: "Lead paragraphs, docs intros" },
  { cls: "text-base", size: "Body · 16", use: "Default UI copy, form labels" },
  { cls: "text-sm", size: "Small · 14", use: "Secondary labels, table cells" },
  { cls: "text-xs", size: "Caption · 12", use: "Eyebrows, metadata, badges" },
]

const WEIGHTS = [
  {
    name: "Regular",
    cls: "font-normal",
    n: "400",
    role: "Display, page headings, body",
  },
  {
    name: "Medium",
    cls: "font-medium",
    n: "500",
    role: "Card titles, dialog headers",
  },
  {
    name: "Semibold",
    cls: "font-semibold",
    n: "600",
    role: "Rare inline emphasis only",
  },
  {
    name: "Bold",
    cls: "font-bold",
    n: "700",
    role: "Avoid on headings (lint flags it)",
  },
]

const FAMILIES: {
  token: string
  stack: string
  word: string
  meta: string
  role: string
  uses: string[]
}[] = [
  {
    token: "font-sans",
    stack: "Geist · --font-sans",
    word: "Interface",
    meta: "font-sans · the workhorse",
    role: "Headings, labels, buttons, and body copy. Calm and neutral so content stays loudest.",
    uses: [
      "Page and section headings",
      "Button and label text",
      "Form fields and descriptions",
      "Navigation and toolbars",
    ],
  },
  {
    token: "font-mono",
    stack: "Geist Mono · --font-geist-mono",
    word: "0123 data",
    meta: "font-mono · tabular",
    role: "Metrics, timestamps, counts, IDs, and code. Exact and aligned, engineered crispness.",
    uses: [
      "Stats, prices, and counts",
      "Timestamps and durations",
      "Keyboard hints and kbd",
      "API paths, IDs, and code snippets",
    ],
  },
  {
    token: "font-serif",
    stack: "EB Garamond · --font-serif",
    word: "Editorial",
    meta: "font-serif · reading voice",
    role: "Long-form prose and pull quotes. Warmth and authority on reading surfaces, not UI chrome.",
    uses: [
      "Docs philosophy and manifesto copy",
      "Pull quotes and blockquotes",
      "Article body in marketing layouts",
      "Drop caps and editorial spreads",
    ],
  },
]

const ROLES: {
  surface: string
  family: string
  size: string
  weight: string
}[] = [
  {
    surface: "Page title",
    family: "font-sans",
    size: "text-4xl",
    weight: "font-normal",
  },
  {
    surface: "Section heading",
    family: "font-sans",
    size: "text-2xl",
    weight: "font-normal",
  },
  {
    surface: "Card title",
    family: "font-heading",
    size: "text-base",
    weight: "font-medium",
  },
  {
    surface: "UI labels & tables",
    family: "font-sans",
    size: "text-sm",
    weight: "font-normal",
  },
  {
    surface: "Docs body",
    family: "reading-ui",
    size: "16px / 1.6 lh",
    weight: "font-normal",
  },
  {
    surface: "Stat value",
    family: "font-mono",
    size: "text-3xl",
    weight: "font-normal",
  },
  {
    surface: "Timestamp",
    family: "font-mono",
    size: "text-xs",
    weight: "font-normal",
  },
  {
    surface: "Eyebrow label",
    family: "font-mono",
    size: "text-xs",
    weight: "font-normal",
  },
  {
    surface: "Essays & articles",
    family: "reading-prose",
    size: "18px / 1.7 lh",
    weight: "font-normal",
  },
]

const PRACTICE: { do: string; dont: string }[] = [
  {
    do: "text-4xl font-normal tracking-tight",
    dont: "text-4xl font-bold text-brand",
  },
  {
    do: "reading-prose on essay / article body",
    dont: "full-bleed text-sm sans for long-form",
  },
  {
    do: "reading-ui on docs and help content",
    dont: "text-sm tracking-tight on paragraphs users read",
  },
  {
    do: "font-mono tabular-nums text-sm",
    dont: "font-sans text-green-600 font-semibold",
  },
  {
    do: "font-serif text-lg leading-relaxed",
    dont: "font-serif text-base on a button",
  },
  {
    do: "text-xs uppercase tracking-[0.2em]",
    dont: "text-xs font-bold tracking-normal",
  },
]

const TRACKING = [
  {
    label: "Body default",
    value: "-0.006em",
    note: "Set on body in foundation. Slightly tight for crisp UI copy.",
  },
  {
    label: "Headings h1–h4",
    value: "-0.02em",
    note: "Applied globally. Pair with font-normal, not bold.",
  },
  {
    label: "Eyebrows / labels",
    value: "0.2em uppercase",
    note: "Mono captions use wide tracking + uppercase for scanability.",
  },
  {
    label: "Display clamp",
    value: "tracking-tighter",
    note: "Large marketing type pulls in further for editorial density.",
  },
]

export default function TypographyPage() {
  return (
    <article className="max-w-none">
      {/* ============================ HERO, three giant glyphs ========== */}
      <section className={`${BLEED} border-b border-border`}>
        <div className="flex items-baseline justify-between gap-4 pt-12 lg:pt-16">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">
            Foundation · Type
          </p>
          <p className="font-mono text-[11px] text-muted-foreground">
            3 families · 1 scale
          </p>
        </div>
        <div className="grid grid-cols-3 items-center gap-2 py-6 leading-none sm:gap-8">
          <span className="animate-in fade-in slide-in-from-bottom-3 truncate text-center font-sans text-[clamp(4rem,22vw,16rem)] font-normal tracking-tighter text-foreground duration-700">
            Aa
          </span>
          <span className="animate-in fade-in slide-in-from-bottom-3 fill-mode-both truncate text-center font-serif text-[clamp(4rem,22vw,16rem)] italic text-foreground duration-700 [animation-delay:120ms]">
            Aa
          </span>
          <span className="animate-in fade-in slide-in-from-bottom-3 fill-mode-both truncate text-center font-mono text-[clamp(3.5rem,18vw,13rem)] text-foreground duration-700 [animation-delay:240ms]">
            Aa
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2 pb-8 text-center font-mono text-[11px] text-muted-foreground sm:gap-8">
          <span>font-sans</span>
          <span>font-serif</span>
          <span>font-mono</span>
        </div>
      </section>

      {/* ============================ INTRO ============================= */}
      <section className="py-12">
        <h1 className="max-w-3xl text-[clamp(1.5rem,4vw,2.25rem)] font-normal leading-snug tracking-tight text-foreground text-balance">
          Sans for interface, serif for reading, mono for data. Hierarchy comes
          from{" "}
          <span className="text-muted-foreground">
            size, tracking, and the typeface
          </span>
          , never weight or color.
        </h1>
        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted-foreground text-pretty">
          Most design systems shout with bold headings and colored type. This
          one whispers: a regular-weight headline with tight tracking reads as
          confident and editorial — the same{" "}
          <Link
            href="/docs/philosophy"
            className="text-brand underline-offset-4 hover:underline"
          >
            editorial restraint
          </Link>{" "}
          the rest of the system is built on. The accent color belongs on
          surfaces and states, not on the letters themselves. Long-form copy
          uses{" "}
          <Link
            href="/docs/readability"
            className="text-brand underline-offset-4 hover:underline"
          >
            reading utilities
          </Link>{" "}
          — not the same lane as UI chrome.
        </p>
      </section>

      {/* ============================ PRINCIPLES ======================= */}
      <section className={`${BLEED} border-y border-border bg-card py-12`}>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">
          Editorial restraint
        </p>
        <h2 className="mt-3 max-w-2xl text-3xl font-normal tracking-tight text-foreground text-balance">
          Size carries hierarchy. Weight stays quiet.
        </h2>
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {[
            {
              title: "Size first",
              body: "Step down the scale from display to caption. A smaller size in foreground reads louder than a larger size in muted-foreground.",
            },
            {
              title: "Tracking second",
              body: "Headings pull tight (-0.02em from foundation). Eyebrows push wide (0.2em uppercase mono). The contrast creates rhythm without bold.",
            },
            {
              title: "Family third",
              body: "Switching from sans to mono or serif is a semantic signal: interface, data, or reading voice. Never mix serif into buttons.",
            },
          ].map((p) => (
            <div key={p.title} className="rounded-2xl edge bg-background p-5">
              <h3 className="text-base font-medium text-foreground">
                {p.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ============================ WATERFALL ========================= */}
      <section className="py-12">
        <p className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-brand">
          The scale, a waterfall
        </p>
        <div className="divide-y divide-edge overflow-hidden rounded-2xl edge">
          {SCALE.map((w) => (
            <div
              key={w.size}
              className="flex flex-col gap-1 bg-card px-5 py-4 transition-colors hover:bg-accent/40 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
            >
              <span
                className={`${w.cls} min-w-0 truncate font-normal tracking-tight text-foreground`}
              >
                Clarity
              </span>
              <div className="shrink-0 sm:text-right">
                <p className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                  {w.size}
                </p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {w.use}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================ FAMILIES (stacked rows) =========== */}
      <section className={`${BLEED} border-y border-border bg-card`}>
        <div className="divide-y divide-border">
          {FAMILIES.map((r) => (
            <div
              key={r.token}
              className="grid gap-6 py-10 md:grid-cols-[1fr_20rem] md:items-end md:gap-10"
            >
              <div>
                <p
                  className={`${r.token} truncate text-[clamp(3rem,11vw,6.5rem)] font-normal leading-[0.95] tracking-tight text-foreground`}
                >
                  {r.word}
                </p>
                <p className="mt-4 font-mono text-[11px] text-brand">
                  {r.stack}
                </p>
              </div>
              <div className="md:text-right">
                <p className="font-mono text-[11px] text-muted-foreground">
                  {r.meta}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground text-pretty">
                  {r.role}
                </p>
                <ul className="mt-4 space-y-1.5 text-left md:text-right">
                  {r.uses.map((u) => (
                    <li
                      key={u}
                      className="flex items-start gap-2 text-sm text-muted-foreground md:justify-end"
                    >
                      <Check className="mt-0.5 size-3.5 shrink-0 text-brand" />
                      {u}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================ ROLE MATRIX ======================= */}
      <section className="py-16">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">
          Where each family lands
        </p>
        <h2 className="mt-3 max-w-2xl text-3xl font-normal tracking-tight text-foreground text-balance">
          A role for every surface.
        </h2>
        <div className="mt-8 overflow-hidden rounded-2xl edge">
          <div className="grid grid-cols-[1.2fr_1fr_0.8fr_0.8fr] border-b border-border bg-muted/50 font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
            <span className="px-4 py-2.5">Surface</span>
            <span className="px-4 py-2.5">Family</span>
            <span className="px-4 py-2.5">Size</span>
            <span className="px-4 py-2.5">Weight</span>
          </div>
          {ROLES.map((row) => (
            <div
              key={row.surface}
              className="grid grid-cols-[1.2fr_1fr_0.8fr_0.8fr] border-b border-border last:border-b-0"
            >
              <span className="bg-card px-4 py-3 text-sm text-foreground">
                {row.surface}
              </span>
              <code className="bg-card px-4 py-3 text-[11px] text-brand">
                {row.family}
              </code>
              <code className="bg-card px-4 py-3 text-[11px] text-muted-foreground">
                {row.size}
              </code>
              <code className="bg-card px-4 py-3 text-[11px] text-muted-foreground">
                {row.weight}
              </code>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          <code className="font-mono text-[13px] text-foreground">
            font-heading
          </code>{" "}
          resolves to the same stack as{" "}
          <code className="font-mono text-[13px] text-foreground">
            font-sans
          </code>
          . Card, dialog, and sheet titles use it at{" "}
          <code className="font-mono text-[13px] text-foreground">
            font-medium
          </code>
          , the one place medium weight is expected in UI chrome.
        </p>
      </section>

      {/* ============================ TRACKING ========================== */}
      <section className={`${BLEED} border-y border-border bg-card py-16`}>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">
          Tracking & leading
        </p>
        <h2 className="mt-3 max-w-2xl text-3xl font-normal tracking-tight text-foreground text-balance">
          Rhythm is baked into foundation.
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground text-pretty">
          You rarely need to set letter-spacing by hand. The{" "}
          <Link
            href="/docs/foundation"
            className="text-brand underline-offset-4 hover:underline"
          >
            foundation tokens
          </Link>{" "}
          apply body tracking and heading tightness globally. Reach for utility
          classes only when you are designing a signature moment.
        </p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {TRACKING.map((t) => (
            <div key={t.label} className="rounded-xl edge bg-background p-4">
              <div className="flex items-baseline justify-between gap-2">
                <p className="text-sm font-medium text-foreground">{t.label}</p>
                <code className="font-mono text-[11px] text-brand">
                  {t.value}
                </code>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {t.note}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl edge bg-background p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Heading rhythm
            </p>
            <h3 className="mt-3 text-3xl font-normal tracking-tight text-foreground">
              Regular weight, tight tracking
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              letter-spacing: -0.02em · line-height: 1.15
            </p>
          </div>
          <div className="rounded-xl edge bg-background p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Body rhythm
            </p>
            <p className="mt-3 text-base font-normal leading-relaxed text-foreground">
              Generous leading for long UI copy. The eye returns without effort.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              letter-spacing: -0.006em · line-height: 1.6
            </p>
          </div>
        </div>
      </section>

      {/* ============================ EDITORIAL SPREAD ================== */}
      <section className={`${BLEED} border-b border-border bg-card`}>
        <div className="py-16">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">
            How it reads
          </p>
          <div className="mt-8 font-serif text-[1.25rem] leading-[1.7] text-foreground text-pretty md:columns-2 md:gap-12 [&>p]:mb-6 [&>p]:break-inside-avoid">
            <p className="first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-serif first-letter:text-[5rem] first-letter:leading-[0.7] first-letter:text-brand">
              Good typography is invisible. You do not notice the letters, you
              notice that you have finished reading, calm and unhurried, and
              understood every word.
            </p>
            <p>
              The measure is short, the leading generous, so the eye returns
              without effort. Nothing flickers, nothing shouts. Hierarchy is
              built from size and rhythm, leaving the prose free to carry the
              argument.
            </p>
            <p>
              Set this way a changelog becomes a story and documentation becomes
              a guide. The type gets out of the way and the words do the rest.
            </p>
          </div>
          <blockquote className="mt-10 max-w-3xl border-l-2 border-brand pl-6 font-serif text-[clamp(1.5rem,4vw,2.5rem)] italic leading-snug text-foreground text-pretty">
            “Restraint is the loudest thing a design system can say.”
          </blockquote>
        </div>
      </section>

      {/* ============================ MONO + WEIGHTS ==================== */}
      <section className="grid gap-10 py-16 md:grid-cols-2">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">
            Mono for facts
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground text-pretty">
            Always pair mono numbers with{" "}
            <code className="font-mono text-[13px] text-foreground">
              tabular-nums
            </code>{" "}
            so columns align when values change.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            {[
              { v: "99.98%", l: "uptime" },
              { v: "1,284", l: "req / min" },
              { v: "42ms", l: "p50" },
              { v: "⌘K", l: "search" },
            ].map((m) => (
              <div key={m.l} className="rounded-2xl edge bg-card p-5">
                <p className="font-mono text-3xl tabular-nums leading-none text-foreground">
                  {m.v}
                </p>
                <p className="mt-2 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                  {m.l}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">
            Weight = emphasis
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground text-pretty">
            Headlines stay regular. Medium is for compact UI titles. Bold on
            headings is flagged by the on-system lint.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl edge bg-border">
            {WEIGHTS.map((w) => (
              <div key={w.n} className="bg-card p-5">
                <p className={`${w.cls} text-3xl leading-none text-foreground`}>
                  Aa
                </p>
                <p className="mt-3 text-sm text-foreground">{w.name}</p>
                <p className="font-mono text-[11px] text-muted-foreground">
                  {w.n}
                </p>
                <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
                  {w.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ IN PRACTICE ======================= */}
      <section className={`${BLEED} border-y border-border bg-card py-16`}>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">
          In practice
        </p>
        <h2 className="mt-3 max-w-2xl text-3xl font-normal tracking-tight text-foreground text-balance">
          The same instinct, every time.
        </h2>
        <div className="mt-8 overflow-hidden rounded-2xl edge">
          <div className="grid grid-cols-[1fr_1fr] border-b border-border bg-muted/50 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
            <span className="px-4 py-2.5">On-system</span>
            <span className="border-l border-border px-4 py-2.5">
              Off-system
            </span>
          </div>
          {PRACTICE.map((row) => (
            <div
              key={row.do}
              className="grid grid-cols-[1fr_1fr] border-b border-border last:border-b-0"
            >
              <code className="block bg-background px-4 py-3 text-[12px] text-brand">
                {row.do}
              </code>
              <code className="block border-l border-border bg-background px-4 py-3 text-[12px] text-destructive/80">
                {row.dont}
              </code>
            </div>
          ))}
        </div>
      </section>

      {/* ============================ SWAP FONTS ======================== */}
      <section className="py-16">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">
          Swap the stacks
        </p>
        <h2 className="mt-3 max-w-2xl text-3xl font-normal tracking-tight text-foreground text-balance">
          Your fonts, same tokens.
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground text-pretty">
          The default stacks are Geist, Geist Mono, and EB Garamond loaded via
          Next.js font optimization. Point the CSS variables at your own faces
          and every{" "}
          <code className="font-mono text-[13px] text-foreground">font-*</code>{" "}
          utility follows. Tracking and scale stay the same.
        </p>
        <div className="mt-8">
          <CodeBlock
            lang="tsx"
            code={`// app/layout.tsx — load your faces, expose as variables
import { Inter, JetBrains_Mono, Lora } from "next/font/google"

const sans = Inter({ variable: "--font-sans", subsets: ["latin"] })
const mono = JetBrains_Mono({ variable: "--font-geist-mono", subsets: ["latin"] })
const serif = Lora({ variable: "--font-serif", subsets: ["latin"] })

export default function RootLayout({ children }) {
  return (
    <html className={\`\${sans.variable} \${mono.variable} \${serif.variable}\`}>
      <body>{children}</body>
    </html>
  )
}`}
          />
        </div>
      </section>

      {/* ============================ TOKENS ============================ */}
      <section className={`${BLEED} border-t border-border bg-muted/30`}>
        <div className="py-12">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-brand">
            Quick reference
          </p>
          <CodeBlock
            lang="tsx"
            code={`// Families
<p className="font-sans">   Interface · headings · body     // --font-sans
<p className="font-mono">   Metrics · code · timestamps   // --font-geist-mono
<p className="font-serif">  Long-form prose · quotes        // --font-serif
<p className="font-heading"> Card / dialog titles           // alias of font-sans

// Reading lanes (see /docs/readability)
<article className="reading-ui text-foreground">…</article>
<article className="reading-prose text-foreground">…</article>

// Hierarchy — size + tracking, not bold
<h1 className="text-4xl font-normal tracking-tight">
<p className="text-sm text-muted-foreground leading-relaxed">

// Data texture
<span className="font-mono tabular-nums text-3xl">1,284</span>
<span className="font-mono text-xs uppercase tracking-[0.2em]">Foundation · Type</span>

// Editorial moments
<p className="font-serif text-lg leading-[1.7] text-pretty">…</blockquote>`}
          />
        </div>
      </section>

      <GuidePager current="/docs/typography" />
    </article>
  )
}

import type { Metadata } from "next";

import { CodeBlock } from "@/app/(docs)/_components/code-block";

export const metadata: Metadata = {
  title: "Typography — byronwade/ui",
  description:
    "A living type specimen — three families, one scale, and the editorial restraint that makes the whole system read clean.",
};

/* ---------------------------------------------------------------------------
   Typography = a type-forward specimen. Distinct signature: the hero is three
   oversized glyphs (the three families), not a headline. Token-driven throughout.
--------------------------------------------------------------------------- */

const BLEED = "-mx-6 px-6 sm:-mx-8 sm:px-8 lg:-mx-10 lg:px-10";

const SCALE: { cls: string; size: string }[] = [
  { cls: "text-[clamp(2.5rem,9vw,6rem)]", size: "Display · 96" },
  { cls: "text-6xl", size: "Title · 60" },
  { cls: "text-4xl", size: "Heading · 36" },
  { cls: "text-2xl", size: "Subhead · 24" },
  { cls: "text-lg", size: "Body L · 18" },
  { cls: "text-base", size: "Body · 16" },
  { cls: "text-sm", size: "Small · 14" },
  { cls: "text-xs", size: "Caption · 12" },
];

const WEIGHTS = [
  { name: "Regular", cls: "font-normal", n: "400" },
  { name: "Medium", cls: "font-medium", n: "500" },
  { name: "Semibold", cls: "font-semibold", n: "600" },
  { name: "Bold", cls: "font-bold", n: "700" },
];

export default function TypographyPage() {
  return (
    <article className="max-w-none">
      {/* ============================ HERO — three giant glyphs ========== */}
      <section className={`${BLEED} border-b border-border`}>
        <div className="flex items-baseline justify-between gap-4 pt-10">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">
            Foundation · Type
          </p>
          <p className="font-mono text-[11px] text-muted-foreground">3 families · 1 scale</p>
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

      <section className="py-12">
        <p className="max-w-3xl text-[clamp(1.5rem,4vw,2.25rem)] font-normal leading-snug tracking-tight text-foreground text-balance">
          Sans for interface, serif for reading, mono for data. Hierarchy comes from{" "}
          <span className="text-muted-foreground">size, tracking, and the typeface</span> — never
          weight or color.
        </p>
      </section>

      {/* ============================ WATERFALL ========================= */}
      <section className={`${BLEED} border-y border-border bg-card`}>
        <div className="py-12">
          <p className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-brand">
            The scale — a waterfall
          </p>
          <div className="divide-y divide-border">
            {SCALE.map((w) => (
              <div
                key={w.size}
                className="flex items-baseline justify-between gap-6 py-3 transition-colors hover:bg-accent/40"
              >
                <span
                  className={`${w.cls} min-w-0 truncate font-normal tracking-tight text-foreground`}
                >
                  Clarity
                </span>
                <span className="shrink-0 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                  {w.size}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ FAMILIES (stacked rows) =========== */}
      <section className="divide-y divide-border">
        {[
          {
            f: "font-sans",
            word: "Interface",
            meta: "font-sans · the workhorse",
            role: "Headings, labels, buttons, body. Calm and neutral so content stays loudest.",
          },
          {
            f: "font-mono",
            word: "0123 data",
            meta: "font-mono · tabular",
            role: "Metrics, timestamps, counts, IDs, code. Exact and aligned — engineered crispness.",
          },
          {
            f: "font-serif",
            word: "Editorial",
            meta: "font-serif · EB Garamond",
            role: "Long-form prose and pull quotes. Warmth and authority on reading surfaces.",
          },
        ].map((r) => (
          <div key={r.f} className="grid gap-3 py-10 md:grid-cols-[1fr_18rem] md:items-end md:gap-10">
            <p
              className={`${r.f} truncate text-[clamp(3rem,11vw,6.5rem)] font-normal leading-[0.95] tracking-tight text-foreground`}
            >
              {r.word}
            </p>
            <div className="md:text-right">
              <p className="font-mono text-[11px] text-muted-foreground">{r.meta}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground text-pretty">
                {r.role}
              </p>
            </div>
          </div>
        ))}
      </section>

      {/* ============================ EDITORIAL SPREAD ================== */}
      <section className={`${BLEED} border-y border-border bg-card`}>
        <div className="py-16">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">How it reads</p>
          <div className="mt-8 font-serif text-[1.25rem] leading-[1.7] text-foreground text-pretty md:columns-2 md:gap-12 [&>p]:mb-6 [&>p]:break-inside-avoid">
            <p className="first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-serif first-letter:text-[5rem] first-letter:leading-[0.7] first-letter:text-brand">
              Good typography is invisible. You do not notice the letters — you notice that you have
              finished reading, calm and unhurried, and understood every word.
            </p>
            <p>
              The measure is short, the leading generous, so the eye returns without effort. Nothing
              flickers, nothing shouts. Hierarchy is built from size and rhythm, leaving the prose
              free to carry the argument.
            </p>
            <p>
              Set this way a changelog becomes a story and documentation becomes a guide. The type
              gets out of the way and the words do the rest.
            </p>
          </div>
          <blockquote className="mt-10 max-w-3xl border-l-2 border-brand pl-6 font-serif text-[clamp(1.5rem,4vw,2.5rem)] italic leading-snug text-foreground text-pretty">
            “Restraint is the loudest thing a design system can say.”
          </blockquote>
        </div>
      </section>

      {/* ============================ MONO DATA + WEIGHTS (two-up) ====== */}
      <section className="grid gap-10 py-16 md:grid-cols-2">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">Mono for facts</p>
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
            Headlines stay Regular; bold is for inline emphasis only.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl edge bg-border">
            {WEIGHTS.map((w) => (
              <div key={w.n} className="bg-card p-5">
                <p className={`${w.cls} text-3xl leading-none text-foreground`}>Aa</p>
                <p className="mt-3 text-sm text-foreground">{w.name}</p>
                <p className="font-mono text-[11px] text-muted-foreground">{w.n}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ TOKENS ============================ */}
      <section className={`${BLEED} border-t border-border bg-muted/30`}>
        <div className="py-12">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-brand">The tokens</p>
          <CodeBlock
            lang="tsx"
            code={`<p className="font-sans">  Interface · headings · body   // --font-sans
<p className="font-mono">  Metrics · code · timestamps   // --font-mono
<p className="font-serif"> Long-form prose · quotes       // --font-serif

<h1 className="text-5xl font-normal tracking-tight">  // headings stay Regular
<span className="font-mono tabular-nums">1,284</span>  // data is mono`}
          />
        </div>
      </section>
    </article>
  );
}

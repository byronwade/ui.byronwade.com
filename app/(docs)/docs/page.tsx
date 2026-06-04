import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { categories, byCategory, components } from "@/content/components";
import { archetypes } from "@/app/layouts/_archetypes";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/app/(docs)/_components/code-block";

export const metadata: Metadata = {
  title: "Introduction — byronwade/ui",
  description:
    "What byronwade/ui is, why it exists, and every token-driven component in the registry — primitives, composites, and layout patterns.",
};

/* ---------------------------------------------------------------------------
   Introduction = the cover + the index. Distinct signature: an asymmetric
   masthead with the component count as a giant graphic numeral, and the
   catalog rendered as an editorial index (not card grids). #catalog preserved.
--------------------------------------------------------------------------- */

const BLEED = "-mx-6 px-6 sm:-mx-8 sm:px-8 lg:-mx-10 lg:px-10";

const PRINCIPLES = [
  "One warm accent; the rest is calm ink and warm gray.",
  "Depth from a single hairline edge — no shadows, no borders.",
  "Every page earns one signature — never a repeated card grid.",
  "Pure tokens — override --brand and the whole system re-skins.",
];

export default function ComponentsIndexPage() {
  return (
    <article className="max-w-none">
      {/* ============================ MASTHEAD ========================= */}
      <section className="grid gap-8 py-12 lg:grid-cols-[1fr_auto] lg:items-end lg:py-16">
        <div className="animate-in fade-in slide-in-from-bottom-3 duration-700">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">Introduction</p>
          <h1 className="mt-4 text-[clamp(2.5rem,7vw,5rem)] font-normal leading-[0.95] tracking-tight text-foreground text-balance">
            A master design system, <span className="text-muted-foreground">entirely yours.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground text-pretty">
            <span className="text-foreground">byronwade/ui</span> is a calm, content-first library
            published as a namespaced{" "}
            <a
              href="https://ui.shadcn.com"
              target="_blank"
              rel="noreferrer"
              className="text-brand underline-offset-4 hover:underline"
            >
              shadcn
            </a>{" "}
            registry. Token-driven primitives, composites, and full-page layouts — install with the
            shadcn CLI and you own the copied code.
          </p>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both shrink-0 text-left lg:text-right duration-700 [animation-delay:150ms]">
          <p className="font-mono text-[clamp(4rem,13vw,9rem)] tabular-nums leading-[0.8] tracking-tighter text-brand">
            {components.length}
          </p>
          <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            components · {archetypes.length} layouts · 1 variable
          </p>
        </div>
      </section>

      {/* ============================ META + INSTALL =================== */}
      <section className={`${BLEED} border-y border-border bg-card`}>
        <div className="grid gap-6 py-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
            <span>shadcn registry</span>
            <span>·</span>
            <span>Next.js + Tailwind v4</span>
            <span>·</span>
            <span>you own the code</span>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button render={<Link href="/docs/installation" />}>
              Install
              <ArrowRight />
            </Button>
            <Button variant="outline" render={<a href="#catalog" />}>
              Jump to catalog
            </Button>
          </div>
        </div>
      </section>

      {/* ============================ PRINCIPLES (inline) ============== */}
      <section className="py-12">
        <ol className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
          {PRINCIPLES.map((p, i) => (
            <li key={p} className="flex gap-3 text-[15px] leading-relaxed">
              <span className="font-mono text-sm text-brand">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-muted-foreground text-pretty">{p}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* ============================ INSTALL ONE-LINER =============== */}
      <section className="pb-12">
        <CodeBlock lang="bash" code="npx shadcn@latest add @byronwade/all" />
      </section>

      {/* ============================ CATALOG INDEX =================== */}
      <section id="catalog" className="scroll-mt-24">
        <div className="flex items-baseline justify-between gap-4 border-b border-foreground/20 pb-3">
          <h2 className="text-[clamp(1.75rem,5vw,2.75rem)] font-normal tracking-tight text-foreground">
            The catalog
          </h2>
          <span className="font-mono text-xs tabular-nums text-muted-foreground">
            {components.length} total
          </span>
        </div>

        <div>
          {categories.map((cat) => {
            const items = byCategory(cat);
            if (items.length === 0) return null;
            return (
              <div
                key={cat}
                className="grid gap-x-8 gap-y-3 border-b border-border py-6 sm:grid-cols-[10rem_1fr]"
              >
                <div className="flex items-baseline gap-2">
                  <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {cat}
                  </h3>
                  <span className="font-mono text-[11px] tabular-nums text-muted-foreground/60">
                    {items.length}
                  </span>
                </div>
                <ul className="flex flex-wrap gap-x-5 gap-y-2.5">
                  {items.map((c) => (
                    <li key={c.slug}>
                      <Link
                        href={`/docs/${c.slug}`}
                        className="text-[15px] text-foreground underline-offset-4 transition-colors hover:text-brand hover:underline"
                      >
                        {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* ============================ NAV ============================== */}
      <div className="flex flex-wrap gap-x-6 gap-y-3 pt-10 text-sm">
        <Link
          href="/docs/philosophy"
          className="inline-flex items-center gap-1.5 text-brand underline-offset-4 hover:underline"
        >
          Next: Philosophy
          <ArrowRight className="size-3.5" />
        </Link>
        <Link
          href="/docs/installation"
          className="inline-flex items-center gap-1.5 text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          Installation
        </Link>
      </div>
    </article>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Bot, Check } from "lucide-react";

import { categories, byCategory, components } from "@/content/components";
import { archetypes } from "@/app/layouts/_archetypes";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CodeBlock } from "@/app/(docs)/_components/code-block";

export const metadata: Metadata = {
  title: "Introduction — byronwade/ui",
  description:
    "What byronwade/ui is, why it exists, and every token-driven component in the registry — primitives, composites, and layout patterns.",
};

const principles = [
  "One warm-green accent carries every bit of emphasis — the rest is calm ink and gray.",
  "Depth from soft shadows and a hairline inset edge — not hard borders. Whitespace is a material.",
  "Each page earns one signature hero — never a generic, repeated card grid.",
  "Pure tokens. Override one variable and the whole system re-skins, light and dark.",
];

export default function ComponentsIndexPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-12">
      <header className="max-w-2xl">
        <p className="text-sm font-medium text-brand">Get Started</p>
        <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          Introduction
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground text-pretty">
          <span className="text-foreground">byronwade/ui</span> is a personal master design system,
          published as a namespaced{" "}
          <a
            href="https://ui.shadcn.com"
            target="_blank"
            rel="noreferrer"
            className="text-brand underline-offset-4 hover:underline"
          >
            shadcn
          </a>{" "}
          registry. It ships {components.length} token-driven components and {archetypes.length}{" "}
          full-page layout archetypes, all built around a single warm-green accent. Install with the
          shadcn CLI into any Next.js + Tailwind v4 project — you own the copied code.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button render={<Link href="/docs/installation" />}>
            Install
            <ArrowRight />
          </Button>
          <Button variant="outline" render={<a href="#catalog" />}>
            Browse the catalog
          </Button>
        </div>
      </header>

      {/* Why it exists */}
      <section className="space-y-4">
        <h2 className="font-heading text-xl font-semibold tracking-tight">Why it exists</h2>
        <p className="max-w-2xl text-[15px] leading-relaxed text-muted-foreground text-pretty">
          Most products drift: each surface reinvents its own buttons, spacing, and color. This
          registry is the opposite — one shared, calm, content-first aesthetic that every project can
          adopt in minutes and re-skin to its own brand from a single CSS variable. Because it&apos;s
          a shadcn registry, the code is copied into your repo: no runtime dependency, no version
          lock-in, fully yours to edit.
        </p>
        <ul className="grid gap-3 sm:grid-cols-2">
          {principles.map((p) => (
            <li key={p} className="flex items-start gap-2.5 text-sm leading-relaxed">
              <Check className="mt-0.5 size-4 shrink-0 text-brand" />
              <span className="text-muted-foreground">{p}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Install everything in one command. */}
      <Card className="gap-3 border-brand/20 bg-brand/5">
        <CardHeader>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <CardTitle className="text-sm">Install the whole catalog</CardTitle>
            <Link
              href="/docs/installation"
              className="text-xs text-brand underline-offset-4 hover:underline"
            >
              Setup guide →
            </Link>
          </div>
          <CardDescription className="text-[13px] leading-relaxed">
            After initializing the foundation, one command pulls every component — dependencies
            resolve automatically.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CodeBlock lang="bash" code="npx shadcn@latest add @byronwade/all" />
        </CardContent>
      </Card>

      {/* Keep your AI on-system. */}
      <Card className="gap-3 border-brand/20 bg-brand/5">
        <CardHeader>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Bot className="size-4 text-brand" />
              Keep your AI on-system
            </CardTitle>
            <Link href="/docs/ai" className="text-xs text-brand underline-offset-4 hover:underline">
              AI setup →
            </Link>
          </div>
          <CardDescription className="text-[13px] leading-relaxed">
            Add one rule and your AI agent (Cursor, Claude, Copilot…) keeps building with these
            components and tokens — reaching for existing components instead of reinventing them, and
            never hardcoding colors — on every edit.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CodeBlock lang="bash" code="npx shadcn@latest add @byronwade/design-rules" />
        </CardContent>
      </Card>

      <h2 id="catalog" className="scroll-mt-24 font-heading text-xl font-semibold tracking-tight">
        All {components.length} components
      </h2>

      {categories.map((cat) => {
        const items = byCategory(cat);
        if (items.length === 0) return null;
        return (
          <section key={cat} className="space-y-4">
            <div className="flex items-baseline justify-between gap-3 border-b border-border pb-2">
              <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                {cat}
              </h2>
              <span className="text-xs tabular-nums text-muted-foreground">{items.length}</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((c) => (
                <Link
                  key={c.slug}
                  href={`/docs/${c.slug}`}
                  className="group flex flex-col gap-1.5 rounded-xl border border-transparent bg-card p-4 shadow-card outline-none transition-all hover:-translate-y-0.5 hover:border-brand/40 focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <span className="text-sm font-semibold tracking-tight group-hover:text-foreground">
                    {c.name}
                  </span>
                  <span className="line-clamp-2 text-[13px] leading-relaxed text-muted-foreground">
                    {c.description}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

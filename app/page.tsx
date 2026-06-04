import Link from "next/link";
import { ArrowRight, Bot, Check, GitFork, Layers, LayoutTemplate, Palette } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/app/(docs)/_components/code-block";
import { components } from "@/content/components";
import { archetypes } from "@/app/layouts/_archetypes";

const GITHUB_URL = "https://github.com/byronwade/ui";

const stats = [
  { value: components.length, label: "components" },
  { value: archetypes.length, label: "layout archetypes" },
  { value: 1, label: "brand variable" },
];

const designRulePoints = [
  "Use installed @byronwade/ui components — add missing ones with shadcn, don't rebuild from scratch.",
  "Style with semantic tokens only (bg-brand, text-muted-foreground) — never hardcode hex or Tailwind colors.",
  "Re-skin through --brand only — rings, charts, and success states follow automatically.",
];

const pillars = [
  {
    icon: Layers,
    title: "Token-driven",
    body: "Every primitive is built on one foundation of CSS variables. No hardcoded colors, ever.",
  },
  {
    icon: Palette,
    title: "Re-skin from one variable",
    body: "Override --brand and rings, charts, active states, and status all follow in light and dark.",
  },
  {
    icon: LayoutTemplate,
    title: "Whole pages, not just parts",
    body: "Ships opinionated, full-page layout archetypes — each built around one signature centerpiece.",
  },
];

export default function HomePage() {
  return (
    <main className="relative min-h-dvh overflow-x-clip bg-background text-foreground">
      {/* Calm atmosphere — faint dotted grid + a single warm-green glow. */}
      <div className="bg-grid pointer-events-none fixed inset-0 -z-10 opacity-[0.35]" />
      <div className="glow-brand pointer-events-none fixed inset-x-0 top-0 -z-10 h-[60vh] opacity-70" />

      {/* ====================================================== HERO ===== */}
      <section className="mx-auto flex min-h-dvh max-w-4xl flex-col items-center justify-center px-6 pb-20 pt-28 text-center sm:pt-32">
        <span className="animate-in fade-in slide-in-from-bottom-2 inline-flex items-center gap-2 rounded-full edge bg-card/60 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground backdrop-blur duration-700">
          <span className="size-1.5 rounded-full bg-brand" />
          byronwade/ui · design system
        </span>

        <h1 className="mt-7 text-[clamp(2.75rem,9vw,7rem)] font-normal leading-[0.95] tracking-tight text-balance">
          <span className="block animate-in fade-in slide-in-from-bottom-4 fill-mode-both duration-700 [animation-delay:80ms]">
            One design system
          </span>
          <span className="block animate-in fade-in slide-in-from-bottom-4 fill-mode-both text-gradient-brand duration-700 [animation-delay:160ms]">
            for every surface.
          </span>
        </h1>

        <p className="animate-in fade-in slide-in-from-bottom-3 fill-mode-both mx-auto mt-7 max-w-xl text-[15px] leading-relaxed text-muted-foreground text-pretty duration-700 [animation-delay:240ms] sm:text-base">
          A calm, content-first component library published as a namespaced{" "}
          <span className="text-foreground">shadcn registry</span>. Token-driven primitives,
          composites, and full-page layouts — all built around a single warm accent you re-skin from
          one CSS variable. Install with the shadcn CLI and you own the code.
        </p>

        <div className="animate-in fade-in slide-in-from-bottom-3 fill-mode-both mt-9 flex flex-wrap items-center justify-center gap-3 duration-700 [animation-delay:320ms]">
          <Button size="lg" render={<Link href="/docs" />}>
            Enter
            <ArrowRight />
          </Button>
          <Button size="lg" variant="outline" render={<Link href="/docs/installation" />}>
            Install
          </Button>
          <Button
            size="lg"
            variant="ghost"
            render={<a href={GITHUB_URL} target="_blank" rel="noreferrer" />}
          >
            <GitFork />
            GitHub
          </Button>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-3 fill-mode-both mt-9 w-full max-w-md text-left duration-700 [animation-delay:400ms]">
          <CodeBlock lang="bash" code="npx shadcn@latest add @byronwade/all" />
          <p className="mt-2 text-center text-xs text-muted-foreground">
            One command installs the entire catalog.
          </p>
        </div>

        <dl className="animate-in fade-in slide-in-from-bottom-3 fill-mode-both mt-14 flex flex-wrap items-start justify-center gap-x-12 gap-y-6 duration-700 [animation-delay:480ms]">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center">
              <dd className="font-mono text-[clamp(2rem,5vw,3rem)] tabular-nums leading-none tracking-tight text-foreground">
                {s.value}
              </dd>
              <dt className="mt-2 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                {s.label}
              </dt>
            </div>
          ))}
        </dl>
      </section>

      {/* =================================================== PILLARS ===== */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">Why it exists</p>
        <div className="mt-6 grid gap-px overflow-hidden rounded-2xl edge bg-border sm:grid-cols-3">
          {pillars.map((p) => (
            <div key={p.title} className="bg-card p-6 text-left">
              <span className="flex size-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <p.icon className="size-5" strokeWidth={2} />
              </span>
              <h2 className="mt-4 text-base font-medium tracking-tight text-foreground">
                {p.title}
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground text-pretty">
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* =================================================== AI RULES ===== */}
      <section className="mx-auto max-w-5xl px-6 py-8">
        <div className="overflow-hidden rounded-3xl edge bg-brand/5">
          <div className="p-6 text-left sm:p-10">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">For your agent</p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl edge bg-background text-brand">
                <Bot className="size-5" strokeWidth={2} />
              </span>
              <h2 className="text-2xl font-normal tracking-tight text-foreground sm:text-3xl">
                Design rules for AI
              </h2>
            </div>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground text-pretty">
              A drop-in rule you install like any component. One command writes{" "}
              <code className="font-mono text-[13px] text-foreground">
                .cursor/rules/byronwade-ui.mdc
              </code>{" "}
              (or paste it into Claude, Copilot, Codex, Windsurf…). After that your agent knows the
              system&apos;s laws on every edit — which components to reach for, which tokens to use,
              and how re-skinning works.
            </p>

            <ul className="mt-6 grid gap-2.5">
              {designRulePoints.map((point) => (
                <li key={point} className="flex items-start gap-2.5 text-sm leading-relaxed">
                  <Check className="mt-0.5 size-4 shrink-0 text-brand" />
                  <span className="text-muted-foreground text-pretty">{point}</span>
                </li>
              ))}
            </ul>

            <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 flex-1">
                <CodeBlock lang="bash" code="npx shadcn@latest add @byronwade/design-rules" />
              </div>
              <Button variant="outline" className="shrink-0" render={<Link href="/docs/ai" />}>
                Full setup guide
                <ArrowRight />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================ FOOTER CTA ===== */}
      <section className="mx-auto max-w-5xl px-6 py-24 text-center">
        <h2 className="text-[clamp(2rem,6vw,3.5rem)] font-normal leading-[1.0] tracking-tight text-balance text-foreground">
          {components.length} components.{" "}
          <span className="text-gradient-brand">One install.</span>
        </h2>
        <p className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-muted-foreground text-pretty">
          Browse the catalog, the layout archetypes, and the foundation — then make it yours from a
          single variable.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" render={<Link href="/docs" />}>
            Browse the catalog
            <ArrowRight />
          </Button>
          <Button size="lg" variant="outline" render={<Link href="/docs/foundation" />}>
            See the foundation
          </Button>
        </div>
      </section>
    </main>
  );
}

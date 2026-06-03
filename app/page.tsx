import Link from "next/link";
import { ArrowRight, Bot, Check, GitFork, Layers, LayoutTemplate, Palette } from "lucide-react";

import { Button } from "@/components/ui/button";
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
    <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-x-clip bg-background px-6 pt-24 pb-32 text-foreground sm:pt-28">
      {/* Calm atmosphere — faint dotted grid + a single warm-green glow. */}
      <div className="bg-grid pointer-events-none fixed inset-0 -z-10 opacity-[0.35]" />
      <div className="glow-brand pointer-events-none fixed inset-x-0 top-0 -z-10 h-[60vh] opacity-70" />

      <div className="mx-auto flex w-full max-w-3xl flex-col items-center text-center">
        <span className="animate-in fade-in slide-in-from-bottom-2 inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur duration-700">
          <span className="size-1.5 rounded-full bg-brand" />
          byronwade/ui · design system
        </span>

        <h1
          className="animate-in fade-in slide-in-from-bottom-3 mt-6 font-heading text-4xl font-semibold tracking-tight text-balance duration-700 sm:text-6xl"
          style={{ animationDelay: "60ms", animationFillMode: "both" }}
        >
          One design system for <span className="text-gradient-brand">every surface</span>.
        </h1>

        <p
          className="animate-in fade-in slide-in-from-bottom-3 mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-muted-foreground text-pretty duration-700 sm:text-base"
          style={{ animationDelay: "120ms", animationFillMode: "both" }}
        >
          A calm, content-first component library published as a namespaced{" "}
          <span className="text-foreground">shadcn registry</span>. Token-driven primitives,
          composites, and full-page layouts — all built around a single warm-green accent you
          re-skin from one CSS variable. Install with the shadcn CLI and you own the code.
        </p>

        <div
          className="animate-in fade-in slide-in-from-bottom-3 mt-8 flex flex-wrap items-center justify-center gap-3 duration-700"
          style={{ animationDelay: "180ms", animationFillMode: "both" }}
        >
          <Button size="lg" render={<Link href="/docs" />}>
            Enter
            <ArrowRight />
          </Button>
          <Button size="lg" variant="outline" render={<Link href="/docs/installation" />}>
            Install
          </Button>
          <Button size="lg" variant="ghost" render={<a href={GITHUB_URL} target="_blank" rel="noreferrer" />}>
            <GitFork />
            GitHub
          </Button>
        </div>

        {/* The one-liner — proof of how easy this is. */}
        <div
          className="animate-in fade-in slide-in-from-bottom-3 mt-8 w-full max-w-md duration-700"
          style={{ animationDelay: "240ms", animationFillMode: "both" }}
        >
          <div className="flex items-center gap-3 rounded-xl bg-card/70 px-4 py-2.5 text-left font-mono text-[13px] shadow-card backdrop-blur">
            <span className="select-none text-brand">$</span>
            <code className="truncate text-foreground">npx shadcn@latest add @byronwade/all</code>
          </div>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            One command installs the entire catalog.
          </p>
        </div>

        {/* Stat row. */}
        <dl
          className="animate-in fade-in slide-in-from-bottom-3 mt-12 flex flex-wrap items-center justify-center gap-x-10 gap-y-5 duration-700"
          style={{ animationDelay: "300ms", animationFillMode: "both" }}
        >
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center">
              <dt className="order-2 text-xs text-muted-foreground">{s.label}</dt>
              <dd className="order-1 font-heading text-3xl font-semibold tracking-tight tabular-nums">
                {s.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Three pillars — why it exists. */}
      <div
        className="animate-in fade-in slide-in-from-bottom-3 mx-auto mt-16 grid w-full max-w-4xl gap-4 duration-700 sm:grid-cols-3"
        style={{ animationDelay: "360ms", animationFillMode: "both" }}
      >
        {pillars.map((p) => (
          <div
            key={p.title}
            className="rounded-2xl border border-border bg-card/60 p-5 text-left backdrop-blur transition-colors hover:border-brand/30"
          >
            <span className="edge flex size-9 items-center justify-center rounded-xl bg-background text-brand">
              <p.icon className="size-4.5" strokeWidth={2} />
            </span>
            <h2 className="mt-4 text-sm font-semibold tracking-tight">{p.title}</h2>
            <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground text-pretty">
              {p.body}
            </p>
          </div>
        ))}
      </div>

      {/* Design rules — teach your AI agent the system. */}
      <section
        className="animate-in fade-in slide-in-from-bottom-3 mx-auto mt-4 w-full max-w-4xl duration-700"
        style={{ animationDelay: "420ms", animationFillMode: "both" }}
      >
        <div className="rounded-2xl border border-brand/30 bg-card/60 p-6 text-left backdrop-blur sm:p-8">
          <div className="flex flex-wrap items-start gap-4">
            <span className="edge flex size-10 shrink-0 items-center justify-center rounded-xl bg-background text-brand">
              <Bot className="size-5" strokeWidth={2} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-heading text-lg font-semibold tracking-tight sm:text-xl">
                  Design rules for AI
                </h2>
                <span className="rounded-full border border-brand/30 bg-brand/10 px-2 py-0.5 text-[11px] font-medium text-brand">
                  @byronwade/design-rules
                </span>
              </div>
              <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-muted-foreground text-pretty sm:text-sm">
                A drop-in rule you install from this registry — the same way you add a button or
                card. One command writes{" "}
                <code className="font-mono text-[12px] text-foreground">.cursor/rules/byronwade-ui.mdc</code>{" "}
                into your project (or paste the file into Claude, Copilot, Codex, Windsurf…). After
                that, your AI agent knows the design system&apos;s laws on every edit: which
                components to reach for, which tokens to use, and how re-skinning works — so you
                never have to re-explain the system when you ship new features.
              </p>
            </div>
          </div>

          <ul className="mt-6 grid gap-2.5 sm:grid-cols-1">
            {designRulePoints.map((point) => (
              <li key={point} className="flex items-start gap-2.5 text-[13px] leading-relaxed sm:text-sm">
                <Check className="mt-0.5 size-4 shrink-0 text-brand" />
                <span className="text-muted-foreground">{point}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0 flex-1 rounded-xl bg-background/70 px-4 py-3 font-mono text-[13px] shadow-card">
              <span className="select-none text-brand">$ </span>
              <code className="text-foreground">npx shadcn@latest add @byronwade/design-rules</code>
            </div>
            <Button variant="outline" className="shrink-0" render={<Link href="/docs/ai" />}>
              Full setup guide
              <ArrowRight />
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

import Link from "next/link"
import {
  ArrowRight,
  Check,
  GitFork,
  Layout,
  Palette,
  Robot,
  Stack,
} from "@/lib/icons"

import { Button } from "@/components/ui/button"
import { CodeBlock } from "@/app/(docs)/_components/code-block"
import { components } from "@/content/components"
import { catalogSurfaces, surfaceCounts } from "@/content/catalog-surfaces"
import { archetypes } from "@/app/layouts/_archetypes"
import { SiteAtmosphere } from "@/app/_components/cinematic/site-atmosphere"
import { Reveal } from "@/app/_components/cinematic/reveal"

const GITHUB_URL = "https://github.com/byronwade/ui"

const stats = [
  { value: components.length, label: "components" },
  { value: archetypes.length, label: "layout archetypes" },
  { value: 1, label: "brand variable" },
]

const designRulePoints = [
  "Use installed @byronwade/ui components, add missing ones with shadcn, don't rebuild from scratch.",
  "Style with semantic tokens only (bg-brand, text-muted-foreground), never hardcode hex or Tailwind colors.",
  "Re-skin through --brand only, rings, charts, and success states follow automatically.",
]

const pillars = [
  {
    icon: Stack,
    title: "Token-driven",
    body: "Every primitive is built on one foundation of CSS variables. No hardcoded colors, ever.",
  },
  {
    icon: Palette,
    title: "Re-skin from one variable",
    body: "Override --brand and rings, charts, active states, and status all follow in light and dark.",
  },
  {
    icon: Layout,
    title: "App shells, not landing pages",
    body: "Ships dense, operational page scaffolds — dashboards, master-detail, command centers — built for daily product work.",
  },
]

export default function HomePage() {
  return (
    <main className="relative isolate min-h-dvh overflow-x-clip text-foreground">
      <SiteAtmosphere />

      {/* ====================================================== HERO ===== */}
      <section className="mx-auto flex min-h-dvh w-full flex-col items-center justify-center px-6 pb-24 pt-28 text-center sm:pt-32">
        <p className="animate-in fade-in slide-in-from-bottom-2 rounded-full bg-muted/40 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground duration-700">
          byronwade/ui · app-only design system
        </p>

        <h1 className="mt-8 text-[clamp(2.75rem,9.5vw,7.5rem)] font-normal leading-[0.92] tracking-tight text-balance">
          <span className="block animate-in fade-in slide-in-from-bottom-4 fill-mode-both duration-700 [animation-delay:80ms]">
            Calm app UI,{" "}
          </span>
          <span className="block animate-in fade-in slide-in-from-bottom-4 fill-mode-both text-gradient-brand duration-1000 [animation-delay:160ms]">
            enforced by agents.
          </span>
        </h1>

        <p className="reading-ui animate-in fade-in slide-in-from-bottom-3 fill-mode-both mx-auto mt-8 text-foreground text-pretty duration-700 [animation-delay:240ms]">
          An <span className="text-foreground">app-only design system</span> for
          building calm, dense, agent-native product interfaces — dashboards,
          admin panels, developer tools, AI workbenches, resource lists, and
          object-detail workflows. Token-driven, published as a namespaced
          shadcn registry, re-skinned from one CSS variable.
        </p>

        <div className="animate-in fade-in slide-in-from-bottom-3 fill-mode-both mt-10 flex flex-wrap items-center justify-center gap-3 duration-700 [animation-delay:320ms]">
          <Button size="lg" render={<Link href="/docs" />}>
            Enter
            <ArrowRight />
          </Button>
          <Button
            size="lg"
            variant="outline"
            render={<Link href="/docs/installation" />}
          >
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

        <div className="animate-in fade-in slide-in-from-bottom-3 fill-mode-both mt-10 w-full max-w-md text-left duration-700 [animation-delay:400ms]">
          <CodeBlock lang="bash" code="npx shadcn@latest add @byronwade/all" />
          <p className="mt-2 text-center text-xs text-muted-foreground">
            One command installs the entire catalog.
          </p>
        </div>

        <dl className="animate-in fade-in slide-in-from-bottom-3 fill-mode-both mt-16 flex flex-wrap items-start justify-center gap-x-12 gap-y-6 duration-700 [animation-delay:480ms]">
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

      {/* ============================================== SURFACE SPLIT ===== */}
      <section className="mx-auto w-full max-w-7xl px-6 py-24 sm:px-8 lg:px-12">
        <Reveal className="text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">
            Application-first · one foundation
          </p>
          <h2 className="mx-auto mt-4 max-w-2xl text-[clamp(1.75rem,4vw,2.75rem)] font-normal leading-tight tracking-tight text-foreground text-balance">
            Built for the surfaces people work in every day.
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {catalogSurfaces.map((surface, i) => (
            <Reveal key={surface.id} delay={i * 0.1}>
              <Link
                href={surface.href}
                className="group block h-full rounded-2xl edge bg-card p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:depth-raised"
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand">
                  {surface.shortLabel}
                </p>
                <h3 className="mt-3 text-xl font-normal tracking-tight text-foreground">
                  {surface.label}
                </h3>
                <p className="reading-ui mt-3 text-foreground text-pretty">
                  {surface.description}
                </p>
                <p className="mt-4 font-mono text-xs text-muted-foreground">
                  {surface.id === "app"
                    ? surfaceCounts().app
                    : surfaceCounts().marketing}{" "}
                  components · Browse{" "}
                  <span className="text-brand transition-transform group-hover:translate-x-0.5 inline-block">
                    →
                  </span>
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* =================================================== PILLARS ===== */}
      <section className="mx-auto w-full max-w-7xl px-6 py-24 sm:px-8 lg:px-12">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">
            Why it exists
          </p>
        </Reveal>
        <div className="mt-6 grid gap-px overflow-hidden rounded-2xl edge bg-border sm:grid-cols-3">
          {pillars.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08} className="bg-card">
              <div className="h-full p-6 text-left">
                <span className="flex size-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
                  <p.icon className="size-5" strokeWidth={2} />
                </span>
                <h3 className="mt-4 text-base font-medium tracking-tight text-foreground">
                  {p.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground text-pretty">
                  {p.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============================================ RESKIN CINEMATIC ==== */}
      <section className="full-bleed relative my-8 overflow-hidden edge bg-card">
        <div className="glow-brand pointer-events-none absolute inset-x-0 top-0 h-full opacity-40" />
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-[0.15]" />
        <div className="relative mx-auto max-w-5xl px-6 py-24 text-center sm:py-32">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">
              One knob re-skins everything
            </p>
            <h2 className="mx-auto mt-5 max-w-3xl text-[clamp(2rem,6vw,4rem)] font-normal leading-[1.02] tracking-tight text-balance">
              Change <span className="text-gradient-brand">--brand</span>.
              Rings, charts, focus, and status all follow.
            </h2>
          </Reveal>
          <Reveal delay={0.12} className="mx-auto mt-8 max-w-md text-left">
            <CodeBlock
              lang="css"
              code={`:root { --brand: oklch(0.55 0.20 25); }
.dark { --brand: oklch(0.65 0.20 25); }`}
            />
          </Reveal>
        </div>
      </section>

      {/* =================================================== AI RULES ===== */}
      <section className="mx-auto w-full max-w-7xl px-6 py-24 sm:px-8 lg:px-12">
        <Reveal>
          <div className="overflow-hidden rounded-3xl edge bg-brand/5">
            <div className="p-6 text-left sm:p-10">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">
                For your agent
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl edge bg-background text-brand">
                  <Robot className="size-5" strokeWidth={2} />
                </span>
                <h2 className="text-2xl font-normal tracking-tight text-foreground sm:text-3xl">
                  Design rules for AI
                </h2>
              </div>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground text-pretty">
                A drop-in rule you install like any component. One command
                writes{" "}
                <code className="font-mono text-[13px] text-foreground">
                  .cursor/rules/byronwade-ui.mdc
                </code>{" "}
                (or paste it into Claude, Copilot, Codex, Windsurf…). After that
                your agent knows the system&apos;s laws on every edit, which
                components to reach for, which tokens to use, and how
                re-skinning works.
              </p>

              <ul className="mt-6 grid gap-2.5">
                {designRulePoints.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-2.5 text-sm leading-relaxed"
                  >
                    <Check className="mt-0.5 size-4 shrink-0 text-brand" />
                    <span className="text-muted-foreground text-pretty">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 flex-1">
                  <CodeBlock
                    lang="bash"
                    code="npx shadcn@latest add @byronwade/design-rules"
                  />
                </div>
                <Button
                  variant="outline"
                  className="shrink-0"
                  render={<Link href="/docs/ai" />}
                >
                  Full setup guide
                  <ArrowRight />
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ================================================ FOOTER CTA ===== */}
      <section className="relative mx-auto w-full max-w-4xl px-6 py-28 text-center sm:py-36">
        <Reveal>
          <h2 className="text-[clamp(2.25rem,7vw,4.5rem)] font-normal leading-[1.0] tracking-tight text-balance text-foreground">
            {components.length} components.{" "}
            <span className="text-gradient-brand">One install.</span>
          </h2>
          <p className="reading-ui mx-auto mt-6 text-foreground text-pretty">
            Lead with application UI — shells, tables, resource lists, AI
            workbenches — then make it yours from a single variable.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" render={<Link href="/catalog?surface=app" />}>
              Application UI
              <ArrowRight />
            </Button>
            <Button
              size="lg"
              variant="outline"
              render={<Link href="/docs/surfaces" />}
            >
              How surfaces work
            </Button>
          </div>
        </Reveal>
      </section>
    </main>
  )
}

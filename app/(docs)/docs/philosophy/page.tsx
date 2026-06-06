import type { Metadata } from "next"
import Link from "next/link"
import {
  ArrowRight,
  Blocks,
  Bot,
  Layers,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Philosophy, byronwade/ui",
  description:
    "Why byronwade/ui exists: warm editorial aesthetics, token-driven architecture, agent-native enforcement, and a design system you own outright.",
}

/* ---------------------------------------------------------------------------
   Philosophy = the manifesto. Distinct signature: editorial, serif-led prose
   with numbered tenets and a start-to-finish journey through the Get Started
   pages. Rich, not bland, big type, the green accent, edge cards, small token
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
    body: "A warm paper canvas and warm near-black ink, never pure white, never pure black. Clinical neutrals keep you at arm's length; a little warmth invites you to stay and read. The hue is structural, baked into the foundation tokens, not a skin you swap later.",
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
    body: "Every emphatic thing, rings, charts, success, active states, derives from a single brand token. One voltage, used sparingly, reads as confidence; a rainbow reads as noise. Override --brand once and the whole accent family follows, in light and dark.",
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
    body: "Nothing is hardcoded. Every surface, text color, and state resolves through a semantic token, so dark mode and a full re-skin come for free. Change one variable, not a hundred call sites. If a value cannot be expressed as a token, it probably does not belong in the system.",
    demo: (
      <div className="flex flex-wrap gap-1.5 font-mono text-[10px]">
        {[
          "bg-brand",
          "text-foreground",
          "bg-muted",
          "border-border",
          "ring-ring",
          "bg-destructive",
        ].map((t) => (
          <span
            key={t}
            className="rounded-md edge bg-card px-2 py-1 text-muted-foreground"
          >
            {t}
          </span>
        ))}
      </div>
    ),
  },
  {
    n: "04",
    title: "Depth is a hairline",
    body: "No drop shadows. A single inset edge gives a surface just enough presence to sit into its background. Flatness, executed with care, reads as quality. Borders are for separators between regions, not for boxing every card.",
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
    body: "Hierarchy comes from size, tracking, and the typeface, not heavy weights or color. Three families, each with one job: sans for interface, mono for data, serif for reading. Display and section headings stay font-normal or font-medium. Bold is reserved for genuinely urgent emphasis inside body copy.",
    demo: (
      <div className="grid grid-cols-3 gap-2 text-center leading-none">
        <span className="font-sans text-3xl tracking-tight text-foreground">
          Aa
        </span>
        <span className="font-serif text-3xl italic text-foreground">Aa</span>
        <span className="font-mono text-3xl text-foreground">Aa</span>
      </div>
    ),
  },
  {
    n: "06",
    title: "Compose, don't reinvent",
    body: "Primitives become composites become whole pages. A status pill is a status dot plus a chip. A page header is typography plus optional actions. Consistency is not enforced by a linter alone; it is the natural byproduct of always reaching for what already exists.",
    demo: (
      <div className="flex items-center gap-2 font-mono text-[10px] text-muted-foreground">
        <span className="rounded-md edge bg-card px-2 py-1">button</span>
        <ArrowRight className="size-3 shrink-0" />
        <span className="rounded-md edge bg-card px-2 py-1">page-header</span>
        <ArrowRight className="size-3 shrink-0" />
        <span className="rounded-md edge bg-card px-2 py-1">app-shell</span>
      </div>
    ),
  },
  {
    n: "07",
    title: "Every page earns a hero",
    body: "No generic, repeated card grids. Each surface gets one signature moment that belongs only to it: the catalog index, the token swatch wall, the type specimen, the skin gallery. Documentation should feel designed, not templated.",
  },
  {
    n: "08",
    title: "Yours to own",
    body: "Installed via the shadcn registry, the code is copied into your repo. No runtime dependency, no lock-in, no version skew between your app and a package you cannot see inside. Fork a component, rename a token, ship it. The system is source, not a black box.",
  },
  {
    n: "09",
    title: "Dark mode for free",
    body: "Because every color is a token, dark mode is not a second stylesheet you maintain in parallel. Flip the variable values under .dark and the entire product re-renders correctly. Accessibility states, focus rings, and status colors all inherit the same logic.",
    demo: (
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl edge bg-background p-3">
          <p className="font-mono text-[10px] text-muted-foreground">light</p>
          <p className="mt-1 text-sm text-foreground">Warm paper</p>
        </div>
        <div className="rounded-xl edge bg-foreground p-3">
          <p className="font-mono text-[10px] text-background/60">dark</p>
          <p className="mt-1 text-sm text-background">Warm ink</p>
        </div>
      </div>
    ),
  },
  {
    n: "10",
    title: "On-system, provably",
    body: "The next era of UI is written with agents, and agents drift the moment they reach for bg-[#f7f7f4] instead of your token. This system ships the rule, the lint, and the MCP server from one source of truth, so on-system is a definition you can enforce in CI, not a hope.",
  },
]

const REJECTS: { label: string; why: string }[] = [
  {
    label: "Cold zinc neutrals",
    why: "They signal developer-tool, not product. Warmth is structural here.",
  },
  {
    label: "Shadow stacks",
    why: "Depth comes from the edge hairline. Shadows age fast and fight dark mode.",
  },
  {
    label: "font-bold heroes",
    why: "Editorial hierarchy uses size and tracking. Bold headings read as shouting.",
  },
  {
    label: "Rainbow accents",
    why: "One brand variable. Charts and status have fixed semantic roles.",
  },
  {
    label: "Bespoke one-offs",
    why: "If it looks like UI, it should compose from an existing primitive.",
  },
  {
    label: "Raw hex in components",
    why: "Hardcoded color breaks re-skinning and makes agent output unreviewable.",
  },
]

const AGENT_LOOP: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  body: string
  href: string
}[] = [
  {
    icon: Bot,
    title: "Design rules",
    body: "An installable rule file teaches your agent the component catalog, token vocabulary, and editorial constraints before it writes a line.",
    href: "/docs/ai",
  },
  {
    icon: ShieldCheck,
    title: "On-system lint",
    body: "The same definition of on-system runs in ESLint and CI. Raw colors, off-token spacing, and hand-rolled shadows fail the build.",
    href: "/docs/lint",
  },
  {
    icon: Sparkles,
    title: "MCP server",
    body: "Agents query the live registry, fetch source, and self-check generations before they land in your repo.",
    href: "/docs/mcp",
  },
]

const PRACTICE: { do: string; dont: string }[] = [
  {
    do: "bg-brand text-brand-foreground",
    dont: "bg-[#22c55e] text-white",
  },
  {
    do: "font-medium tracking-tight text-4xl",
    dont: "font-bold text-green-600",
  },
  {
    do: "rounded-xl edge bg-card",
    dont: "rounded-lg shadow-lg border",
  },
  {
    do: '<Button variant="outline">',
    dont: '<button className="px-4 py-2 border…">',
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
      href: "/docs/readability",
      label: "Readability",
      blurb: "Evidence-based web reading baked into foundation.",
    },
    {
      step: "07",
      href: "/docs/ai",
      label: "AI rules",
      blurb: "Keep your agent building on-system.",
    },
    {
      step: "08",
      href: "/docs/lint",
      label: "Lint",
      blurb: "Enforce tokens and primitives in CI.",
    },
    {
      step: "09",
      href: "/docs/mcp",
      label: "MCP",
      blurb: "Give agents live access to the registry.",
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
            Most systems drift. Every new screen reinvents its own buttons,
            spacing, and color until the product feels like a patchwork. Agents
            make that worse: they reach for hex values and one-off divs because
            nothing stops them. This system is the opposite, a single quiet,
            content-first aesthetic you can adopt in minutes, re-skin from one
            variable, and keep on-system by construction.
          </p>
        </div>
      </section>

      {/* ============================ THE PROBLEM ===================== */}
      <section className="py-16">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">
          The problem
        </p>
        <h2 className="mt-3 max-w-2xl text-3xl font-normal tracking-tight text-foreground text-balance sm:text-4xl">
          Design systems fail quietly.
        </h2>
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <p className="font-serif text-[1.0625rem] leading-relaxed text-muted-foreground text-pretty">
            shadcn solved ownership: copy the code, it is yours, not a
            dependency you cannot inspect. But ownership alone does not stop
            drift. A team adds a green button here, a shadow there, a zinc
            palette on the next feature. Six months later the Figma file and the
            codebase disagree, and nobody can say when it happened.
          </p>
          <p className="font-serif text-[1.0625rem] leading-relaxed text-muted-foreground text-pretty">
            Now add an agent to the loop. It does not remember your last code
            review. It does not feel the inconsistency. It will happily write{" "}
            <code className="font-mono text-[13px] text-foreground">
              text-[#333]
            </code>{" "}
            because it worked in the last project. byronwade/ui treats that as a
            solvable engineering problem: one aesthetic, one token base, one
            definition of on-system, enforced everywhere code gets written.
          </p>
        </div>
      </section>

      {/* ============================ TENETS ========================== */}
      <section className={`${BLEED} border-y border-border bg-card py-16`}>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">
          Ten convictions
        </p>
        <h2 className="mt-3 max-w-2xl text-3xl font-normal tracking-tight text-foreground text-balance sm:text-4xl">
          What the system believes.
        </h2>
        <div className="mt-10 grid gap-x-10 gap-y-12 sm:grid-cols-2">
          {TENETS.map((t) => (
            <div key={t.n}>
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-sm text-brand">{t.n}</span>
                <h3 className="text-xl font-normal tracking-tight text-foreground">
                  {t.title}
                </h3>
              </div>
              <p className="mt-3 font-serif text-[1.0625rem] leading-relaxed text-muted-foreground text-pretty">
                {t.body}
              </p>
              {t.demo ? <div className="mt-4">{t.demo}</div> : null}
            </div>
          ))}
        </div>
      </section>

      {/* ============================ REJECTS ========================= */}
      <section className="py-16">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">
          What we turn away from
        </p>
        <h2 className="mt-3 max-w-2xl text-3xl font-normal tracking-tight text-foreground text-balance sm:text-4xl">
          Taste is a constraint.
        </h2>
        <p className="mt-4 max-w-2xl font-serif text-[1.0625rem] leading-relaxed text-muted-foreground text-pretty">
          Philosophy is as much about refusal as preference. These patterns are
          not banned because they are ugly; they are banned because they break
          the guarantees the system makes about warmth, re-skinning, and
          agent-reviewable output.
        </p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {REJECTS.map((r) => (
            <div
              key={r.label}
              className="flex gap-3 rounded-xl edge bg-card p-4"
            >
              <X className="mt-0.5 size-4 shrink-0 text-destructive" />
              <div>
                <p className="text-sm font-medium text-foreground">{r.label}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {r.why}
                </p>
              </div>
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

      {/* ============================ AGENT-NATIVE ===================== */}
      <section className="py-16">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">
          Agent-native
        </p>
        <h2 className="mt-3 max-w-2xl text-3xl font-normal tracking-tight text-foreground text-balance sm:text-4xl">
          Built for the way code gets written now.
        </h2>
        <p className="mt-4 max-w-2xl font-serif text-[1.0625rem] leading-relaxed text-muted-foreground text-pretty">
          A design system that only exists in Figma is already obsolete. This
          one ships the guidance, the enforcement, and the live registry access
          as first-class artifacts, all generated from the same{" "}
          <code className="font-mono text-[13px] text-foreground">
            registry.json
          </code>
          , so the agent is never told to install a component that does not
          exist.
        </p>
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {AGENT_LOOP.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group rounded-2xl edge bg-card p-5 transition-colors hover:bg-accent/40"
            >
              <item.icon className="size-5 text-brand" />
              <h3 className="mt-4 text-base font-medium text-foreground">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.body}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm text-brand">
                Read more
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ============================ LIVING CHROME =================== */}
      <section className={`${BLEED} border-y border-border bg-card py-16`}>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">
              Living chrome
            </p>
            <h2 className="mt-3 text-3xl font-normal tracking-tight text-foreground text-balance sm:text-4xl">
              Navigation that blooms, not teleports.
            </h2>
            <p className="mt-4 font-serif text-[1.0625rem] leading-relaxed text-muted-foreground text-pretty">
              Most design systems treat navigation as static chrome: a sidebar,
              a top bar, done. Here, floating docks and toolbars morph in place,
              growing from a compact pill into a full panel on a tuned curve,
              then shrinking cleanly back. It is not decoration; it is a
              primitive ({`use-chrome-morph`}, {`morph-dock`}) you compose like
              any other component.
            </p>
            <p className="mt-4 font-serif text-[1.0625rem] leading-relaxed text-muted-foreground text-pretty">
              Motion respects reduced-motion preferences. Esc and click-away
              close panels. The dock reads from pure{" "}
              <code className="font-mono text-[13px] text-foreground">
                --dock
              </code>{" "}
              tokens so it re-skins with everything else.
            </p>
          </div>
          <div className="rounded-2xl edge bg-background p-6">
            <div className="flex items-center gap-3">
              <Layers className="size-5 text-brand" />
              <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
                morph-dock · collapsed → open
              </p>
            </div>
            <div className="mt-6 space-y-3">
              <div className="mx-auto h-10 w-48 rounded-full edge bg-dock" />
              <div className="mx-auto flex justify-center">
                <ArrowRight className="size-4 rotate-90 text-muted-foreground" />
              </div>
              <div className="mx-auto min-h-32 w-full max-w-xs rounded-2xl edge bg-dock p-4">
                <div className="space-y-2">
                  <div className="h-2 w-3/4 rounded-sm bg-dock-foreground/20" />
                  <div className="h-2 w-full rounded-sm bg-dock-foreground/10" />
                  <div className="h-2 w-5/6 rounded-sm bg-dock-foreground/10" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================ IN PRACTICE ===================== */}
      <section className="py-16">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">
          In practice
        </p>
        <h2 className="mt-3 max-w-2xl text-3xl font-normal tracking-tight text-foreground text-balance sm:text-4xl">
          The same instinct, every time.
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground text-pretty">
          When in doubt, reach for the token or the primitive. The lint catches
          what habit misses.
        </p>
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
              <code className="block bg-card px-4 py-3 text-[12px] text-brand">
                {row.do}
              </code>
              <code className="block border-l border-border bg-card px-4 py-3 text-[12px] text-destructive/80">
                {row.dont}
              </code>
            </div>
          ))}
        </div>
      </section>

      {/* ============================ LINEAGE ========================= */}
      <section className={`${BLEED} border-y border-border bg-card py-16`}>
        <div className="mx-auto max-w-3xl text-center">
          <Blocks className="mx-auto size-6 text-brand" />
          <h2 className="mt-4 text-2xl font-normal tracking-tight text-foreground text-balance sm:text-3xl">
            shadcn lineage, byronwade convictions.
          </h2>
          <p className="mt-4 font-serif text-[1.0625rem] leading-relaxed text-muted-foreground text-pretty">
            The install model is the same: a namespaced registry, the shadcn
            CLI, code copied into your project. What changes is everything
            around it: warm editorial aesthetics, a single accent variable,
            morphing chrome primitives, and an agent toolchain that keeps output
            reviewable. You get the ownership model everyone already trusts,
            plus a system that still looks like yours six months from now.
          </p>
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
          href="/docs/foundation"
          className="inline-flex items-center gap-1.5 text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          Foundation tokens
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

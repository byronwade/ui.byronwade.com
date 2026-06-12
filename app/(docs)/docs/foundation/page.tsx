import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "@/lib/icons"

import { CodeBlock } from "@/app/(docs)/_components/code-block"
import { BLEED } from "@/app/(docs)/_components/docs-prose"
import { GuidePager } from "@/app/(docs)/_components/guide-pager"
import { REGISTRY_URL } from "@/content/guides"

export const metadata: Metadata = {
  title: "Foundation, byronwade/ui",
  description:
    "The complete token base, surfaces, brand & status, charts, agent-activity pastels, the radius scale, the hairline depth model, and house utilities.",
}

/* ---------------------------------------------------------------------------
   Foundation = the tokens. Distinct signature: the hero is a wall of the
   palette itself. Everything renders with real utilities, so the page IS the
   foundation, change a token and this page changes with it.
--------------------------------------------------------------------------- */

const WALL: { box: string; token: string }[] = [
  { box: "bg-background", token: "background" },
  { box: "bg-card", token: "card" },
  { box: "bg-muted", token: "muted" },
  { box: "bg-secondary", token: "secondary" },
  { box: "bg-accent", token: "accent" },
  { box: "bg-border", token: "border" },
  { box: "bg-foreground", token: "foreground" },
  { box: "bg-muted-foreground", token: "muted-fg" },
  { box: "bg-brand", token: "brand" },
  { box: "bg-brand/10", token: "brand/10" },
  { box: "bg-success", token: "success" },
  { box: "bg-warning", token: "warning" },
  { box: "bg-destructive", token: "destructive" },
  { box: "bg-chart-2", token: "chart-2" },
  { box: "bg-chart-3", token: "chart-3" },
  { box: "bg-activity-thinking", token: "act·thinking" },
  { box: "bg-activity-search", token: "act·search" },
  { box: "bg-activity-read", token: "act·read" },
  { box: "bg-activity-edit", token: "act·edit" },
]

const RADII = [
  "rounded-sm",
  "rounded-md",
  "rounded-lg",
  "rounded-xl",
  "rounded-2xl",
  "rounded-3xl",
  "rounded-4xl",
]

export default function FoundationPage() {
  return (
    <article className="max-w-none">
      {/* ============================ HERO, swatch wall ================ */}
      <section className={`${BLEED} border-b border-border`}>
        <div className="flex items-baseline justify-between gap-4 pt-12 pb-6 lg:pt-16">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">
            Foundation
          </p>
          <p className="font-mono text-[11px] text-muted-foreground">
            {WALL.length}+ tokens · :root
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2 pb-10 sm:grid-cols-5 lg:grid-cols-7">
          <div className="col-span-3 flex flex-col justify-center sm:col-span-2 lg:col-span-3">
            <h1 className="text-[clamp(2rem,6vw,4rem)] font-normal leading-[0.95] tracking-tight text-foreground text-balance">
              The palette, <span className="text-brand">in full.</span>
            </h1>
            <p className="mt-3 max-w-md font-mono text-[13px] leading-relaxed text-muted-foreground">
              Warm paper neutrals, one brand accent, fixed data hues. One base
              for both{" "}
              <Link
                href="/docs/surfaces"
                className="text-brand underline-offset-4 hover:underline"
              >
                surfaces
              </Link>{" "}
              — application UI and marketing. It owns your :root, install with
              init.
            </p>
          </div>
          {WALL.map((s) => (
            <div key={s.token} className="animate-in fade-in duration-500">
              <div className={`h-16 rounded-lg edge ${s.box}`} />
              <p className="mt-1.5 truncate font-mono text-[10px] text-muted-foreground">
                {s.token}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ============================ INSTALL strip ===================== */}
      <section className="py-10">
        <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
          <CodeBlock
            lang="bash"
            code={`npx shadcn@latest init ${REGISTRY_URL}/r/foundation.json`}
          />
          <p className="font-mono text-[11px] text-muted-foreground md:text-right">
            the base owns :root, install once
          </p>
        </div>
      </section>

      {/* ============================ RADIUS (single morphing row) ====== */}
      <section className={`${BLEED} border-y border-border bg-card`}>
        <div className="py-14">
          <div className="flex items-baseline justify-between gap-4">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">
              Radius scale
            </p>
            <p className="font-mono text-[11px] text-muted-foreground">
              from --radius
            </p>
          </div>
          <div className="mt-8 flex items-end gap-3 sm:gap-5">
            {RADII.map((r) => (
              <div key={r} className="flex-1">
                <div className={`aspect-square bg-brand/15 edge ${r}`} />
                <p className="mt-2 truncate text-center font-mono text-[10px] text-muted-foreground">
                  {r.replace("rounded-", "")}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ DEPTH + UTILITIES (asymmetric) ==== */}
      <section className="grid gap-12 py-16 lg:grid-cols-[5fr_7fr]">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">
            Depth is a hairline
          </p>
          <p className="reading-ui mt-3 text-foreground text-pretty">
            No drop shadows. A single inset{" "}
            <span className="text-foreground">edge</span> catches light so a
            surface sits into its background.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="rounded-2xl edge bg-card p-5">
              <p className="font-mono text-[11px] text-brand">edge</p>
              <p className="mt-2 text-xs text-muted-foreground">
                hairline, the house model
              </p>
            </div>
            <div className="rounded-2xl bg-card p-5">
              <p className="font-mono text-[11px] text-muted-foreground">
                none
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                dissolves into the page
              </p>
            </div>
          </div>
        </div>

        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">
            House utilities
          </p>
          <p className="reading-ui mt-3 text-foreground text-pretty">
            Texture and treatments the foundation ships, reuse instead of
            re-rolling.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="overflow-hidden rounded-2xl edge bg-background">
              <div className="bg-grid h-24" />
              <p className="px-3 py-2 font-mono text-[10px] text-muted-foreground">
                bg-grid
              </p>
            </div>
            <div className="overflow-hidden rounded-2xl edge bg-background">
              <div className="glow-brand h-24" />
              <p className="px-3 py-2 font-mono text-[10px] text-muted-foreground">
                glow-brand
              </p>
            </div>
            <div className="overflow-hidden rounded-2xl edge bg-background">
              <div className="flex h-24 items-center justify-center">
                <span className="text-gradient-brand text-3xl font-medium tracking-tight">
                  Aa
                </span>
              </div>
              <p className="px-3 py-2 font-mono text-[10px] text-muted-foreground">
                text-gradient-brand
              </p>
            </div>
            <div className="overflow-hidden rounded-2xl edge bg-background">
              <div className="reading-ui p-4 text-foreground">
                <p>reading-ui · 65ch docs lane</p>
              </div>
              <p className="px-3 py-2 font-mono text-[10px] text-muted-foreground">
                reading-ui
              </p>
            </div>
            <div className="overflow-hidden rounded-2xl edge bg-background">
              <div className="reading-prose p-4 text-foreground">
                <p>reading-prose · 65ch essay lane</p>
              </div>
              <p className="px-3 py-2 font-mono text-[10px] text-muted-foreground">
                reading-prose
              </p>
            </div>
            <div className="overflow-hidden rounded-2xl edge bg-background">
              <div className="flex h-24 items-center">
                <p className="mask-fade-x whitespace-nowrap px-4 text-sm text-muted-foreground">
                  fades softly at both edges as it runs past the frame
                </p>
              </div>
              <p className="px-3 py-2 font-mono text-[10px] text-muted-foreground">
                mask-fade-x
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================ TYPE + RESKIN (band) ============== */}
      <section className={`${BLEED} border-y border-border bg-muted/30`}>
        <div className="grid gap-12 py-16 md:grid-cols-2">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">
              Type tokens
            </p>
            <div className="mt-5 space-y-2">
              <p className="font-sans text-2xl text-foreground">font-sans</p>
              <p className="font-mono text-2xl text-foreground">font-mono</p>
              <p className="font-serif text-2xl text-foreground">font-serif</p>
            </div>
            <p className="reading-ui mt-3 text-foreground text-pretty">
              Three families carry the whole{" "}
              <Link
                href="/docs/typography"
                className="text-brand underline-offset-4 hover:underline"
              >
                type scale
              </Link>
              , and long-form copy routes through the{" "}
              <Link
                href="/docs/readability"
                className="text-brand underline-offset-4 hover:underline"
              >
                reading lanes
              </Link>{" "}
              (reading-ui and reading-prose).
            </p>
            <Link
              href="/docs/readability"
              className="mt-5 inline-flex items-center gap-1.5 text-sm text-brand underline-offset-4 hover:underline"
            >
              Why we chose this
              <ArrowRight className="size-3.5" />
            </Link>
            <Link
              href="/docs/typography"
              className="mt-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              The type system
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">
              One knob re-skins it
            </p>
            <p className="reading-ui mt-3 text-foreground text-pretty">
              Override <span className="text-foreground">--brand</span> and
              rings, charts, success, and active states all follow —{" "}
              <Link
                href="/docs/theming"
                className="text-brand underline-offset-4 hover:underline"
              >
                theming
              </Link>{" "}
              re-skins the whole system from this one variable.
            </p>
            <div className="mt-5">
              <CodeBlock
                lang="css"
                code={`:root { --brand: oklch(0.55 0.20 25); }
.dark { --brand: oklch(0.65 0.20 25); }`}
              />
            </div>
          </div>
        </div>
      </section>

      <GuidePager current="/docs/foundation" />
    </article>
  )
}

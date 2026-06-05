import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Check, X } from "lucide-react"

import { CodeBlock } from "@/app/(docs)/_components/code-block"

export const metadata: Metadata = {
  title: "Theming — byronwade/ui",
  description:
    "Re-skin the entire byronwade/ui system, light and dark, by overriding a single CSS variable.",
}

/* ---------------------------------------------------------------------------
   Theming = one knob, many skins. The hero gallery renders the SAME dashboard
   card in N accents — each card just scopes --brand inline; because custom
   properties resolve at use-site, the button, ring, chart, and success re-skin
   with zero JS. Then: the override, the anatomy of --brand, presets, the
   cascade, fixed exceptions, and do/don't.
--------------------------------------------------------------------------- */

const BLEED = "-mx-6 px-6 sm:-mx-8 sm:px-8 lg:-mx-10 lg:px-10"

const SKINS: { name: string; hue: number }[] = [
  { name: "green", hue: 148 },
  { name: "teal", hue: 182 },
  { name: "sky", hue: 235 },
  { name: "indigo", hue: 270 },
  { name: "violet", hue: 300 },
  { name: "magenta", hue: 330 },
  { name: "red", hue: 25 },
  { name: "amber", hue: 70 },
]

const PRESETS: { name: string; value: string; hue: number }[] = [
  { name: "Forest", value: "oklch(0.60 0.17 148)", hue: 148 },
  { name: "Ocean", value: "oklch(0.60 0.15 235)", hue: 235 },
  { name: "Iris", value: "oklch(0.58 0.19 290)", hue: 290 },
  { name: "Ember", value: "oklch(0.62 0.20 35)", hue: 35 },
  { name: "Gold", value: "oklch(0.72 0.16 75)", hue: 75 },
  { name: "Rose", value: "oklch(0.62 0.20 010)", hue: 10 },
]

const BARS = [38, 62, 48, 80, 56, 92]

/* A recognizable dashboard card, re-skinned by the scoped --brand. */
function Skin({ hue }: { hue: number }) {
  const scope = { "--brand": `oklch(0.62 0.18 ${hue})` } as React.CSSProperties
  return (
    <div style={scope} className="space-y-3 rounded-2xl edge bg-card p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-foreground">Revenue</span>
        <span className="inline-flex items-center gap-1 text-[11px] text-success">
          <span className="size-1.5 rounded-full bg-success" />
          +12%
        </span>
      </div>
      <p className="font-mono text-xl tabular-nums leading-none text-foreground">
        $48.2k
      </p>
      <div className="flex h-9 items-end gap-1">
        {BARS.map((h, i) => (
          <span
            key={i}
            className="flex-1 rounded-sm bg-chart-1"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center rounded-full bg-brand px-2.5 py-1 text-[11px] font-medium text-brand-foreground">
          View
        </span>
        <span className="flex-1 rounded-md bg-background px-2 py-1 text-[11px] text-muted-foreground ring-2 ring-ring">
          filter
        </span>
      </div>
      <p className="border-t border-border pt-2 font-mono text-[10px] text-muted-foreground">
        oklch(0.62 0.18 {hue})
      </p>
    </div>
  )
}

export default function ThemingPage() {
  return (
    <article className="max-w-none">
      {/* ============================ HERO ============================= */}
      <section
        className={`relative ${BLEED} overflow-hidden border-b border-border`}
      >
        <div className="glow-brand pointer-events-none absolute inset-x-0 -top-24 h-56 opacity-60" />
        <div className="relative py-12 sm:py-16">
          <p className="animate-in fade-in slide-in-from-bottom-3 font-mono text-xs uppercase tracking-[0.2em] text-brand duration-700">
            Foundation · Theming
          </p>
          <h1 className="mt-5 max-w-3xl text-[clamp(2.5rem,7vw,5rem)] font-normal leading-[0.95] tracking-tight text-foreground text-balance">
            One variable re-skins{" "}
            <span className="text-brand">everything.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty">
            The accent isn&apos;t scattered through components — it&apos;s
            derived from a single token,{" "}
            <span className="text-foreground">--brand</span>. Override it once
            and rings, charts, success, buttons, and active states all follow,
            light and dark. Below is the{" "}
            <span className="text-foreground">same card</span>, eight accents
            apart — each just one line of CSS.
          </p>

          <div className="mt-10 flex items-baseline justify-between gap-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              the same card · 8 values of --brand
            </p>
            <p className="hidden font-mono text-[11px] text-muted-foreground sm:block">
              ↓ one knob
            </p>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {SKINS.map((s) => (
              <Skin key={s.name} hue={s.hue} />
            ))}
          </div>
        </div>
      </section>

      {/* ============================ THE OVERRIDE ==================== */}
      <section className="py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">
              The whole change
            </p>
            <h2 className="mt-3 text-3xl font-normal tracking-tight text-foreground text-balance sm:text-4xl">
              Two lines in globals.css.
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground text-pretty">
              No component edits, no theme fork. Pick a slightly lighter, more
              chromatic value for dark so the accent keeps its punch against the
              warm dark surface.
            </p>
          </div>
          <CodeBlock
            lang="css"
            code={`:root { --brand: oklch(0.55 0.20 25); }   /* light */
.dark { --brand: oklch(0.65 0.20 25); }   /* dark  */`}
          />
        </div>
      </section>

      {/* ============================ ANATOMY OF --brand ============== */}
      <section className={`${BLEED} border-y border-border bg-card`}>
        <div className="py-16">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">
            Anatomy of the token
          </p>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground text-pretty">
            <code className="font-mono text-[13px] text-foreground">
              oklch(L C H)
            </code>{" "}
            — perceptual <span className="text-foreground">lightness</span>,{" "}
            <span className="text-foreground">chroma</span>, and{" "}
            <span className="text-foreground">hue</span>. Each axis moves
            independently, so tuning an accent is predictable.
          </p>
          <div className="mt-8 space-y-6">
            {[
              {
                k: "L · lightness",
                hint: "0 → 1 · how light",
                stops: [0.35, 0.45, 0.55, 0.65, 0.75, 0.85].map(
                  (l) => `oklch(${l} 0.17 148)`,
                ),
              },
              {
                k: "C · chroma",
                hint: "0 → 0.2 · how vivid",
                stops: [0, 0.04, 0.08, 0.12, 0.16, 0.2].map(
                  (c) => `oklch(0.62 ${c} 148)`,
                ),
              },
              {
                k: "H · hue",
                hint: "0 → 360 · which color",
                stops: [20, 90, 150, 210, 270, 330].map(
                  (h) => `oklch(0.62 0.18 ${h})`,
                ),
              },
            ].map((axis) => (
              <div
                key={axis.k}
                className="grid gap-2 sm:grid-cols-[10rem_1fr] sm:items-center"
              >
                <div>
                  <p className="font-mono text-sm text-foreground">{axis.k}</p>
                  <p className="font-mono text-[11px] text-muted-foreground">
                    {axis.hint}
                  </p>
                </div>
                <div className="flex h-10 overflow-hidden rounded-lg edge">
                  {axis.stops.map((c, i) => (
                    <span
                      key={i}
                      className="flex-1"
                      style={{ background: c }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ PRESETS ========================= */}
      <section className="py-16">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">
          Ready-to-paste accents
        </p>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground text-pretty">
          Drop any of these into{" "}
          <code className="font-mono text-[13px] text-foreground">--brand</code>
          . Each is tuned to sit right on the warm canvas.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PRESETS.map((p) => (
            <div
              key={p.name}
              className="flex items-center gap-4 rounded-2xl edge bg-card p-4"
            >
              <span
                className="size-12 shrink-0 rounded-xl edge"
                style={{ background: `oklch(0.62 0.18 ${p.hue})` }}
              />
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">{p.name}</p>
                <p className="truncate font-mono text-[11px] text-muted-foreground">
                  {p.value}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <CodeBlock
            lang="css"
            code={`/* e.g. Ocean */\n:root { --brand: oklch(0.60 0.15 235); }\n.dark { --brand: oklch(0.70 0.15 235); }`}
          />
        </div>
      </section>

      {/* ============================ CASCADE ========================= */}
      <section className={`${BLEED} border-y border-border bg-card`}>
        <div className="py-16">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">
            The cascade
          </p>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground text-pretty">
            These tokens all resolve to{" "}
            <span className="text-foreground">--brand</span>. Change the one and
            the family moves together.
          </p>
          <div className="mt-8 grid gap-px overflow-hidden rounded-2xl edge bg-border sm:grid-cols-2">
            {[
              {
                token: "--brand",
                swatch: "bg-brand",
                label: "Buttons, links, brand surfaces",
              },
              {
                token: "--ring",
                swatch: "bg-ring",
                label: "Focus rings on every element",
              },
              {
                token: "--success",
                swatch: "bg-success",
                label: "Positive status + gauges",
              },
              {
                token: "--chart-1",
                swatch: "bg-chart-1",
                label: "Primary chart series",
              },
            ].map((f) => (
              <div
                key={f.token}
                className="flex items-center gap-4 bg-card p-5"
              >
                <span
                  className={`size-10 shrink-0 rounded-xl edge ${f.swatch}`}
                />
                <div className="min-w-0">
                  <p className="font-mono text-sm text-foreground">{f.token}</p>
                  <p className="text-sm text-muted-foreground text-pretty">
                    {f.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-center gap-2">
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
        </div>
      </section>

      {/* ============================ EXCEPTIONS + DO/DON'T =========== */}
      <section className="grid gap-10 py-16 lg:grid-cols-2">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">
            Fixed exceptions
          </p>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground text-pretty">
            Two palettes carry meaning, so they{" "}
            <span className="text-foreground">don&apos;t</span> follow --brand.
          </p>
          <div className="mt-6 space-y-4">
            <div className="rounded-2xl edge bg-card p-5">
              <p className="font-mono text-xs text-muted-foreground">
                --chart-2 … --chart-5
              </p>
              <div className="mt-3 flex items-end gap-2">
                {[
                  "bg-chart-1",
                  "bg-chart-2",
                  "bg-chart-3",
                  "bg-chart-4",
                  "bg-chart-5",
                ].map((c, i) => (
                  <span
                    key={c}
                    className={`flex-1 rounded-md edge ${c}`}
                    style={{ height: `${52 - i * 6}px` }}
                  />
                ))}
              </div>
            </div>
            <div className="rounded-2xl edge bg-card p-5">
              <p className="font-mono text-xs text-muted-foreground">
                --activity-* (agent pastels)
              </p>
              <div className="mt-3 grid grid-cols-4 gap-2">
                {[
                  "bg-activity-thinking",
                  "bg-activity-search",
                  "bg-activity-read",
                  "bg-activity-edit",
                ].map((a) => (
                  <span key={a} className={`h-10 rounded-lg edge ${a}`} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">
            Do &amp; don&apos;t
          </p>
          <div className="mt-6 space-y-3">
            {[
              {
                ok: true,
                t: "Override --brand (and its .dark value) in globals.css.",
              },
              {
                ok: true,
                t: "Tone with opacity — bg-brand/10 — for soft chips and rings.",
              },
              {
                ok: false,
                t: "Hardcode a hex or Tailwind color in a component.",
              },
              {
                ok: false,
                t: "Pin --ring / --chart-1 / --success to a literal color.",
              },
            ].map((d) => (
              <div
                key={d.t}
                className="flex items-start gap-3 rounded-2xl edge bg-card p-4 text-sm leading-relaxed"
              >
                {d.ok ? (
                  <Check className="mt-0.5 size-4 shrink-0 text-success" />
                ) : (
                  <X className="mt-0.5 size-4 shrink-0 text-destructive" />
                )}
                <span
                  className={d.ok ? "text-foreground" : "text-muted-foreground"}
                >
                  {d.t}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground text-pretty">
            Authored in <span className="text-foreground">oklch</span>, so
            tints, dark values, and contrast stay honest across every accent.
          </p>
        </div>
      </section>

      {/* ============================ NAV ============================== */}
      <div className="flex flex-wrap gap-x-6 gap-y-3 border-t border-border pt-8 text-sm">
        <Link
          href="/docs/typography"
          className="inline-flex items-center gap-1.5 text-brand underline-offset-4 hover:underline"
        >
          Next: Typography
          <ArrowRight className="size-3.5" />
        </Link>
        <Link
          href="/docs/foundation"
          className="inline-flex items-center gap-1.5 text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          See the foundation
        </Link>
      </div>
    </article>
  )
}

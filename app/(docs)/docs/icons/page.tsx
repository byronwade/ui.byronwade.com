import type { Metadata } from "next"
import Link from "next/link"

import { Cube, Heart, Lightning, type IconWeight } from "@/lib/icons"
import { CodeBlock } from "@/app/(docs)/_components/code-block"
import { BLEED } from "@/app/(docs)/_components/docs-prose"
import { GuidePager } from "@/app/(docs)/_components/guide-pager"
import { IconGallery } from "@/app/(docs)/docs/icons/_components/icon-gallery"

export const metadata: Metadata = {
  title: "Icons, byronwade/ui",
  description:
    "One icon voice — Phosphor, duotone by default. Six weights, one accent, imported from a single @/lib/icons barrel so every component shares the same family.",
}

/* ---------------------------------------------------------------------------
   Icons = a specimen of the system's single icon voice. Signature hero: one
   glyph rendered across all six Phosphor weights, with duotone — the default —
   lit up. Token-driven; the accent comes from --brand via currentColor.
--------------------------------------------------------------------------- */

const WEIGHTS: { weight: IconWeight; label: string }[] = [
  { weight: "thin", label: "Thin" },
  { weight: "light", label: "Light" },
  { weight: "regular", label: "Regular" },
  { weight: "bold", label: "Bold" },
  { weight: "fill", label: "Fill" },
  { weight: "duotone", label: "Duotone" },
]

const USAGE = `import { Heart, MagnifyingGlass } from "@/lib/icons"

export function Example() {
  return (
    <>
      {/* duotone by default — no weight prop needed */}
      <Heart className="size-5 text-brand" />
      {/* override per call site when a state needs it */}
      <MagnifyingGlass weight="bold" className="size-5" />
    </>
  )
}`

export default function IconsPage() {
  return (
    <article className="max-w-none">
      {/* ============================ HERO ============================= */}
      <section className={`${BLEED} border-b border-border`}>
        <div className="flex items-baseline justify-between gap-4 pt-12 lg:pt-16">
          <p className="font-mono text-xs tracking-[0.2em] text-brand uppercase">
            Foundation · Icons
          </p>
          <p className="font-mono text-[11px] text-muted-foreground">
            Phosphor · 6 weights
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2 py-10 sm:grid-cols-6 sm:gap-6">
          {WEIGHTS.map(({ weight, label }) => (
            <div
              key={weight}
              className="flex flex-col items-center gap-3 leading-none"
            >
              <Heart
                weight={weight}
                aria-hidden
                className={
                  weight === "duotone"
                    ? "size-[clamp(2.5rem,9vw,5rem)] text-brand"
                    : "size-[clamp(2.5rem,9vw,5rem)] text-foreground"
                }
              />
              <span
                className={
                  weight === "duotone"
                    ? "font-mono text-[11px] text-brand"
                    : "font-mono text-[11px] text-muted-foreground"
                }
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ============================ INTRO ============================= */}
      <section className="py-12">
        <h1 className="max-w-3xl text-[clamp(1.5rem,4vw,2.25rem)] leading-snug font-normal tracking-tight text-balance text-foreground">
          One icon family, set in{" "}
          <span className="text-muted-foreground">duotone by default</span> —
          drawn from Phosphor, imported from a single barrel.
        </h1>
        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-pretty text-muted-foreground">
          Every icon in the system comes from{" "}
          <Link
            href="https://phosphoricons.com"
            className="text-brand underline-offset-4 hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            Phosphor
          </Link>
          , a flexible family designed at 16px to read small and scale up. The
          system speaks in <strong className="font-medium">duotone</strong>: the
          shape stays calm and neutral while a single accent — derived from{" "}
          <Link
            href="/docs/theming"
            className="text-brand underline-offset-4 hover:underline"
          >
            <code className="font-mono text-[0.85em]">--brand</code>
          </Link>{" "}
          via <code className="font-mono text-[0.85em]">currentColor</code> —
          tints the fill. Anything decorative, branded, or status-colored keeps
          that one accent, exactly like the rest of the system.
        </p>
      </section>

      {/* ============================ ONE BARREL ======================= */}
      <section className="border-t border-border py-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
          <div>
            <p className="font-mono text-xs tracking-[0.2em] text-brand uppercase">
              One import
            </p>
            <h2 className="mt-3 text-xl leading-snug font-normal tracking-tight text-foreground">
              Everything resolves to{" "}
              <code className="font-mono">@/lib/icons</code>
            </h2>
            <p className="mt-4 max-w-prose text-sm leading-relaxed text-muted-foreground">
              The barrel owns the default weight the way{" "}
              <code className="font-mono text-[0.9em]">--brand</code> owns the
              accent — change it in one place and the whole system re-skins. It
              is built on Phosphor&rsquo;s SSR-safe icons, so the same import
              renders identically in server and client components. Import names
              match Phosphor&rsquo;s catalog exactly; pass{" "}
              <code className="font-mono text-[0.9em]">weight</code> at any call
              site to override the duotone default.
            </p>
            <div className="mt-6 flex items-center gap-6 text-muted-foreground">
              <Cube className="size-8 text-brand" aria-hidden />
              <Heart className="size-8 text-brand" aria-hidden />
              <Lightning className="size-8 text-brand" aria-hidden />
            </div>
          </div>
          <CodeBlock code={USAGE} lang="tsx" />
        </div>
      </section>

      {/* ============================ GALLERY ========================== */}
      <section className="border-t border-border py-12">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-mono text-xs tracking-[0.2em] text-brand uppercase">
              The set
            </p>
            <h2 className="mt-3 text-xl leading-snug font-normal tracking-tight text-foreground">
              Every icon the system ships
            </h2>
          </div>
          <p className="max-w-sm text-[13px] leading-relaxed text-muted-foreground">
            Pulled straight from the barrel, in the duotone default. Click any
            glyph to copy its component name.
          </p>
        </div>
        <IconGallery />
      </section>

      <GuidePager current="/docs/icons" />
    </article>
  )
}

import type { Metadata } from "next"
import { ShieldCheck } from "lucide-react"

import { CodeBlock } from "@/app/(docs)/_components/code-block"

export const metadata: Metadata = {
  title: "Lint, byronwade/ui",
  description:
    "Keep consumer code on-system with the @byronwade/eslint-plugin-ui ESLint plugin and the byronwade-lint CLI.",
}

/* ---------------------------------------------------------------------------
   Docs page: on-system lint, ESLint plugin + CLI
   Mirrors the installation page shell: Eyebrow, BLEED, CodeBlock, token classes.
   Headings: font-normal or font-medium (never font-semibold / font-bold).
--------------------------------------------------------------------------- */

const BLEED = "-mx-6 px-6 sm:-mx-8 sm:px-8 lg:-mx-10 lg:px-10"

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">
      {children}
    </p>
  )
}

const DETECTORS: { label: string; description: string }[] = [
  {
    label: "Raw color",
    description:
      "Hex, rgb(), hsl(), and named colors are replaced with their nearest semantic token (e.g. text-foreground, bg-brand, bg-destructive). The maximum allowed distance is configurable via maxColorDistance.",
  },
  {
    label: "Off-token arbitrary spacing & radius",
    description:
      "Arbitrary Tailwind values like p-[14px] or rounded-[6px] are flagged. Use the spacing and radius steps from the foundation scale instead.",
  },
  {
    label: "Hand-rolled gradients, grids, and glows",
    description:
      "Custom gradient or grid CSS that duplicates a house utility (glow-brand, bg-grid, text-gradient-brand, mask-fade-x) triggers a warning to use the utility instead.",
  },
  {
    label: "Raw native elements where a primitive exists",
    description:
      "Using a bare <button>, <input>, or <select> where a design-system primitive covers the same role produces a warning. Controlled via the offSystemComponents option.",
  },
  {
    label: "Bold weight on headings",
    description:
      "font-semibold and font-bold on h1–h6 elements (or heading-role components) are flagged, the editorial-typography DNA requires font-medium or font-normal.",
  },
]

export default function LintPage() {
  return (
    <article className="max-w-none">
      {/* ======================================================= HERO ===== */}
      <section className={`relative ${BLEED} overflow-hidden`}>
        <div className="glow-brand pointer-events-none absolute inset-x-0 -top-24 h-64 opacity-70" />
        <div className="relative mx-auto max-w-5xl py-20 sm:py-28">
          <div className="animate-in fade-in slide-in-from-bottom-3 duration-700">
            <Eyebrow>Tooling · Lint</Eyebrow>
          </div>
          <h1 className="mt-6 text-[clamp(2.75rem,9vw,7rem)] font-normal leading-[0.95] tracking-tight text-balance">
            <span className="block animate-in fade-in slide-in-from-bottom-4 duration-700 text-foreground">
              Stay on-system.
            </span>
            <span className="block animate-in fade-in slide-in-from-bottom-4 fill-mode-both text-brand [animation-delay:120ms] duration-700">
              Every commit.
            </span>
          </h1>
          <p className="mt-8 max-w-xl animate-in fade-in fill-mode-both font-mono text-sm leading-relaxed text-muted-foreground [animation-delay:240ms] duration-700">
            The on-system lint enforces tokens, primitives, and house utilities
            in consumer codebases, the same engine that grades the design system
            itself. One plugin, one CLI, zero raw colors.
          </p>
        </div>
      </section>

      {/* ============================================ ESLINT PLUGIN ===== */}
      <section className="py-16">
        <div className="mx-auto max-w-5xl">
          <Eyebrow>01, ESLint plugin</Eyebrow>
          <p className="reading-ui mt-3 text-foreground text-pretty">
            <code className="font-mono text-[13px] text-foreground">
              @byronwade/eslint-plugin-ui
            </code>{" "}
            ships a flat-config-ready recommended preset that enables all five
            detectors. Works with ESLint 9+ and the flat-config format.
          </p>

          <div className="mt-8 space-y-6">
            <div>
              <p className="mb-2 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                install
              </p>
              <CodeBlock
                lang="bash"
                code={`npm i -D @byronwade/eslint-plugin-ui`}
              />
            </div>

            <div>
              <p className="mb-2 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                eslint.config.js
              </p>
              <CodeBlock
                lang="js"
                code={`import byronwadeUi from "@byronwade/eslint-plugin-ui";

export default [ byronwadeUi.configs.recommended ];`}
              />
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <h3 className="text-sm font-medium text-foreground">Options</h3>
            <div className="overflow-x-auto rounded-xl edge bg-muted/40">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                      option
                    </th>
                    <th className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                      default
                    </th>
                    <th className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                      description
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="px-4 py-3 font-mono text-[13px] text-foreground">
                      maxColorDistance
                    </td>
                    <td className="px-4 py-3 font-mono text-[13px] text-muted-foreground">
                      10
                    </td>
                    <td className="px-4 py-3 text-[13px] leading-relaxed text-muted-foreground">
                      Maximum ΔE distance before a raw color is flagged as
                      &quot;too far from any token&quot;. Lower values are
                      stricter.
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-[13px] text-foreground">
                      offSystemComponents
                    </td>
                    <td className="px-4 py-3 font-mono text-[13px] text-muted-foreground">
                      [&quot;button&quot;, &quot;input&quot;,
                      &quot;select&quot;]
                    </td>
                    <td className="px-4 py-3 text-[13px] leading-relaxed text-muted-foreground">
                      Native HTML elements for which a design-system primitive
                      exists. Override to expand or reduce the set.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================== CLI ===== */}
      <section className={`${BLEED} border-y border-border bg-card`}>
        <div className="mx-auto max-w-5xl py-16">
          <Eyebrow>02, CLI</Eyebrow>
          <p className="reading-ui mt-3 text-foreground text-pretty">
            <code className="font-mono text-[13px] text-foreground">
              byronwade-lint
            </code>{" "}
            runs the same detectors outside of ESLint, useful in CI, pre-commit
            hooks, and editors that don&apos;t speak ESLint flat config yet. The{" "}
            <code className="font-mono text-[13px] text-foreground">--fix</code>{" "}
            flag auto-applies safe codemods where a unique nearest token can be
            found.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div>
              <p className="mb-2 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                check
              </p>
              <CodeBlock
                lang="bash"
                code={`npx byronwade-lint "src/**/*.{ts,tsx}"`}
              />
            </div>
            <div>
              <p className="mb-2 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                auto-fix
              </p>
              <CodeBlock
                lang="bash"
                code={`npx byronwade-lint "src/**/*.{ts,tsx}" --fix`}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================== WHAT IT CATCHES ===== */}
      <section className="py-16">
        <div className="mx-auto max-w-5xl">
          <Eyebrow>03, What it catches</Eyebrow>
          <p className="reading-ui mt-3 text-foreground text-pretty">
            Five detectors cover the most common ways consumer code drifts
            off-system. Each maps a violation to a specific token or utility so
            the fix is always clear.
          </p>

          <ul className="mt-8 space-y-0 divide-y divide-border rounded-xl edge overflow-hidden">
            {DETECTORS.map(({ label, description }) => (
              <li key={label} className="flex gap-4 px-5 py-5 bg-card">
                <ShieldCheck
                  className="mt-0.5 size-5 shrink-0 text-brand"
                  aria-hidden
                />
                <div className="min-w-0 space-y-1">
                  <p className="text-sm font-medium text-foreground">{label}</p>
                  <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
                    {description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </article>
  )
}

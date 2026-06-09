import type { Metadata } from "next"
import Link from "next/link"
import { ShieldCheck } from "lucide-react"

import { CodeBlock } from "@/app/(docs)/_components/code-block"
import { GuidePager } from "@/app/(docs)/_components/guide-pager"

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
        <div className="relative py-12 lg:py-16">
          <div className="animate-in fade-in slide-in-from-bottom-3 duration-700">
            <Eyebrow>Tooling · Lint</Eyebrow>
          </div>
          <h1 className="mt-4 text-[clamp(2.25rem,6vw,4rem)] font-normal leading-[1.05] tracking-tight text-foreground text-balance">
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
        <div>
          <Eyebrow>01, ESLint plugin</Eyebrow>
          <p className="reading-ui mt-3 text-foreground text-pretty">
            <code className="font-mono text-[13px] text-foreground">
              @byronwade/eslint-plugin-ui
            </code>{" "}
            ships a flat-config-ready recommended preset that enables all five
            detectors. Works with ESLint 9+ and the flat-config format. It pairs
            with the{" "}
            <Link
              href="/docs/ai"
              className="text-brand underline-offset-4 hover:underline"
            >
              AI rule
            </Link>{" "}
            — the rule keeps agents generating on-system code, the lint catches
            anything that still drifts.
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
        <div className="py-16">
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
        <div>
          <Eyebrow>03, What it catches</Eyebrow>
          <p className="reading-ui mt-3 text-foreground text-pretty">
            Five detectors cover the most common ways consumer code drifts
            off-system. Each maps a violation to a specific token or house
            utility from the{" "}
            <Link
              href="/docs/foundation"
              className="text-brand underline-offset-4 hover:underline"
            >
              foundation scale
            </Link>{" "}
            so the fix is always clear.
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

      {/* ========================================= BEFORE / AFTER ===== */}
      <section className={`${BLEED} border-y border-border bg-card`}>
        <div className="py-16">
          <Eyebrow>04, Before → after</Eyebrow>
          <p className="reading-ui mt-3 text-foreground text-pretty">
            A typical off-system snippet leans on hardcoded colors, arbitrary
            spacing, and a bare native element. The lint rewrites each line to
            the nearest token, foundation step, and primitive.
          </p>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div>
              <p className="mb-2 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                before · off-system
              </p>
              <CodeBlock
                lang="tsx"
                code={`<button
  className="bg-[#16a34a] text-[#ffffff] rounded-[6px] p-[14px]"
>
  Save changes
</button>`}
              />
            </div>
            <div>
              <p className="mb-2 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                after · on-system
              </p>
              <CodeBlock
                lang="tsx"
                code={`<Button className="rounded-md p-3.5">
  Save changes
</Button>`}
              />
            </div>
          </div>

          <p className="reading-ui mt-6 text-muted-foreground text-pretty">
            <code className="font-mono text-[13px] text-foreground">
              bg-[#16a34a]
            </code>{" "}
            resolves to{" "}
            <code className="font-mono text-[13px] text-foreground">
              bg-brand
            </code>{" "}
            (baked into the primitive), the hardcoded white maps to the
            primitive&apos;s{" "}
            <code className="font-mono text-[13px] text-foreground">
              text-primary-foreground
            </code>
            , and the arbitrary radius and padding snap to the{" "}
            <Link
              href="/docs/foundation"
              className="text-brand underline-offset-4 hover:underline"
            >
              radius and spacing steps
            </Link>
            .
          </p>
        </div>
      </section>

      {/* ============================================ AUTOFIX ===== */}
      <section className="py-16">
        <div>
          <Eyebrow>05, What autofix can &amp; can&apos;t do</Eyebrow>
          <p className="reading-ui mt-3 text-foreground text-pretty">
            <code className="font-mono text-[13px] text-foreground">--fix</code>{" "}
            only applies a codemod when the correct replacement is unambiguous.
            Anything that needs a human judgment call is reported but left
            untouched.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl edge bg-card p-5">
              <p className="text-sm font-medium text-foreground">
                Auto-applied
              </p>
              <ul className="mt-3 space-y-2 text-[13px] leading-relaxed text-muted-foreground">
                <li>
                  Raw colors within{" "}
                  <code className="font-mono text-foreground">
                    maxColorDistance
                  </code>{" "}
                  of exactly one token
                </li>
                <li>
                  Arbitrary spacing and radius that map cleanly to a foundation
                  step
                </li>
                <li>
                  Hand-rolled CSS that has a one-to-one house-utility equivalent
                  (<code className="font-mono text-foreground">glow-brand</code>
                  , <code className="font-mono text-foreground">bg-grid</code>)
                </li>
              </ul>
            </div>
            <div className="rounded-xl edge bg-card p-5">
              <p className="text-sm font-medium text-foreground">
                Reported only
              </p>
              <ul className="mt-3 space-y-2 text-[13px] leading-relaxed text-muted-foreground">
                <li>
                  Colors equidistant from two tokens — the intent is ambiguous
                </li>
                <li>
                  Bare{" "}
                  <code className="font-mono text-foreground">
                    &lt;button&gt;
                  </code>
                  /
                  <code className="font-mono text-foreground">
                    &lt;input&gt;
                  </code>{" "}
                  swaps that need a primitive import and prop mapping
                </li>
                <li>
                  Bold headings — the fix depends on the intended visual
                  hierarchy
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================= CI ===== */}
      <section className={`${BLEED} border-y border-border bg-card`}>
        <div className="py-16">
          <Eyebrow>06, CI &amp; editor</Eyebrow>
          <p className="reading-ui mt-3 text-foreground text-pretty">
            Run the lint as a gate in CI so off-system code never lands, and
            wire the ESLint plugin into your editor for inline feedback while
            you type. Both reuse the same{" "}
            <Link
              href="/docs/installation"
              className="text-brand underline-offset-4 hover:underline"
            >
              registry install
            </Link>{" "}
            and config you already have.
          </p>

          <div className="mt-8 space-y-6">
            <div>
              <p className="mb-2 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                .github/workflows/lint.yml
              </p>
              <CodeBlock
                lang="yaml"
                code={`name: lint
on: [push, pull_request]
jobs:
  on-system:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npx byronwade-lint "src/**/*.{ts,tsx}"`}
              />
            </div>

            <div>
              <p className="mb-2 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                .vscode/settings.json
              </p>
              <CodeBlock
                lang="json"
                code={`{
  "eslint.useFlatConfig": true,
  "eslint.validate": ["typescript", "typescriptreact"]
}`}
              />
              <p className="reading-ui mt-3 text-muted-foreground text-pretty">
                With the ESLint VS Code extension installed, off-system code is
                underlined inline and{" "}
                <code className="font-mono text-[13px] text-foreground">
                  Fix all auto-fixable problems
                </code>{" "}
                applies the same codemods as{" "}
                <code className="font-mono text-[13px] text-foreground">
                  --fix
                </code>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="pb-16">
        <GuidePager current="/docs/lint" />
      </div>
    </article>
  )
}

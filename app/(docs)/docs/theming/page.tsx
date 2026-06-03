import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { CodeBlock } from "@/app/(docs)/_components/code-block";

export const metadata: Metadata = {
  title: "Theming — byronwade/ui",
  description:
    "Re-skin the entire byronwade/ui system, light and dark, by overriding a single CSS variable.",
};

export default function ThemingPage() {
  return (
    <article className="max-w-2xl space-y-12">
      <header>
        <p className="text-sm font-medium text-brand">Get Started</p>
        <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          Theming
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground text-pretty">
          The entire system follows one variable. Override{" "}
          <code className="font-mono text-[13px]">--brand</code> (and its dark value) in your{" "}
          <code className="font-mono text-[13px]">globals.css</code> — rings, the primary chart
          line, active states, and status-success all follow.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Re-skin the brand
        </h2>
        <CodeBlock
          lang="css"
          code={`:root  { --brand: oklch(0.55 0.20 25); }   /* e.g. a red-orange */
.dark  { --brand: oklch(0.65 0.20 25); }`}
        />
        <p className="text-sm leading-relaxed text-muted-foreground">
          Pick a slightly lighter, more chromatic value for dark mode so the accent keeps the same
          perceived punch against the warm dark surface.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          What follows the accent
        </h2>
        <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">
          <li>
            <code className="font-mono text-[13px]">--ring</code> — focus rings on every
            interactive element.
          </li>
          <li>
            <code className="font-mono text-[13px]">--chart-1</code> — the primary chart series and
            sparklines.
          </li>
          <li>
            <code className="font-mono text-[13px]">--success</code> — positive status, deltas, and
            healthy gauges.
          </li>
          <li>Active nav, selected segments, and brand-tinted surfaces across the system.</li>
        </ul>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Everything else stays calm ink and gray, so a single accent change re-skins the whole
          surface without touching component code.
        </p>
      </section>

      <div className="flex flex-wrap gap-3 border-t border-border pt-8 text-sm">
        <Link
          href="/docs/ai"
          className="inline-flex items-center gap-1.5 text-brand underline-offset-4 hover:underline"
        >
          Next: Keep your AI on-system
          <ArrowRight className="size-3.5" />
        </Link>
        <Link
          href="/docs/installation"
          className="inline-flex items-center gap-1.5 text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          Back to Installation
        </Link>
      </div>
    </article>
  );
}

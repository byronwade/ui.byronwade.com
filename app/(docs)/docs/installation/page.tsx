import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, TriangleAlert } from "lucide-react";

import { CodeBlock } from "@/app/(docs)/_components/code-block";
import { REGISTRY_URL } from "@/content/guides";

export const metadata: Metadata = {
  title: "Installation — byronwade/ui",
  description:
    "Every way to install byronwade/ui — the easiest being the namespaced shadcn registry.",
};

/* ---------------------------------------------------------------------------
   Installation = a CLI flow. Distinct signature: a terminal window hero and a
   connected vertical step rail (not the shared clamp-split hero). All real
   commands stay in copyable CodeBlocks; @byronwade/* refs are real items.
--------------------------------------------------------------------------- */

const BLEED = "-mx-6 px-6 sm:-mx-8 sm:px-8 lg:-mx-10 lg:px-10";

function Dot() {
  return <span className="size-2.5 rounded-full bg-border" />;
}

const STEPS: { title: string; body: React.ReactNode; code: string; lang: string }[] = [
  {
    title: "Initialize against the foundation base",
    body: (
      <>
        The foundation owns your <code className="font-mono text-[13px]">:root</code> tokens and
        Tailwind theme. Run <code className="font-mono text-[13px]">init</code> on a fresh Next.js app
        (created with <code className="font-mono text-[13px]">--tailwind</code>).
      </>
    ),
    lang: "bash",
    code: `npx shadcn@latest init ${REGISTRY_URL}/r/foundation.json`,
  },
  {
    title: "Register the @byronwade namespace",
    body: (
      <>
        Add one line to <code className="font-mono text-[13px]">components.json</code> so the CLI
        resolves <code className="font-mono text-[13px]">@byronwade/*</code>.
      </>
    ),
    lang: "json",
    code: `{
  "registries": {
    "@byronwade": "${REGISTRY_URL}/r/{name}.json"
  }
}`,
  },
  {
    title: "Add the catalog — or just what you need",
    body: (
      <>
        Everything at once, or only the pieces you want — transitive deps come along (activity-ring
        pulls <code className="font-mono text-[13px]">status-dot</code> + utils).
      </>
    ),
    lang: "bash",
    code: `npx shadcn@latest add @byronwade/all

npx shadcn@latest add @byronwade/timeline-rail @byronwade/metric-stat
npx shadcn@latest add @byronwade/sheet @byronwade/command @byronwade/morph-dock`,
  },
];

export default function InstallationPage() {
  return (
    <article className="max-w-none">
      {/* ============================ HERO — terminal =================== */}
      <section className="grid items-center gap-10 py-12 lg:grid-cols-[5fr_7fr] lg:py-16">
        <div className="animate-in fade-in slide-in-from-bottom-3 duration-700">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">
            Foundation · Installation
          </p>
          <h1 className="mt-4 text-[clamp(2.25rem,6vw,4rem)] font-normal leading-[1.0] tracking-tight text-foreground text-balance">
            Two commands to a wired system.
          </h1>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted-foreground text-pretty">
            shadcn CLI · Next.js + Tailwind v4. The code is copied into your repo — no runtime
            dependency, fully yours.
          </p>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both overflow-hidden rounded-2xl edge bg-card font-mono text-[13px] duration-700 [animation-delay:150ms]">
          <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
            <Dot />
            <Dot />
            <Dot />
            <span className="ml-2 text-[11px] text-muted-foreground">shadcn</span>
          </div>
          <pre className="overflow-x-auto p-5 leading-relaxed scrollbar-thin">
            <code>
              <span className="text-brand">$</span>{" "}
              <span className="text-foreground">npx shadcn@latest init …/foundation.json</span>
              {"\n"}
              <span className="text-success">✓ foundation installed — :root tokens ready</span>
              {"\n\n"}
              <span className="text-brand">$</span>{" "}
              <span className="text-foreground">npx shadcn@latest add @byronwade/all</span>
              {"\n"}
              <span className="text-success">✓ added the full catalog — deps resolved</span>
            </code>
          </pre>
        </div>
      </section>

      {/* ============================ STEP RAIL ========================= */}
      <section className={`${BLEED} border-y border-border bg-card`}>
        <div className="py-14">
          <p className="mb-8 font-mono text-xs uppercase tracking-[0.2em] text-brand">
            The fast path
          </p>
          <div>
            {STEPS.map((s, i) => (
              <div key={s.title} className="grid grid-cols-[auto_1fr] gap-x-5">
                <div className="flex flex-col items-center">
                  <span className="flex size-9 items-center justify-center rounded-full edge bg-background font-mono text-sm text-brand">
                    {i + 1}
                  </span>
                  {i < STEPS.length - 1 ? <span className="w-px flex-1 bg-border" /> : null}
                </div>
                <div className="min-w-0 space-y-3 pb-10">
                  <h2 className="text-lg font-medium tracking-tight text-foreground">{s.title}</h2>
                  <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
                    {s.body}
                  </p>
                  <CodeBlock lang={s.lang} code={s.code} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ ADD + MANUAL (two-up) ============= */}
      <section className="grid gap-10 py-16 md:grid-cols-2">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">Add a component</p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground text-pretty">
            One command per component — each page has a copy button. Or point at a built URL with no
            namespace.
          </p>
          <div className="mt-5 space-y-3">
            <CodeBlock lang="bash" code={`npx shadcn@latest add @byronwade/button`} />
            <CodeBlock lang="bash" code={`npx shadcn@latest add ${REGISTRY_URL}/r/card.json`} />
          </div>
        </div>

        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">Manual setup</p>
          <div className="mt-3 flex items-start gap-3 rounded-2xl edge bg-destructive/10 p-4">
            <TriangleAlert className="mt-0.5 size-5 shrink-0 text-destructive" />
            <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
              <span className="font-medium text-foreground">Don&apos;t run init on an existing theme</span>{" "}
              — it overwrites <code className="font-mono text-[13px]">globals.css</code>. Merge the
              foundation <code className="font-mono text-[13px]">cssVars</code> by hand, keep{" "}
              <code className="font-mono text-[13px]">--ring/--chart-1/--success</code> deriving from{" "}
              <code className="font-mono text-[13px]">var(--brand)</code>, then add components.
            </p>
          </div>
          <div className="mt-5">
            <CodeBlock lang="bash" code={`npx shadcn@latest add @byronwade/badge`} />
          </div>
        </div>
      </section>

      {/* ============================ NAV ============================== */}
      <div className="flex flex-wrap gap-x-6 gap-y-3 border-t border-border pt-8 text-sm">
        <Link
          href="/docs/foundation"
          className="inline-flex items-center gap-1.5 text-brand underline-offset-4 hover:underline"
        >
          Next: Foundation
          <ArrowRight className="size-3.5" />
        </Link>
        <Link
          href="/docs/ai"
          className="inline-flex items-center gap-1.5 text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          Keep your AI on-system
        </Link>
      </div>
    </article>
  );
}

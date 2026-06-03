import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CodeBlock } from "@/app/(docs)/_components/code-block";
import { Step } from "@/app/(docs)/_components/step";
import { REGISTRY_URL } from "@/content/guides";

export const metadata: Metadata = {
  title: "Installation — byronwade/ui",
  description:
    "Every way to install byronwade/ui — the easiest being the namespaced shadcn registry.",
};

export default function InstallationPage() {
  return (
    <article className="mx-auto max-w-4xl space-y-12">
      <header className="space-y-3">
        <p className="text-sm font-medium text-brand">Get Started</p>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Installation
          </h1>
          <Badge variant="success">
            <Sparkles className="size-3" />
            Registry is easiest
          </Badge>
        </div>
        <p className="max-w-2xl text-[15px] leading-relaxed text-muted-foreground text-pretty">
          Install with the shadcn CLI into any Next.js + Tailwind v4 project. The recommended path
          wires up the foundation once, then every component is a single{" "}
          <code className="font-mono text-[13px]">add</code> away — dependencies resolve
          automatically.
        </p>
      </header>

      {/* ── Registry path ─────────────────────────────────────────────── */}
      <section className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold tracking-tight">shadcn registry</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Best for new projects. Grab the whole catalog with{" "}
            <code className="font-mono text-[13px]">@byronwade/all</code> — shadcn&apos;s generic{" "}
            <code className="font-mono text-[13px]">add --all</code> does not target custom
            namespaces.
          </p>
        </div>

        <div className="space-y-10">
          <Step n={1} title="Initialize against the foundation base">
            <p className="text-sm leading-relaxed text-muted-foreground">
              The foundation owns your <code className="font-mono text-[13px]">:root</code> tokens
              and Tailwind theme. Install it with <code className="font-mono text-[13px]">init</code>{" "}
              on a fresh Next.js app (created with{" "}
              <code className="font-mono text-[13px]">--tailwind</code>).
            </p>
            <CodeBlock lang="bash" code={`npx shadcn@latest init ${REGISTRY_URL}/r/foundation.json`} />
          </Step>

          <Step n={2} title="Register the @byronwade namespace">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Add one line to your project&apos;s{" "}
              <code className="font-mono text-[13px]">components.json</code> so the CLI knows where
              to resolve <code className="font-mono text-[13px]">@byronwade/*</code>.
            </p>
            <CodeBlock
              lang="json"
              code={`{
  "registries": {
    "@byronwade": "${REGISTRY_URL}/r/{name}.json"
  }
}`}
            />
          </Step>

          <Step n={3} title="Add what you need — or everything at once">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Want the whole catalog? One command pulls every component (dependencies resolve
              automatically):
            </p>
            <CodeBlock lang="bash" code={`npx shadcn@latest add @byronwade/all`} />
            <p className="text-sm leading-relaxed text-muted-foreground">
              Or add only the pieces you want — transitive dependencies still come along (adding a
              gauge pulls in <code className="font-mono text-[13px]">status-dot</code> and{" "}
              <code className="font-mono text-[13px]">utils</code> for you):
            </p>
            <CodeBlock
              lang="bash"
              code={`npx shadcn@latest add @byronwade/gauge
npx shadcn@latest add @byronwade/timeline-rail @byronwade/metric-stat
npx shadcn@latest add @byronwade/sheet @byronwade/command @byronwade/morph-dock`}
            />
          </Step>
        </div>
      </section>

      {/* ── Single component ──────────────────────────────────────────── */}
      <section className="space-y-4 border-t border-border pt-10">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold tracking-tight">Add a component</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Once the namespace is registered, every component page is one command away — each page
            has a copy button for the exact line.
          </p>
        </div>
        <CodeBlock lang="bash" code={`npx shadcn@latest add @byronwade/button`} />
        <p className="text-sm leading-relaxed text-muted-foreground">
          You can also point the CLI directly at a built component URL without registering the
          namespace first:
        </p>
        <CodeBlock lang="bash" code={`npx shadcn@latest add ${REGISTRY_URL}/r/card.json`} />
      </section>

      {/* ── Manual ────────────────────────────────────────────────────── */}
      <section className="space-y-4 border-t border-border pt-10">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold tracking-tight">Manual setup</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            For existing projects that already have their own theme.
          </p>
        </div>
        <Alert>
          <AlertTitle>Don&apos;t run init on an existing theme</AlertTitle>
          <AlertDescription>
            Running <code className="font-mono text-[13px]">init</code> would overwrite your
            existing <code className="font-mono text-[13px]">globals.css</code>. Merge the tokens by
            hand instead, then add components.
          </AlertDescription>
        </Alert>
        <ol className="space-y-2 text-sm leading-relaxed text-muted-foreground">
          <li>
            1. Copy the <code className="font-mono text-[13px]">cssVars</code> (light, dark, and
            theme) from the foundation item in{" "}
            <code className="font-mono text-[13px]">registry.json</code> into your{" "}
            <code className="font-mono text-[13px]">globals.css</code>.
          </li>
          <li>
            2. Make sure <code className="font-mono text-[13px]">--ring</code>,{" "}
            <code className="font-mono text-[13px]">--chart-1</code>, and{" "}
            <code className="font-mono text-[13px]">--success</code> derive from{" "}
            <code className="font-mono text-[13px]">var(--brand)</code> so re-skinning holds.
          </li>
          <li>3. Register the namespace and add components as usual.</li>
        </ol>
        <CodeBlock lang="bash" code={`npx shadcn@latest add @byronwade/badge`} />
      </section>

      <div className="flex flex-wrap gap-3 border-t border-border pt-8 text-sm">
        <Link
          href="/docs/theming"
          className="inline-flex items-center gap-1.5 text-brand underline-offset-4 hover:underline"
        >
          Next: Theming
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

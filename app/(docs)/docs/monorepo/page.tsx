import type { Metadata } from "next"
import Link from "next/link"

import { CodeBlock } from "@/app/(docs)/_components/code-block"
import {
  BLEED,
  DocsIntro,
  DocsProse,
} from "@/app/(docs)/_components/docs-prose"
import { GuidePager } from "@/app/(docs)/_components/guide-pager"

export const metadata: Metadata = {
  title: "Monorepo, byronwade/ui",
  description:
    "How the byronwade/ui monorepo is laid out — main registry site, Linear and Polaris themed apps, skin sync, and quality gates.",
}

export default function MonorepoPage() {
  return (
    <article className="max-w-none">
      <section
        className={`relative ${BLEED} overflow-hidden border-b border-border`}
      >
        <div className="relative py-12 lg:py-16">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">
            Guides · Monorepo
          </p>
          <h1 className="mt-4 max-w-3xl text-[clamp(2.25rem,6vw,4rem)] font-normal leading-[1.05] tracking-tight text-foreground text-balance">
            One repo, three surfaces
          </h1>
          <DocsIntro className="mt-6">
            The registry site, Linear product demo, and Polaris admin demo share
            one npm workspace. Skins preview in-place on the main site; full
            demos live in sibling apps.
          </DocsIntro>
        </div>
      </section>

      <DocsProse className="mt-10 space-y-6">
        <h2 className="text-xl font-medium tracking-tight">Layout</h2>
        <CodeBlock
          lang="bash"
          code={`/
├── app/                    # Main registry (ui.byronwade.com)
├── registry/               # Hand-maintained component source
├── packages/               # Lint, MCP, eval tooling
└── apps/
    ├── linear/             # Linear-themed demo (/linear)
    └── polaris/            # Polaris-themed demo (/polaris)`}
        />

        <h2 className="text-xl font-medium tracking-tight">Apps</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="font-medium text-foreground">Main</strong> —{" "}
            <code className="font-mono text-xs">npm run dev</code> — house warm
            tokens plus optional Linear/Polaris skins via the header Skin
            toggle.
          </li>
          <li>
            <strong className="font-medium text-foreground">Linear</strong> —{" "}
            <code className="font-mono text-xs">npm run dev:linear</code> —{" "}
            <Link href="/linear" className="underline-offset-2 hover:underline">
              hub
            </Link>{" "}
            explains Skin toggle vs the sibling demo.
          </li>
          <li>
            <strong className="font-medium text-foreground">Polaris</strong> —{" "}
            <code className="font-mono text-xs">npm run dev:polaris</code> —{" "}
            <Link
              href="/polaris"
              className="underline-offset-2 hover:underline"
            >
              hub
            </Link>{" "}
            for the admin demo.
          </li>
        </ul>

        <h2 className="text-xl font-medium tracking-tight">Skin sync</h2>
        <p>
          After editing themed-app component CSS, regenerate the main-site skin
          layers:
        </p>
        <CodeBlock
          lang="bash"
          code={`npm run gen:linear-skin    # → app/linear-skin.generated.css
npm run gen:polaris-skin   # → app/polaris-skin.generated.css`}
        />
        <p>
          Both generators use a brace-aware CSS walker (selectors only).{" "}
          <code className="font-mono text-xs">npm run validate</code> includes
          skin sync checks plus themed-nav href resolution.
        </p>

        <h2 className="text-xl font-medium tracking-tight">Quality gates</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <code className="font-mono text-xs">npm run build:linear</code> —
            themed-nav, slots, catalog, visual, production build
          </li>
          <li>
            <code className="font-mono text-xs">npm run build:polaris</code> —
            same for Polaris
          </li>
          <li>
            <code className="font-mono text-xs">npm run check:themed-nav</code>{" "}
            — sidebar hrefs must resolve to a{" "}
            <code className="font-mono text-xs">page.tsx</code>
          </li>
        </ul>

        <h2 className="text-xl font-medium tracking-tight">Deployment</h2>
        <p>
          Main registry deploys from the repo root. Linear and Polaris are
          separate Vercel projects with root directories{" "}
          <code className="font-mono text-xs">apps/linear</code> and{" "}
          <code className="font-mono text-xs">apps/polaris</code> (
          <code className="font-mono text-xs">basePath</code>{" "}
          <code className="font-mono text-xs">/linear</code> /{" "}
          <code className="font-mono text-xs">/polaris</code>). Locally, run
          themed apps on their own ports — do not collide with{" "}
          <code className="font-mono text-xs">npm run dev</code>.
        </p>
      </DocsProse>

      <GuidePager current="/docs/monorepo" />
    </article>
  )
}

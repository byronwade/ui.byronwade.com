import type { Metadata } from "next"
import Link from "next/link"

import { MarkdownBody } from "@/components/docs/markdown-body"
import { loadSource } from "@/lib/docs/load-source"

export const metadata: Metadata = {
  title: "Agent stack — law book · skills · gates",
  description:
    "Why design contracts lead with authored law books, verified skills, and fail-closed CI gates — with contract MCP as an optional accelerator.",
}

/**
 * Platform marketing + docs page for the three-layer agent stack.
 * Lives on the cool catalog shell — not under a contract DNA.
 */
export default async function StackPage() {
  const source = await loadSource("docs/stack.md")

  return (
    <main data-slot="stack-page" data-site="platform" className="pb-24">
      <section className="border-b border-border/70 px-4 py-14 md:px-6 md:py-20">
        <div className="mx-auto max-w-5xl">
          <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
            Platform · agent stack
          </p>
          <h1 className="mt-4 max-w-3xl text-[clamp(2rem,5vw,3.25rem)] font-medium leading-[1.05] tracking-[-0.03em] text-foreground">
            How agents actually stay inside a design system
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Law books and verified skills are required. CI gates are the
            bailiff. Contract MCP is optional. This page is the long-form pitch
            — the homepage summarizes it; every contract&apos;s install page
            makes it runnable.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/meridian/install"
              className="inline-flex h-9 items-center border border-foreground/15 bg-foreground px-4 font-mono text-[12px] text-background transition-opacity hover:opacity-90"
            >
              Install a contract
            </Link>
            <Link
              href="/#stack"
              className="inline-flex h-9 items-center border border-border px-4 font-mono text-[12px] text-muted-foreground transition-colors hover:text-foreground"
            >
              Homepage summary
            </Link>
            <Link
              href="/meridian/system/stack"
              className="inline-flex h-9 items-center border border-border px-4 font-mono text-[12px] text-muted-foreground transition-colors hover:text-foreground"
            >
              Raw stack.md under Meridian
            </Link>
          </div>
        </div>
      </section>

      <article className="px-4 py-12 md:px-6">
        <div className="reading-ui mx-auto max-w-5xl">
          <MarkdownBody source={source} />
        </div>
      </article>

      <section className="border-t border-border/70 px-4 py-12 md:px-6">
        <div className="mx-auto flex max-w-5xl flex-wrap gap-3">
          <Link
            href="/meridian/install"
            className="inline-flex h-9 items-center border border-foreground/15 bg-foreground px-4 font-mono text-[12px] text-background"
          >
            Start with install
          </Link>
          <Link
            href="/meridian/theme"
            className="inline-flex h-9 items-center border border-border px-4 font-mono text-[12px] text-muted-foreground hover:text-foreground"
          >
            Theme prefs
          </Link>
          <Link
            href="/#contracts"
            className="inline-flex h-9 items-center border border-border px-4 font-mono text-[12px] text-muted-foreground hover:text-foreground"
          >
            Browse contracts
          </Link>
        </div>
      </section>
    </main>
  )
}

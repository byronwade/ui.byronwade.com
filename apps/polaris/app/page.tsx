import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-12 max-w-4xl items-center justify-between px-6">
          <span className="text-sm font-semibold">byronwade/ui</span>
          <Badge variant="outline" className="font-mono text-[10px]">
            polaris
          </Badge>
        </div>
      </header>

      <main className="mx-auto flex flex-1 max-w-4xl flex-col justify-center px-6 py-16">
        <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          ui.byronwade.com/polaris
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
          Polaris design system
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Merchant admin UI built on the latest shadcn components, reskinned with tokens from{" "}
          <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
            design-research/SHOPIFY-DESIGN-SYSTEM.md
          </code>{" "}
          — gray canvas, white elevated cards, dark-neutral primary actions, teal success, and
          tabular data density.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button render={<Link href="/styleguide" />}>Browse components</Button>
        </div>

        <dl className="mt-16 grid gap-6 border-t border-border pt-10 sm:grid-cols-3">
          <div>
            <dt className="font-mono text-xs text-muted-foreground">Components</dt>
            <dd className="mt-1 text-lg font-semibold">60</dd>
          </div>
          <div>
            <dt className="font-mono text-xs text-muted-foreground">Source</dt>
            <dd className="mt-1 text-lg font-semibold">shadcn --all</dd>
          </div>
          <div>
            <dt className="font-mono text-xs text-muted-foreground">Theme</dt>
            <dd className="mt-1 text-lg font-semibold">Light admin</dd>
          </div>
        </dl>
      </main>
    </div>
  )
}

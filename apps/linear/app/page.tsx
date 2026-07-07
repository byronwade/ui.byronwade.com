import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex h-12 max-w-4xl items-center justify-between px-6">
          <span className="text-sm font-medium">byronwade/ui</span>
          <Badge variant="outline" className="font-mono text-[10px]">
            linear
          </Badge>
        </div>
      </header>

      <main className="mx-auto flex flex-1 max-w-4xl flex-col justify-center px-6 py-16">
        <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          ui.byronwade.com/linear
        </p>
        <h1 className="mt-3 text-3xl font-medium tracking-tight text-foreground">
          Linear design system
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
          A dark-first product OS built on the latest shadcn components, reskinned with tokens and
          patterns from our{" "}
          <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
            design-research/LINEAR-DESIGN-SYSTEM.md
          </code>{" "}
          teardown — indigo accent, Inter typography, hairline borders, dense issue-row density, and
          keyboard-native overlays.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button render={<Link href="/styleguide" />}>Browse components</Button>
          <Button variant="outline" render={<Link href="/workspace" />}>
            Workspace demo
          </Button>
        </div>

        <dl className="mt-16 grid gap-6 border-t border-border pt-10 sm:grid-cols-3">
          <div>
            <dt className="font-mono text-xs text-muted-foreground">Components</dt>
            <dd className="mt-1 text-lg font-medium">60</dd>
          </div>
          <div>
            <dt className="font-mono text-xs text-muted-foreground">Source</dt>
            <dd className="mt-1 text-lg font-medium">shadcn --all</dd>
          </div>
          <div>
            <dt className="font-mono text-xs text-muted-foreground">Theme</dt>
            <dd className="mt-1 text-lg font-medium">Dark-first</dd>
          </div>
        </dl>
      </main>
    </div>
  )
}

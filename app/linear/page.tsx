import type { Metadata } from "next"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "Linear skin — byronwade/ui",
  description:
    "Linear product-OS skin: indigo accent, near-black ladder, dense operational chrome. Preview on this site or open the full demo app.",
}

/**
 * Hub for the Linear skin. The full product demo is a sibling Next app
 * (`apps/linear`, basePath `/linear`) deployed separately — this page explains
 * the Skin toggle vs the demo app so main-site `/linear` is never a bare 404.
 */
export default function LinearSkinHubPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-14 sm:px-8">
      <Badge variant="outline" className="font-mono text-[10px]">
        data-skin=&quot;linear&quot;
      </Badge>
      <h1 className="mt-4 text-3xl font-normal tracking-tight">Linear skin</h1>
      <p className="reading-ui mt-3 text-sm text-muted-foreground sm:text-base">
        Two ways to experience Linear tokens on this monorepo:
      </p>

      <ol className="mt-8 space-y-6">
        <li className="rounded-2xl border border-border bg-card p-5">
          <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            1 · In-place preview
          </p>
          <h2 className="mt-2 text-lg font-medium">Skin toggle</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Use the header{" "}
            <strong className="font-medium text-foreground">Skin</strong>{" "}
            control and choose Linear. The main registry site restyles via{" "}
            <code className="font-mono text-xs">
              data-skin=&quot;linear&quot;
            </code>{" "}
            without leaving this origin.
          </p>
          <Button className="mt-4" render={<Link href="/catalog" />}>
            Browse with Linear skin
          </Button>
        </li>
        <li className="rounded-2xl border border-border bg-card p-5">
          <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            2 · Full product demo
          </p>
          <h2 className="mt-2 text-lg font-medium">apps/linear</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Workspace, settings, Ask Linear, and catalog live in a sibling app
            with <code className="font-mono text-xs">basePath: /linear</code>.
            Locally:{" "}
            <code className="font-mono text-xs">npm run dev:linear</code> (own
            port — do not collide with the main site). Production:{" "}
            <code className="font-mono text-xs">ui.byronwade.com/linear</code>.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="outline" render={<Link href="/docs/monorepo" />}>
              Read monorepo docs
            </Button>
            <Button
              variant="outline"
              render={
                <a
                  href="https://ui.byronwade.com/linear"
                  target="_blank"
                  rel="noreferrer"
                />
              }
            >
              Open production demo
            </Button>
          </div>
        </li>
      </ol>
    </main>
  )
}

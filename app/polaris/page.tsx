import type { Metadata } from "next"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "Polaris skin — byronwade/ui",
  description:
    "Shopify Polaris admin skin: gray canvas, white cards, dark-neutral primary, teal accent. Preview on this site or open the full demo app.",
}

/**
 * Hub for the Polaris skin. The admin demo is a sibling Next app
 * (`apps/polaris`, basePath `/polaris`) deployed separately.
 */
export default function PolarisSkinHubPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-14 sm:px-8">
      <Badge variant="outline" className="font-mono text-[10px]">
        data-skin=&quot;polaris&quot;
      </Badge>
      <h1 className="mt-4 text-3xl font-normal tracking-tight">Polaris skin</h1>
      <p className="reading-ui mt-3 text-sm text-muted-foreground sm:text-base">
        Two ways to experience Polaris tokens on this monorepo:
      </p>

      <ol className="mt-8 space-y-6">
        <li className="rounded-2xl border border-border bg-card p-5">
          <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            1 · In-place preview
          </p>
          <h2 className="mt-2 text-lg font-medium">Skin toggle</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Use the header <strong className="font-medium text-foreground">Skin</strong>{" "}
            control and choose Polaris. The main registry site restyles via{" "}
            <code className="font-mono text-xs">data-skin=&quot;polaris&quot;</code>.
          </p>
          <Button className="mt-4" render={<Link href="/catalog" />}>
            Browse with Polaris skin
          </Button>
        </li>
        <li className="rounded-2xl border border-border bg-card p-5">
          <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            2 · Admin demo
          </p>
          <h2 className="mt-2 text-lg font-medium">apps/polaris</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Products, orders, customers, settings, catalog, and styleguide live
            in a sibling app with{" "}
            <code className="font-mono text-xs">basePath: /polaris</code>.
            Locally:{" "}
            <code className="font-mono text-xs">npm run dev:polaris</code>.
            Production:{" "}
            <code className="font-mono text-xs">ui.byronwade.com/polaris</code>.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="outline" render={<Link href="/docs" />}>
              Read monorepo docs
            </Button>
            <Button
              variant="outline"
              render={
                <a
                  href="https://ui.byronwade.com/polaris"
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

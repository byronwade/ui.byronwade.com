import Link from "next/link"

import {
  CATALOG_COMPONENTS,
  COMPONENT_CATEGORIES,
} from "@/lib/component-catalog"
import { Badge } from "@/components/ui/badge"

export default function CatalogPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-12 max-w-5xl items-center justify-between gap-4 px-6">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Polaris UI
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-sm text-foreground">Catalog</span>
          </div>
          <Badge variant="outline" className="font-mono text-[10px]">
            {CATALOG_COMPONENTS.length} components
          </Badge>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-10 px-6 py-10">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            ui.byronwade.com/polaris
          </p>
          <h1 className="mt-2 text-2xl font-medium tracking-tight">
            Component catalog
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Every shadcn primitive plus Polaris admin patterns, grouped by role.
            Live specimens for the admin signature live on the{" "}
            <Link
              href="/styleguide"
              className="text-foreground underline-offset-2 hover:underline"
            >
              styleguide
            </Link>
            . Pattern entries deep-link into the admin demo (
            <Link
              href="/products"
              className="text-foreground underline-offset-2 hover:underline"
            >
              products
            </Link>
            ).
          </p>
        </div>

        {COMPONENT_CATEGORIES.map((category) => {
          const items = CATALOG_COMPONENTS.filter(
            (c) => c.category === category.id,
          )
          if (!items.length) return null
          return (
            <section key={category.id} className="space-y-3">
              <h2 className="text-sm font-semibold tracking-tight">
                {category.label}
                <span className="ml-2 font-mono text-xs font-normal text-muted-foreground">
                  {items.length}
                </span>
              </h2>
              <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => {
                  const href =
                    item.category === "polaris"
                      ? "/products"
                      : `/styleguide#${item.slug}`
                  return (
                    <li key={item.slug}>
                      <Link
                        href={href}
                        className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2 text-sm transition-colors hover:bg-muted/40"
                      >
                        <span>{item.name}</span>
                        <span className="font-mono text-[10px] text-muted-foreground">
                          {item.slug}
                        </span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </section>
          )
        })}
      </main>
    </div>
  )
}

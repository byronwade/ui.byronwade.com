"use client"

import Link from "next/link"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CATALOG_COMPONENTS } from "@/lib/component-catalog"
import { CatalogSections } from "./catalog-sections"
import { ComponentNav } from "./component-nav"

export function CatalogView() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-sm">
        <div className="mx-auto flex h-12 max-w-7xl items-center justify-between gap-4 px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href="/"
              className="shrink-0 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Linear UI
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="truncate text-sm text-foreground">Components</span>
            <Badge variant="outline" className="hidden sm:inline-flex font-mono text-[10px]">
              {CATALOG_COMPONENTS.length} components
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? "Light" : "Dark"}
            </Button>
            <Button variant="outline" size="sm" render={<Link href="/workspace" />}>
              Workspace
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-10 px-6 py-10">
        <aside className="sticky top-16 hidden h-[calc(100vh-5rem)] w-52 shrink-0 overflow-y-auto pb-10 lg:block">
          <ComponentNav />
        </aside>

        <main className="min-w-0 flex-1 space-y-16">
          <div>
            <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Full component catalog
            </p>
            <h1 className="mt-2 text-2xl font-medium tracking-tight">
              Every component, Linear reskin
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              All {CATALOG_COMPONENTS.length} primitives from{" "}
              <code className="font-mono text-xs">shadcn add --all</code>, plus Linear composites.
              Use the sidebar or jump links to inspect each one.
            </p>
            <div className="mt-4 lg:hidden">
              <ComponentNav />
            </div>
          </div>

          <CatalogSections />
        </main>
      </div>
    </div>
  )
}

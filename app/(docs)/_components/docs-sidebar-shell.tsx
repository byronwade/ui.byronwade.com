"use client"

import * as React from "react"

import { TooltipProvider } from "@/components/ui/tooltip"
import { DocsSidebar } from "@/app/(docs)/_components/docs-sidebar-nav"

/**
 * Docs layout: a calm token-styled sidebar and a content column, offset below
 * the fixed top header. The sidebar owns its own border; the content sits in a
 * comfortable reading measure with room for wide specimen bands to break out.
 */
export function DocsSidebarShell({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider delay={200}>
      <div className="flex w-full pt-14">
        <DocsSidebar />
        <main className="min-h-0 min-w-0 flex-1">
          <div className="px-6 pb-16 pt-2 sm:px-8 lg:px-10">{children}</div>
        </main>
      </div>
    </TooltipProvider>
  )
}

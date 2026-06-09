"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { TooltipProvider } from "@/components/ui/tooltip"
import { DocsSidebar } from "@/app/(docs)/_components/docs-sidebar-nav"

/** Vertical space reserved for the floating launcher + nav dock (top-3 + pill). */
const CHROME = "pt-14 sm:pt-16"

export function DocsSidebarShell({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider delay={200}>
      <div className={cn("flex min-h-dvh w-full bg-background", CHROME)}>
        <DocsSidebar />
        <main className="min-h-0 min-w-0 flex-1">
          {/* No top padding here: the chrome offset clears the floating header
              and each page's hero owns its top spacing — `pt-2` only aligns the
              content's top with the sidebar rail. */}
          <div className="px-6 pt-2 pb-12 sm:px-8 lg:px-10">{children}</div>
        </main>
      </div>
    </TooltipProvider>
  )
}

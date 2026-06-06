"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { DocsSidebarNav } from "@/app/(docs)/_components/docs-sidebar-nav"

/** Vertical space reserved for floating launcher + nav dock (top-3 + pill height). */
const CHROME = "pt-14 sm:pt-16"

export function DocsSidebarShell({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider delay={200}>
      <div className={cn("flex min-h-dvh flex-col bg-background", CHROME)}>
        <SidebarProvider
          contained
          defaultOpen
          className="flex min-h-0 w-full flex-1"
          style={
            {
              "--sidebar-width": "16rem",
            } as React.CSSProperties
          }
        >
          <Sidebar
            variant="sidebar"
            collapsible="offcanvas"
            className={cn(
              "border-border bg-background",
              "[&_[data-slot=sidebar-inner]]:rounded-none [&_[data-slot=sidebar-inner]]:bg-background [&_[data-slot=sidebar-inner]]:shadow-none",
            )}
          >
            <DocsSidebarNav />
          </Sidebar>

          <SidebarInset className="min-h-0 min-w-0 flex-1 overflow-y-auto scrollbar-thin bg-background">
            <header className="sticky top-0 z-10 flex items-center gap-2 border-b border-border bg-background/90 px-4 py-2 backdrop-blur md:hidden">
              <SidebarTrigger className="size-8" />
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Documentation
              </span>
            </header>
            <div className="px-6 py-8 sm:px-8 lg:px-10">{children}</div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </TooltipProvider>
  )
}

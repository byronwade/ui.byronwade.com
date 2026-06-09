import * as React from "react"

import { cn } from "@/lib/utils"

function DemoEmptyState({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      data-slot="demo-empty-state"
      className={cn(
        "rounded-lg border border-border/70 py-10 text-center text-sm text-muted-foreground",
        className,
      )}
    >
      {children}
    </div>
  )
}

function DemoErrorState({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      data-slot="demo-error-state"
      className={cn(
        "rounded-lg bg-destructive/5 py-10 text-center ring-1 ring-destructive/30",
        className,
      )}
    >
      <span className="mb-2 inline-flex rounded-md bg-destructive/10 px-2 py-1 text-xs font-medium text-destructive">
        Error
      </span>
      <p className="text-sm text-muted-foreground">{children}</p>
    </div>
  )
}

export { DemoEmptyState, DemoErrorState }

"use client"

import { TrendingDown, TrendingUp, Users } from "lucide-react"

import { StatCard } from "@/components/stat-card"
import { Skeleton } from "@/components/ui/skeleton"
import { useDemoState } from "@/lib/demo-viewport"
import { cn } from "@/lib/utils"

// ── per-state value helpers ──────────────────────────────────────────────────

function ValueSkeleton() {
  return <Skeleton className="mt-1 h-7 w-20 rounded-md" aria-hidden />
}

function ErrorValue() {
  return (
    <span className="font-mono font-medium text-2xl tracking-tight tabular-nums text-destructive">
      —
    </span>
  )
}

// ── example ──────────────────────────────────────────────────────────────────

export default function Example() {
  const state = useDemoState() ?? "default"

  const isLoading = state === "loading"
  const isEmpty = state === "empty"
  const isError = state === "error"
  const isSuccess = state === "success"

  // Shared hint slot — shows error/empty caption where needed
  const usersHint = isError ? (
    <span className="text-destructive">Couldn't load</span>
  ) : isEmpty ? (
    <span className="text-muted-foreground">No data yet</span>
  ) : isLoading ? (
    <Skeleton className="mt-0.5 h-3 w-24 rounded-md" aria-hidden />
  ) : (
    "vs. last 30 days"
  )

  const churnHint = isError ? (
    <span className="text-destructive">Couldn't load</span>
  ) : isEmpty ? (
    <span className="text-muted-foreground">No data yet</span>
  ) : isLoading ? (
    <Skeleton className="mt-0.5 h-3 w-24 rounded-md" aria-hidden />
  ) : (
    "monthly average"
  )

  // Values
  const usersValue = isLoading ? (
    <ValueSkeleton />
  ) : isError ? (
    <ErrorValue />
  ) : isEmpty ? (
    <span className="font-mono font-medium text-2xl tracking-tight tabular-nums text-muted-foreground">
      —
    </span>
  ) : (
    "12,480"
  )

  const churnValue = isLoading ? (
    <ValueSkeleton />
  ) : isError ? (
    <ErrorValue />
  ) : isEmpty ? (
    <span className="font-mono font-medium text-2xl tracking-tight tabular-nums text-muted-foreground">
      —
    </span>
  ) : (
    "2.1%"
  )

  // Deltas — only show when meaningful (not on loading/empty/error)
  const usersDelta =
    !isLoading && !isEmpty && !isError
      ? { value: isSuccess ? "+12.0%" : "+8.3%", direction: "up" as const }
      : undefined

  const churnDelta =
    !isLoading && !isEmpty && !isError
      ? { value: isSuccess ? "-0.8%" : "-0.4%", direction: "down" as const }
      : undefined

  return (
    <div
      aria-busy={isLoading}
      data-state={state}
      className={cn("grid grid-cols-2 gap-4 p-8", "max-w-xl")}
    >
      <StatCard
        label="Total Users"
        value={usersValue}
        delta={usersDelta}
        icon={Users}
        hint={usersHint}
        className={cn(
          isSuccess && "ring-success/30",
          isError && "ring-destructive/30",
        )}
      />
      <StatCard
        label="Churn Rate"
        value={churnValue}
        delta={churnDelta}
        icon={TrendingDown}
        hint={churnHint}
        className={cn(
          isSuccess && "ring-success/30",
          isError && "ring-destructive/30",
        )}
      />
    </div>
  )
}

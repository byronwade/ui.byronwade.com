"use client"

import { useState } from "react"
import { Rating, RatingBadge, RatingButton } from "@/components/ui/rating"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DemoEmptyState,
  DemoErrorState,
} from "@/app/(docs)/_components/demo-state-bits"
import { useDemoState } from "@/lib/demo-viewport"
import { cn } from "@/lib/utils"

const AGGREGATE_SCORE = 4.8
const AGGREGATE_COUNT = 1240

export default function Example() {
  const [value, setValue] = useState(3)
  const state = useDemoState() ?? "default"

  const isLoading = state === "loading"
  const isEmpty = state === "empty"
  const isError = state === "error"
  const isSuccess = state === "success"
  const isNormal = state === "default" || isSuccess

  return (
    <div className="flex flex-col items-center gap-6 p-8">
      {/* Interactive input — always visible regardless of aggregate state */}
      <div className="flex flex-col items-center gap-1.5">
        <Rating value={value} onValueChange={setValue}>
          {Array.from({ length: 5 }).map((_, i) => (
            <RatingButton key={i} />
          ))}
        </Rating>
        <p className="font-mono text-xs text-muted-foreground">{value} / 5</p>
      </div>

      {/* Aggregate / fetched rating block — all 5 states */}
      <div
        aria-busy={isLoading}
        data-state={state}
        className={cn(
          "flex flex-col items-center gap-2 rounded-xl bg-card px-6 py-4 ring-1 ring-border/70",
          isSuccess && "ring-success/30",
          isError && "ring-destructive/30",
        )}
      >
        <p className="text-xs font-medium text-muted-foreground">
          Community rating
        </p>

        {isLoading && (
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="size-5 rounded-full" />
              ))}
            </div>
            <Skeleton className="h-4 w-16 rounded" />
          </div>
        )}

        {isEmpty && (
          <DemoEmptyState className="w-48 px-4 py-4">
            <div className="flex justify-center gap-0.5">
              <Rating value={0} readOnly>
                {Array.from({ length: 5 }).map((_, i) => (
                  <RatingButton key={i} size={16} />
                ))}
              </Rating>
            </div>
            <p className="mt-1 text-xs">No ratings yet</p>
          </DemoEmptyState>
        )}

        {isError && (
          <DemoErrorState className="w-48 px-4">
            Couldn&apos;t load ratings
          </DemoErrorState>
        )}

        {isNormal && (
          <div className="flex flex-col items-center gap-1">
            <RatingBadge
              value={AGGREGATE_SCORE}
              count={AGGREGATE_COUNT}
              className="text-sm"
            />
            <Rating value={AGGREGATE_SCORE} readOnly allowHalf>
              {Array.from({ length: 5 }).map((_, i) => (
                <RatingButton key={i} size={16} />
              ))}
            </Rating>
            <p
              className={cn(
                "font-mono text-xs",
                isSuccess ? "text-success" : "text-muted-foreground",
              )}
            >
              {isSuccess
                ? "Score refreshed"
                : `${AGGREGATE_COUNT.toLocaleString()} reviews`}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

"use client"

import * as React from "react"

import {
  DemoEmptyState,
  DemoErrorState,
} from "@/app/(docs)/_components/demo-state-bits"
import { Skeleton } from "@/components/ui/skeleton"
import { TagInput } from "@/components/ui/tag-input"
import { useDemoState } from "@/lib/demo-viewport"

const DEFAULT_TAGS = ["Qualified", "Design partner"]

const TAG_TONES = {
  Qualified: "success",
  "Design partner": "brand",
  "Needs review": "warning",
} as const

const SKELETON_CHIP_WIDTHS = ["w-20", "w-28"]

function TagInputSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="flex min-h-8 w-full flex-wrap items-center gap-1 rounded-lg border border-input bg-input/30 p-1.5"
    >
      {SKELETON_CHIP_WIDTHS.map((w, i) => (
        <Skeleton key={i} className={`h-5 rounded-full ${w}`} />
      ))}
      <Skeleton className="h-5 w-24 rounded-sm" />
    </div>
  )
}

export default function Example() {
  const state = useDemoState() ?? "default"
  const [tags, setTags] = React.useState(DEFAULT_TAGS)

  const isLoading = state === "loading"
  const isEmpty = state === "empty"
  const isError = state === "error"

  return (
    <div className="flex w-full max-w-sm items-center justify-center p-8">
      {isLoading ? (
        <TagInputSkeleton />
      ) : isError ? (
        <DemoErrorState className="w-full">
          Couldn&apos;t load tags
        </DemoErrorState>
      ) : isEmpty ? (
        <TagInput
          value={[]}
          onChange={setTags}
          tagTones={TAG_TONES}
          placeholder="No tags yet — add one…"
        />
      ) : (
        <TagInput
          value={tags}
          onChange={setTags}
          tagTones={TAG_TONES}
          placeholder="Add a tag…"
        />
      )}
    </div>
  )
}

"use client"

import { DescriptionBox } from "@/components/description-box"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DemoEmptyState,
  DemoErrorState,
} from "@/app/(docs)/_components/demo-state-bits"
import { useDemoState } from "@/lib/demo-viewport"

export default function Example() {
  const state = useDemoState() ?? "default"
  const isLoading = state === "loading"
  const isEmpty = state === "empty"
  const isError = state === "error"

  if (isLoading) {
    return (
      <div className="w-[640px] rounded-xl bg-secondary/80 p-3">
        <div className="mb-2 flex items-center gap-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-1.5 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="mb-1.5 h-4 w-full" />
        <Skeleton className="mb-1.5 h-4 w-11/12" />
        <Skeleton className="mb-1.5 h-4 w-3/4" />
        <Skeleton className="mt-2 h-4 w-12" />
      </div>
    )
  }

  if (isEmpty) {
    return (
      <div className="w-[640px]">
        <DemoEmptyState>No description</DemoEmptyState>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="w-[640px]">
        <DemoErrorState>Couldn&apos;t load</DemoErrorState>
      </div>
    )
  }

  return (
    <div className="w-[640px]">
      <DescriptionBox views={2200000} timestamp="2 months ago">
        {`We rebuilt the entire onboarding flow from scratch this quarter, and in this video I walk through every decision, from the first wireframe to the shipped release.

You'll see how we cut the time-to-first-value in half, why we dropped the multi-step wizard, and the small interaction details that made the biggest difference.

Chapters, links, and the full design file are all below. Thanks for watching, drop a comment if you want a deeper dive on any section. #design #product #onboarding`}
      </DescriptionBox>
    </div>
  )
}

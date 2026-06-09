"use client"

import * as React from "react"
import { Copy, Pencil, Trash2 } from "lucide-react"

import { StudioVideoRow } from "@/components/studio-video-row"
import { StudioVideoTable } from "@/components/studio-video-table"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DemoEmptyState,
  DemoErrorState,
} from "@/app/(docs)/_components/demo-state-bits"
import { useDemoState } from "@/lib/demo-viewport"

function StudioVideoRowSkeleton() {
  return (
    <div className="flex items-center gap-4 border-b border-border px-3 py-2 last:border-b-0">
      {/* checkbox */}
      <Skeleton className="size-4 shrink-0 rounded-sm" />
      {/* thumbnail + title/description */}
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <Skeleton className="h-[52px] w-28 shrink-0 rounded-lg" />
        <div className="flex min-w-0 flex-col gap-1.5">
          <Skeleton className="h-3.5 w-48 rounded" />
          <Skeleton className="h-3 w-32 rounded" />
        </div>
      </div>
      {/* visibility badge */}
      <Skeleton className="hidden h-5 w-20 shrink-0 rounded-full sm:block" />
      {/* date */}
      <div className="hidden w-28 shrink-0 flex-col gap-1 md:flex">
        <Skeleton className="h-2.5 w-12 rounded" />
        <Skeleton className="h-3.5 w-20 rounded" />
      </div>
      {/* views / comments / likes */}
      <Skeleton className="h-3.5 w-16 rounded" />
      <Skeleton className="h-3.5 w-16 rounded" />
      <Skeleton className="h-3.5 w-16 rounded" />
      {/* menu icon */}
      <Skeleton className="size-7 shrink-0 rounded-md" />
    </div>
  )
}

const menuItems = [
  { key: "edit", label: "Edit", icon: <Pencil className="size-4" /> },
  { key: "duplicate", label: "Duplicate", icon: <Copy className="size-4" /> },
  { key: "delete", label: "Delete", icon: <Trash2 className="size-4" /> },
]

export default function Example() {
  const [allSelected, setAllSelected] = React.useState(false)
  const state = useDemoState() ?? "default"

  const isLoading = state === "loading"
  const isEmpty = state === "empty"
  const isError = state === "error"
  const isNormal = !isLoading && !isEmpty && !isError

  return (
    <div className="w-[860px]">
      <StudioVideoTable
        allSelected={allSelected}
        onSelectAllChange={setAllSelected}
        defaultSort={{ key: "views", direction: "desc" }}
      >
        {isLoading ? (
          <>
            <StudioVideoRowSkeleton />
            <StudioVideoRowSkeleton />
            <StudioVideoRowSkeleton />
          </>
        ) : isEmpty ? (
          <DemoEmptyState>No videos in your studio</DemoEmptyState>
        ) : isError ? (
          <DemoErrorState>Couldn&apos;t load videos</DemoErrorState>
        ) : isNormal ? (
          <>
            <StudioVideoRow
              title="Building a design system from scratch"
              description="A full walkthrough of tokens, primitives, and composites."
              thumbnailSrc="https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=600&q=80"
              duration="18:24"
              visibility="public"
              date="Apr 3, 2026"
              dateLabel="Published"
              views={128400}
              comments={842}
              likes={9600}
              selected={allSelected}
              highlighted
              menuItems={menuItems}
              onClick={() => {}}
            />
            <StudioVideoRow
              title="Token theming deep dive"
              description="How a single --brand variable re-skins the whole system."
              visibility="scheduled"
              date="May 12, 2026"
              dateLabel="Scheduled"
              views={0}
              comments={0}
              likes={0}
              selected={allSelected}
              onClick={() => {}}
            />
            <StudioVideoRow
              title="Draft: accessibility audit notes"
              visibility="draft"
              dateLabel="Draft"
              selected={allSelected}
            />
          </>
        ) : null}
      </StudioVideoTable>
    </div>
  )
}

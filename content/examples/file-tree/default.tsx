"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { Tree, type TreeViewElement } from "@/components/ui/file-tree"
import {
  DemoEmptyState,
  DemoErrorState,
} from "@/app/(docs)/_components/demo-state-bits"
import { useDemoState } from "@/lib/demo-viewport"

const ELEMENTS: TreeViewElement[] = [
  {
    id: "1",
    name: "app",
    children: [
      { id: "2", name: "layout.tsx" },
      { id: "3", name: "page.tsx" },
      {
        id: "4",
        name: "components",
        children: [
          { id: "5", name: "button.tsx" },
          { id: "6", name: "card.tsx" },
        ],
      },
    ],
  },
  { id: "7", name: "package.json" },
  { id: "8", name: "tsconfig.json" },
]

function FileTreeSkeleton() {
  return (
    <div aria-hidden="true" className="flex flex-col gap-1 p-2">
      {/* root folder row */}
      <Skeleton className="h-5 w-24 rounded" />
      {/* indented children */}
      <div className="ml-5 flex flex-col gap-1">
        <Skeleton className="h-5 w-20 rounded" />
        <Skeleton className="h-5 w-16 rounded" />
        {/* nested folder row */}
        <Skeleton className="h-5 w-24 rounded" />
        <div className="ml-5 flex flex-col gap-1">
          <Skeleton className="h-5 w-20 rounded" />
          <Skeleton className="h-5 w-16 rounded" />
        </div>
      </div>
      {/* top-level file rows */}
      <Skeleton className="h-5 w-28 rounded" />
      <Skeleton className="h-5 w-24 rounded" />
    </div>
  )
}

export default function Example() {
  const state = useDemoState() ?? "default"
  const isLoading = state === "loading"
  const isEmpty = state === "empty"
  const isError = state === "error"

  return (
    <div className="h-72 w-full max-w-xs rounded-lg edge p-2">
      {isLoading ? (
        <FileTreeSkeleton />
      ) : isEmpty ? (
        <DemoEmptyState>No files</DemoEmptyState>
      ) : isError ? (
        <DemoErrorState>Couldn&apos;t load files</DemoErrorState>
      ) : (
        <Tree
          elements={ELEMENTS}
          initialExpandedItems={["1", "4"]}
          initialSelectedId="3"
        />
      )}
    </div>
  )
}

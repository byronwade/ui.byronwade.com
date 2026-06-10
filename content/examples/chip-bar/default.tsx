"use client"

import type { ReactNode } from "react"

import { ChipBar } from "@/components/ui/chip-bar"
import { Skeleton } from "@/components/ui/skeleton"
import { useDemoState } from "@/lib/demo-viewport"
import { cn } from "@/lib/utils"

const items = [
  { value: "All", label: "All" },
  { value: "Music", label: "Music" },
  { value: "Gaming", label: "Gaming" },
  { value: "Live", label: "Live" },
  { value: "News", label: "News" },
  { value: "Podcasts", label: "Podcasts" },
  { value: "Cooking", label: "Cooking" },
  { value: "Sports", label: "Sports" },
  { value: "Comedy", label: "Comedy" },
  { value: "Recently uploaded", label: "Recently uploaded" },
]

// Varied widths so the loading row reads like real category chips. The row is
// h-8 with the same px-8 + gap-2 rhythm as the chip bar, so toggling states
// never shifts the layout.
const skeletonWidths = [
  "w-10",
  "w-16",
  "w-20",
  "w-12",
  "w-14",
  "w-24",
  "w-20",
  "w-16",
  "w-20",
  "w-32",
]

export default function Example() {
  const state = useDemoState() ?? "default"

  let inner: ReactNode
  if (state === "loading") {
    inner = (
      <div aria-busy className="flex gap-2 overflow-hidden px-8">
        {skeletonWidths.map((w, i) => (
          <Skeleton key={i} className={cn("h-8 shrink-0 rounded-full", w)} />
        ))}
      </div>
    )
  } else if (state === "empty") {
    inner = (
      <div className="flex h-8 items-center px-8 text-sm text-muted-foreground">
        No categories available
      </div>
    )
  } else if (state === "error") {
    inner = (
      <div className="flex h-8 items-center px-8 text-sm text-destructive">
        Couldn’t load categories
      </div>
    )
  } else {
    inner = <ChipBar defaultValue="All" items={items} />
  }

  return <div className="w-[560px]">{inner}</div>
}

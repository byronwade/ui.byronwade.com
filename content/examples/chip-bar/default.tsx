"use client"

import type { ReactNode } from "react"
import { AlertCircle, Inbox } from "lucide-react"

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

// Loading = a row of blank pulsing pills (content incoming). Empty/error are a
// single labelled state chip with an icon — deliberately NOT a row of pills, so
// they can't be mistaken for loading. Every state stays h-8 → zero shift.
const loadingWidths = ["w-10", "w-16", "w-20", "w-12", "w-14", "w-24", "w-20"]

export default function Example() {
  const state = useDemoState() ?? "default"

  let inner: ReactNode
  if (state === "loading") {
    inner = (
      <div aria-busy className="flex gap-2 overflow-hidden px-1">
        {loadingWidths.map((w, i) => (
          <Skeleton key={i} className={cn("h-8 shrink-0 rounded-full", w)} />
        ))}
      </div>
    )
  } else if (state === "empty") {
    inner = (
      <div role="status" className="flex h-8 items-center px-1">
        <span className="inline-flex h-8 items-center gap-1.5 rounded-full bg-secondary px-3 text-sm text-muted-foreground">
          <Inbox className="size-3.5" aria-hidden />
          No categories
        </span>
      </div>
    )
  } else if (state === "error") {
    inner = (
      <div role="alert" className="flex h-8 items-center px-1">
        <span className="inline-flex h-8 items-center gap-1.5 rounded-full bg-destructive/10 px-3 text-sm text-destructive">
          <AlertCircle className="size-3.5" aria-hidden />
          Couldn’t load categories
        </span>
      </div>
    )
  } else {
    inner = <ChipBar defaultValue="All" items={items} />
  }

  return <div className="w-[560px]">{inner}</div>
}

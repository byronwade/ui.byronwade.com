"use client"

import type { ReactNode } from "react"
import { AlertCircle } from "lucide-react"

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

// Every state is a row of chip-shaped pills (h-8, same px-8 + gap-2 rhythm as
// the bar) so toggling STATE never shifts the layout — the state reads from the
// pills' treatment, not from a text label.
const loadingWidths = ["w-10", "w-16", "w-20", "w-12", "w-14", "w-24", "w-20"]
const ghostWidths = ["w-12", "w-16", "w-20", "w-14", "w-24", "w-16"]

export default function Example() {
  const state = useDemoState() ?? "default"

  let inner: ReactNode
  if (state === "loading") {
    inner = (
      <div aria-busy className="flex gap-2 overflow-hidden px-8">
        {loadingWidths.map((w, i) => (
          <Skeleton key={i} className={cn("h-8 shrink-0 rounded-full", w)} />
        ))}
      </div>
    )
  } else if (state === "empty") {
    inner = (
      <div
        role="status"
        aria-label="No categories available"
        className="flex gap-2 overflow-hidden px-8"
      >
        {ghostWidths.map((w, i) => (
          <div
            key={i}
            aria-hidden
            className={cn(
              "h-8 shrink-0 rounded-full border border-dashed border-border/70",
              w,
            )}
          />
        ))}
      </div>
    )
  } else if (state === "error") {
    inner = (
      <div
        role="alert"
        aria-label="Couldn’t load categories"
        className="flex items-center gap-2 overflow-hidden px-8"
      >
        <div className="grid size-8 shrink-0 place-items-center rounded-full bg-destructive/10 text-destructive">
          <AlertCircle className="size-4" aria-hidden />
        </div>
        {ghostWidths.slice(1).map((w, i) => (
          <div
            key={i}
            aria-hidden
            className={cn(
              "h-8 shrink-0 rounded-full border border-dashed border-destructive/40 bg-destructive/5",
              w,
            )}
          />
        ))}
      </div>
    )
  } else {
    inner = <ChipBar defaultValue="All" items={items} />
  }

  return <div className="w-[560px]">{inner}</div>
}

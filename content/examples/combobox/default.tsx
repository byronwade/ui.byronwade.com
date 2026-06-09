"use client"

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import { Skeleton } from "@/components/ui/skeleton"
import { DemoErrorState } from "@/app/(docs)/_components/demo-state-bits"
import { useDemoState } from "@/lib/demo-viewport"

const frameworks = [
  { value: "next", label: "Next.js" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
  { value: "nuxt", label: "Nuxt" },
]

function ComboboxSkeleton() {
  return (
    <div className="w-full space-y-1.5">
      <Skeleton className="h-9 w-full rounded-lg" />
    </div>
  )
}

export default function Example() {
  const state = useDemoState() ?? "default"

  // loading: disabled trigger with a skeleton placeholder
  if (state === "loading") {
    return <ComboboxSkeleton />
  }

  // error: show an error state in place of the combobox
  if (state === "error") {
    return (
      <DemoErrorState className="py-6">
        Couldn&apos;t load options
      </DemoErrorState>
    )
  }

  // success: fall through to the same combobox; a selected affordance would
  // be natural here but the component already renders a check mark on the
  // selected item via ComboboxItem indicator — no extra work needed.

  // empty: pass an empty items array so the native ComboboxEmpty slot fires;
  // the "No results" message comes through ComboboxEmpty below.
  const items = state === "empty" ? [] : frameworks

  return (
    <Combobox items={items}>
      <ComboboxInput placeholder="Select framework…" />
      <ComboboxContent>
        <ComboboxEmpty>No results.</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item.value} value={item}>
              {item.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

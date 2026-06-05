"use client"

import { ChipBar } from "@/components/ui/chip-bar"

export default function Example() {
  return (
    <div className="w-[560px]">
      <ChipBar
        defaultValue="All"
        items={[
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
        ]}
      />
    </div>
  )
}

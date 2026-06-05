"use client"

import { useState } from "react"
import { SegmentedControl } from "@/components/ui/segmented-control"
import { cn } from "@/lib/utils"

const options = [
  { label: "List", value: "list" },
  { label: "Grid", value: "grid" },
  { label: "Board", value: "board" },
]

export default function Example() {
  const [sm, setSm] = useState("list")
  const [md, setMd] = useState("grid")
  const [lg, setLg] = useState("board")

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Small */}
      <div className="flex flex-col items-center gap-1.5">
        <span className="text-xs text-muted-foreground">Small</span>
        <SegmentedControl
          options={options}
          value={sm}
          onValueChange={setSm}
          className="p-0.5"
        />
      </div>

      {/* Default (medium) */}
      <div className="flex flex-col items-center gap-1.5">
        <span className="text-xs text-muted-foreground">Default</span>
        <SegmentedControl options={options} value={md} onValueChange={setMd} />
      </div>

      {/* Large */}
      <div className="flex flex-col items-center gap-1.5">
        <span className="text-xs text-muted-foreground">Large</span>
        <SegmentedControl
          options={options.map((o) => ({ ...o, label: o.label }))}
          value={lg}
          onValueChange={setLg}
          className="p-1 [&_button]:px-5 [&_button]:py-1.5 [&_button]:text-base"
        />
      </div>
    </div>
  )
}

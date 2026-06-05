"use client"

import { useState } from "react"
import { SegmentedControl } from "@/components/ui/segmented-control"

export default function Example() {
  const [mode, setMode] = useState<"light" | "dark">("light")

  return (
    <SegmentedControl
      options={[
        { label: "Light", value: "light" },
        { label: "Dark", value: "dark" },
      ]}
      value={mode}
      onValueChange={setMode}
    />
  )
}

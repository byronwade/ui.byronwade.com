"use client"

import { TextAlignCenter, TextAlignLeft, TextAlignRight } from "@/lib/icons"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export default function Example() {
  return (
    <ToggleGroup disabled defaultValue={["left"]} variant="outline">
      <ToggleGroupItem value="left" aria-label="Align left">
        <TextAlignLeft />
      </ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Align center">
        <TextAlignCenter />
      </ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Align right">
        <TextAlignRight />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}

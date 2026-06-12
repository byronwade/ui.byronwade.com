"use client"

import { TextB, TextItalic, TextUnderline } from "@/lib/icons"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export default function Example() {
  return (
    <ToggleGroup multiple defaultValue={["bold"]} variant="outline">
      <ToggleGroupItem value="bold" aria-label="Bold">
        <TextB />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Italic">
        <TextItalic />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Underline">
        <TextUnderline />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}

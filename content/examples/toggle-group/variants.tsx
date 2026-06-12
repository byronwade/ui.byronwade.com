"use client"

import { TextAlignCenter, TextAlignLeft, TextAlignRight } from "@/lib/icons"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export default function Example() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-medium text-muted-foreground">Default</p>
        <ToggleGroup defaultValue={["left"]} variant="default">
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
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-xs font-medium text-muted-foreground">Outline</p>
        <ToggleGroup defaultValue={["left"]} variant="outline">
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
      </div>
    </div>
  )
}

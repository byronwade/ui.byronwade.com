"use client"

import { AlignCenterIcon, AlignLeftIcon, AlignRightIcon } from "lucide-react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const sizes = ["sm", "default", "lg"] as const

export default function Example() {
  return (
    <div className="flex flex-col gap-6 p-6">
      {sizes.map((size) => (
        <div key={size} className="flex flex-col gap-2">
          <p className="text-xs font-medium text-muted-foreground">{size}</p>
          <ToggleGroup size={size} defaultValue={["center"]} variant="outline">
            <ToggleGroupItem value="left" aria-label="Align left">
              <AlignLeftIcon />
            </ToggleGroupItem>
            <ToggleGroupItem value="center" aria-label="Align center">
              <AlignCenterIcon />
            </ToggleGroupItem>
            <ToggleGroupItem value="right" aria-label="Align right">
              <AlignRightIcon />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      ))}
    </div>
  )
}

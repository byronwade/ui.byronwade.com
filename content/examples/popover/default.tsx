"use client"

import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"

export default function Example() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <Popover>
        <PopoverTrigger className="inline-flex items-center gap-1.5 rounded-full edge bg-background px-3 py-1.5 text-sm font-medium edge hover:bg-muted transition-colors">
          Open Popover
        </PopoverTrigger>
        <PopoverContent side="bottom" align="center">
          <PopoverHeader>
            <PopoverTitle>What is this?</PopoverTitle>
            <PopoverDescription>
              A popover floats above the page and anchors to its trigger.
            </PopoverDescription>
          </PopoverHeader>
          <p className="text-sm text-muted-foreground">
            Use it to surface contextual info, quick settings, or supplementary
            actions without navigating away.
          </p>
        </PopoverContent>
      </Popover>
    </div>
  )
}

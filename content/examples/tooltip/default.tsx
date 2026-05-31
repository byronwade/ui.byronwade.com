"use client"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function Example() {
  return (
    <TooltipProvider>
      <div className="flex items-center justify-center p-16">
        <Tooltip>
          <TooltipTrigger className="rounded-md border px-4 py-2 text-sm">
            Hover me
          </TooltipTrigger>
          <TooltipContent>
            This is a helpful tooltip
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}

"use client"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"

export default function Example() {
  return (
    <TooltipProvider>
      <div className="flex flex-wrap items-center justify-center gap-6 p-16">
        {(["start", "center", "end"] as const).map((align) => (
          <Tooltip key={align}>
            <TooltipTrigger render={<Button variant="outline" />}>
              Align {align}
            </TooltipTrigger>
            <TooltipContent side="bottom" align={align}>
              Aligned to the {align}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  )
}

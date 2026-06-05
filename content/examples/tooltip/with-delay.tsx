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
    <div className="flex flex-wrap items-center justify-center gap-6 p-16">
      {/* Instant (delay=0) */}
      <TooltipProvider delay={0}>
        <Tooltip>
          <TooltipTrigger render={<Button variant="outline" />}>
            Instant
          </TooltipTrigger>
          <TooltipContent>Appears immediately (delay: 0ms)</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Default delay */}
      <TooltipProvider delay={400}>
        <Tooltip>
          <TooltipTrigger render={<Button variant="outline" />}>
            Short delay
          </TooltipTrigger>
          <TooltipContent>
            Appears after a short pause (delay: 400ms)
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Long delay */}
      <TooltipProvider delay={1000}>
        <Tooltip>
          <TooltipTrigger render={<Button variant="outline" />}>
            Long delay
          </TooltipTrigger>
          <TooltipContent>
            Appears after a longer pause (delay: 1000ms)
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}

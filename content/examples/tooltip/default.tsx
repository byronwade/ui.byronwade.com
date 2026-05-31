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
      <div className="flex items-center justify-center p-16">
        <Tooltip>
          <TooltipTrigger render={<Button variant="outline" />}>
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

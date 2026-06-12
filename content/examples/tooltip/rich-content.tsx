"use client"

import { Cursor, Keyboard } from "@/lib/icons"

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
        {/* Multi-line tooltip */}
        <Tooltip>
          <TooltipTrigger render={<Button variant="outline" />}>
            Multi-line
          </TooltipTrigger>
          <TooltipContent className="max-w-[200px] text-center">
            This tooltip contains a longer description that wraps across
            multiple lines for extra context.
          </TooltipContent>
        </Tooltip>

        {/* Tooltip with keyboard shortcut hint */}
        <Tooltip>
          <TooltipTrigger render={<Button variant="outline" />}>
            <Keyboard className="mr-1.5 size-4" />
            Save document
          </TooltipTrigger>
          <TooltipContent className="flex items-center gap-2">
            <span>Save</span>
            <span className="flex items-center gap-0.5 text-[10px] opacity-70">
              <span className="rounded bg-background/20 px-1 py-0.5 font-mono">
                ⌘
              </span>
              <span className="rounded bg-background/20 px-1 py-0.5 font-mono">
                S
              </span>
            </span>
          </TooltipContent>
        </Tooltip>

        {/* Tooltip with icon inside content */}
        <Tooltip>
          <TooltipTrigger render={<Button variant="outline" />}>
            <Cursor className="mr-1.5 size-4" />
            Interactive
          </TooltipTrigger>
          <TooltipContent className="flex items-center gap-1.5">
            <Cursor className="size-3.5 shrink-0" />
            Click to open the context menu
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}

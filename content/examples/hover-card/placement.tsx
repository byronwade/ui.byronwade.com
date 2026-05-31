"use client"

import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card"

type Side = "top" | "bottom" | "left" | "right"

const sides: Side[] = ["top", "bottom", "left", "right"]

export default function Example() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 p-16">
      {sides.map((side) => (
        <HoverCard key={side}>
          <HoverCardTrigger className="inline-flex items-center rounded-full border border-border bg-background px-4 py-1.5 text-sm font-medium capitalize transition-colors hover:bg-muted cursor-pointer">
            {side}
          </HoverCardTrigger>
          <HoverCardContent side={side} align="center">
            <div className="space-y-1">
              <p className="text-xs font-semibold capitalize">Side: {side}</p>
              <p className="text-xs text-muted-foreground">
                The card appears on the <strong>{side}</strong> of the trigger.
              </p>
            </div>
          </HoverCardContent>
        </HoverCard>
      ))}
    </div>
  )
}

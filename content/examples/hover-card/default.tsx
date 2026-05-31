"use client"

import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card"

export default function Example() {
  return (
    <div className="flex items-center justify-center p-16">
      <HoverCard>
        <HoverCardTrigger className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted">
          Hover me
        </HoverCardTrigger>
        <HoverCardContent>
          <div className="space-y-1">
            <p className="text-sm font-semibold">Jane Doe</p>
            <p className="text-xs text-muted-foreground">
              Software engineer. Joined March 2023.
            </p>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  )
}

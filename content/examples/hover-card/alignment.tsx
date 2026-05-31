"use client"

import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card"

type Align = "start" | "center" | "end"

const aligns: Align[] = ["start", "center", "end"]

export default function Example() {
  return (
    <div className="flex flex-col gap-10 p-12">
      {/* Align variations on bottom */}
      <div>
        <p className="mb-4 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Align (side=bottom)
        </p>
        <div className="flex flex-wrap gap-3">
          {aligns.map((align) => (
            <HoverCard key={align}>
              <HoverCardTrigger className="inline-flex items-center rounded-full border border-border bg-background px-4 py-1.5 text-sm font-medium capitalize transition-colors hover:bg-muted cursor-pointer">
                align=&ldquo;{align}&rdquo;
              </HoverCardTrigger>
              <HoverCardContent side="bottom" align={align}>
                <div className="space-y-1">
                  <p className="text-xs font-semibold capitalize">Align: {align}</p>
                  <p className="text-xs text-muted-foreground">
                    Popup aligns to the <strong>{align}</strong> edge of the trigger.
                  </p>
                </div>
              </HoverCardContent>
            </HoverCard>
          ))}
        </div>
      </div>

      {/* Align offset */}
      <div>
        <p className="mb-4 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Align offset (side=bottom, align=start)
        </p>
        <div className="flex flex-wrap gap-3">
          {[0, 8, 16, 24].map((offset) => (
            <HoverCard key={offset}>
              <HoverCardTrigger className="inline-flex items-center rounded-full border border-border bg-background px-4 py-1.5 text-sm font-medium transition-colors hover:bg-muted cursor-pointer">
                alignOffset={offset}
              </HoverCardTrigger>
              <HoverCardContent side="bottom" align="start" alignOffset={offset}>
                <div className="space-y-1">
                  <p className="text-xs font-semibold">alignOffset={offset}</p>
                  <p className="text-xs text-muted-foreground">
                    Popup is shifted <strong>{offset}px</strong> from the start edge.
                  </p>
                </div>
              </HoverCardContent>
            </HoverCard>
          ))}
        </div>
      </div>
    </div>
  )
}

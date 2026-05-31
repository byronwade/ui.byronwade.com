"use client";

import { useState } from "react"
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card"

export default function Example() {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex flex-col items-center gap-6 p-16">
      {/* Controlled hover card */}
      <HoverCard
        open={open}
        onOpenChange={(isOpen) => setOpen(isOpen)}
      >
        <HoverCardTrigger className="rounded-md border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted cursor-pointer">
          Hover or control me
        </HoverCardTrigger>
        <HoverCardContent>
          <div className="space-y-1">
            <p className="text-xs font-semibold">Controlled state</p>
            <p className="text-xs text-muted-foreground">
              This card is driven by React state. Current value:{" "}
              <span className="font-medium text-foreground">{open ? "open" : "closed"}</span>
            </p>
          </div>
        </HoverCardContent>
      </HoverCard>

      {/* External toggle buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setOpen(true)}
          className="rounded-full border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
        >
          Open
        </button>
        <button
          onClick={() => setOpen(false)}
          className="rounded-full border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
        >
          Close
        </button>
        <span className="text-xs text-muted-foreground">
          State:{" "}
          <span
            className={`font-medium ${open ? "text-green-600 dark:text-green-400" : "text-foreground"}`}
          >
            {open ? "open" : "closed"}
          </span>
        </span>
      </div>
    </div>
  )
}

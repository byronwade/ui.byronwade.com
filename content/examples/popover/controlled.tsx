"use client"

import { useState } from "react"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"

export default function Example() {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex flex-col items-center gap-6 p-8">
      <p className="text-sm text-muted-foreground">
        State:{" "}
        <span
          className={`font-mono font-medium ${open ? "text-success" : "text-foreground"}`}
        >
          {open ? "open" : "closed"}
        </span>
      </p>

      {/* External controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setOpen(true)}
          disabled={open}
          className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1.5 text-sm font-medium shadow-sm hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Open externally
        </button>
        <button
          onClick={() => setOpen(false)}
          disabled={!open}
          className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1.5 text-sm font-medium shadow-sm hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Close externally
        </button>
      </div>

      {/* The popover itself */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1.5 text-sm font-medium shadow-sm hover:bg-muted transition-colors">
          Toggle via trigger
        </PopoverTrigger>
        <PopoverContent side="bottom" align="center">
          <PopoverHeader>
            <PopoverTitle>Controlled popover</PopoverTitle>
            <PopoverDescription>
              Both the trigger and external buttons drive the same{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
                open
              </code>{" "}
              state.
            </PopoverDescription>
          </PopoverHeader>
          <button
            onClick={() => setOpen(false)}
            className="mt-1 inline-flex items-center rounded-full border border-border bg-background px-3 py-1 text-sm font-medium hover:bg-muted transition-colors"
          >
            Close from inside
          </button>
        </PopoverContent>
      </Popover>
    </div>
  )
}

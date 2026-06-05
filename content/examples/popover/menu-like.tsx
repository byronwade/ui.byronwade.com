"use client"

import { useState } from "react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type Action = {
  label: string
  icon: string
  description: string
  destructive?: boolean
}

const ACTIONS: Action[] = [
  { label: "Duplicate", icon: "⧉", description: "Create an identical copy" },
  { label: "Rename", icon: "✎", description: "Change the display name" },
  { label: "Export", icon: "↑", description: "Download as a file" },
  { label: "Share", icon: "⤴", description: "Invite others to collaborate" },
  {
    label: "Delete",
    icon: "⊗",
    description: "Permanently remove",
    destructive: true,
  },
]

export default function Example() {
  const [open, setOpen] = useState(false)
  const [lastAction, setLastAction] = useState<string | null>(null)

  function handleAction(label: string) {
    setLastAction(label)
    setOpen(false)
  }

  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-sm font-medium shadow-sm hover:bg-muted transition-colors">
          <span>Actions</span>
          <span className="text-muted-foreground text-xs">▾</span>
        </PopoverTrigger>

        <PopoverContent side="bottom" align="center" className="w-60 p-1.5">
          <ul role="menu" className="flex flex-col">
            {ACTIONS.map((action, i) => (
              <li key={action.label} role="none">
                {i === ACTIONS.length - 2 && (
                  <div className="my-1 h-px bg-border" />
                )}
                <button
                  role="menuitem"
                  onClick={() => handleAction(action.label)}
                  className={`flex w-full items-start gap-2.5 rounded-md px-2.5 py-1.5 text-left transition-colors hover:bg-muted ${
                    action.destructive
                      ? "text-destructive hover:bg-destructive/10"
                      : "text-foreground"
                  }`}
                >
                  <span className="mt-px shrink-0 text-base leading-none">
                    {action.icon}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium leading-tight">
                      {action.label}
                    </span>
                    <span className="text-xs text-muted-foreground leading-snug">
                      {action.description}
                    </span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </PopoverContent>
      </Popover>

      {lastAction && (
        <p className="text-sm text-muted-foreground">
          Last action:{" "}
          <span className="font-medium text-foreground">{lastAction}</span>
        </p>
      )}
    </div>
  )
}

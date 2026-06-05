"use client"

import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card"

const delays = [
  {
    label: "Instant",
    delay: 0,
    closeDelay: 0,
    description: "No delay — opens immediately on hover.",
  },
  {
    label: "Short (300ms)",
    delay: 300,
    closeDelay: 200,
    description: "Opens after 300ms — feels snappy.",
  },
  {
    label: "Default (600ms)",
    delay: 600,
    closeDelay: 300,
    description: "Default 600ms delay — comfortable for reading.",
  },
  {
    label: "Long (1000ms)",
    delay: 1000,
    closeDelay: 500,
    description: "Longer delay — prevents accidental triggers.",
  },
]

export default function Example() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 p-16">
      {delays.map(({ label, delay, closeDelay, description }) => (
        <HoverCard key={label}>
          <HoverCardTrigger
            delay={delay}
            closeDelay={closeDelay}
            className="inline-flex items-center rounded-full border border-border bg-background px-4 py-1.5 text-sm font-medium transition-colors hover:bg-muted cursor-pointer"
          >
            {label}
          </HoverCardTrigger>
          <HoverCardContent>
            <div className="space-y-1">
              <p className="text-xs font-semibold">{label}</p>
              <p className="text-xs text-muted-foreground">{description}</p>
              <p className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">open:</span>{" "}
                {delay}ms &middot;{" "}
                <span className="font-medium text-foreground">close:</span>{" "}
                {closeDelay}ms
              </p>
            </div>
          </HoverCardContent>
        </HoverCard>
      ))}
    </div>
  )
}

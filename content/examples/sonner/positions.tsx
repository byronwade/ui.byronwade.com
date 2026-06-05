"use client"

import { useState } from "react"
import { Toaster } from "@/components/ui/sonner"
import { toast, type ToasterProps } from "sonner"

const positions: ToasterProps["position"][] = [
  "top-left",
  "top-center",
  "top-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
]

export default function Example() {
  const [position, setPosition] =
    useState<ToasterProps["position"]>("bottom-right")

  return (
    <div className="flex flex-col items-start gap-4 p-8">
      <Toaster position={position} key={position} />

      <p className="text-sm text-muted-foreground">
        Selected position: <strong>{position}</strong>
      </p>

      <div className="grid grid-cols-3 gap-2">
        {positions.map((pos) => (
          <button
            key={pos}
            className={`rounded px-3 py-2 text-sm border transition-colors ${
              position === pos
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-foreground border-border hover:bg-muted"
            }`}
            onClick={() => {
              setPosition(pos)
              toast.info(`Toast at ${pos}.`)
            }}
          >
            {pos}
          </button>
        ))}
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress"

export default function Example() {
  const [value, setValue] = useState<number | null>(0)

  const isIndeterminate = value === null
  const isComplete = value === 100

  const step = (delta: number) => {
    setValue((prev) => {
      if (prev === null) return 0
      return Math.min(100, Math.max(0, prev + delta))
    })
  }

  return (
    <div className="w-full max-w-sm space-y-6 p-6">
      <Progress value={value}>
        <ProgressLabel>
          {isIndeterminate
            ? "Loading…"
            : isComplete
              ? "Complete"
              : "Processing"}
        </ProgressLabel>
        <ProgressValue>
          {(formatted) => (isIndeterminate ? "-" : formatted)}
        </ProgressValue>
      </Progress>

      <div className="flex flex-wrap gap-2">
        <button
          className="rounded-full border px-3 py-1 text-sm hover:bg-muted transition-colors"
          onClick={() => setValue(0)}
        >
          Reset
        </button>
        <button
          className="rounded-full border px-3 py-1 text-sm hover:bg-muted transition-colors"
          onClick={() => step(-10)}
          disabled={isIndeterminate || value === 0}
        >
          −10
        </button>
        <button
          className="rounded-full border px-3 py-1 text-sm hover:bg-muted transition-colors"
          onClick={() => step(10)}
          disabled={isComplete}
        >
          +10
        </button>
        <button
          className="rounded-full border px-3 py-1 text-sm hover:bg-muted transition-colors"
          onClick={() => setValue(100)}
        >
          Complete
        </button>
        <button
          className="rounded-full border px-3 py-1 text-sm hover:bg-muted transition-colors"
          onClick={() => setValue(null)}
        >
          Indeterminate
        </button>
      </div>

      <p className="text-xs text-muted-foreground">
        Current value:{" "}
        <code className="font-mono">{value === null ? "null" : value}</code>
      </p>
    </div>
  )
}

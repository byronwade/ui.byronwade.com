"use client"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"

const LIMIT = 280

export default function Example() {
  const [value, setValue] = useState("")
  const remaining = LIMIT - value.length
  const isNearLimit = remaining <= 20 && remaining >= 0
  const isOver = remaining < 0

  return (
    <div className="flex flex-col gap-3 p-6 max-w-md">
      <div className="flex items-center justify-between">
        <label htmlFor="post" className="text-sm font-medium">
          Write a post
        </label>
        <span
          className={`text-xs tabular-nums font-medium ${
            isOver
              ? "text-destructive"
              : isNearLimit
                ? "text-warning"
                : "text-muted-foreground"
          }`}
        >
          {remaining}
        </span>
      </div>

      <Textarea
        id="post"
        placeholder="What's on your mind?"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        aria-invalid={isOver}
        rows={4}
      />

      <div className="flex justify-end">
        <button
          className="text-sm px-4 py-1.5 rounded-full bg-foreground text-background font-medium disabled:opacity-40"
          disabled={value.trim().length === 0 || isOver}
        >
          Post
        </button>
      </div>
    </div>
  )
}

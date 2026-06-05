"use client"

import { useRef, useState } from "react"
import { Textarea } from "@/components/ui/textarea"

export default function Example() {
  const [value, setValue] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // field-sizing-content (already in the component's className) handles
  // auto-grow natively in modern browsers; this demo makes it visible.
  return (
    <div className="flex flex-col gap-4 p-6 max-w-md">
      <div className="flex flex-col gap-2">
        <label htmlFor="auto" className="text-sm font-medium">
          Auto-resizing textarea
        </label>
        <p className="text-xs text-muted-foreground">
          Grows as you type — no scrollbar until the row limit is reached.
        </p>
        <Textarea
          id="auto"
          ref={textareaRef}
          placeholder="Start typing… the field will expand automatically."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          // min-h-16 comes from the component; override max for demo
          className="max-h-64"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="fixed-rows" className="text-sm font-medium">
          Fixed height (rows=6)
        </label>
        <p className="text-xs text-muted-foreground">
          Explicit row count disables auto-grow; scroll appears when content
          overflows.
        </p>
        <Textarea
          id="fixed-rows"
          placeholder="This field stays at 6 rows regardless of content."
          rows={6}
          className="field-sizing-fixed"
        />
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"

const SNIPPET = `// Generated configuration
export const config = {
  endpoint: "https://api.example.com/v1",
  timeout: 5000,
  retries: 3,
  headers: {
    "Content-Type": "application/json",
  },
};`

export default function Example() {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(SNIPPET)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col gap-2 p-6 max-w-md">
      <div className="flex items-center justify-between">
        <label htmlFor="snippet" className="text-sm font-medium">
          Generated output
        </label>
        <button
          onClick={handleCopy}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <Textarea
        id="snippet"
        value={SNIPPET}
        readOnly
        rows={10}
        className="font-mono text-xs field-sizing-fixed"
      />
      <p className="text-xs text-muted-foreground">
        Read-only, select and copy the text above.
      </p>
    </div>
  )
}

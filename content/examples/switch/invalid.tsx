"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"

export default function Example() {
  const [agreed, setAgreed] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const isInvalid = submitted && !agreed

  return (
    <div className="flex flex-col gap-4 p-6 max-w-sm mx-auto">
      <div className="rounded-lg border p-4 space-y-3">
        <p className="text-sm font-medium">Terms of Service</p>
        <p className="text-xs text-muted-foreground">
          You must accept the terms before continuing.
        </p>
        <div className="flex items-center gap-3">
          <Switch
            checked={agreed}
            onCheckedChange={(v) => {
              setAgreed(v)
              if (v) setSubmitted(false)
            }}
            aria-invalid={isInvalid}
            aria-label="Accept terms of service"
          />
          <span className="text-sm">I accept the terms</span>
        </div>
        {isInvalid && (
          <p className="text-xs text-destructive">
            You must accept the terms to continue.
          </p>
        )}
      </div>
      <button
        className="rounded-full bg-primary text-primary-foreground text-sm px-4 py-2 hover:bg-primary/90 transition-colors"
        onClick={() => setSubmitted(true)}
      >
        Submit
      </button>
    </div>
  )
}

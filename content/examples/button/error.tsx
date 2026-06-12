"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowsClockwise, WarningCircle } from "@/lib/icons"

export default function Example() {
  const [hasError, setHasError] = useState(true)

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* aria-invalid triggers destructive ring styling */}
      <div className="flex flex-wrap items-center gap-3">
        <Button aria-invalid="true">
          <WarningCircle />
          Invalid action
        </Button>
        <Button variant="outline" aria-invalid="true">
          <WarningCircle />
          Invalid outline
        </Button>
        <Button variant="secondary" aria-invalid="true">
          <WarningCircle />
          Invalid secondary
        </Button>
      </div>

      {/* Practical: a retry button that enters error state */}
      <div className="flex flex-wrap items-center gap-4">
        <Button
          variant="outline"
          aria-invalid={hasError || undefined}
          onClick={() => setHasError((v) => !v)}
        >
          <ArrowsClockwise />
          {hasError ? "Retry (error state)" : "Retry"}
        </Button>
        <span className="text-muted-foreground text-sm">
          {hasError
            ? "Click to clear the error."
            : "No error, click to restore."}
        </span>
      </div>

      <p className="text-muted-foreground text-sm">
        Set{" "}
        <code className="text-xs bg-muted px-1 py-0.5 rounded">
          aria-invalid
        </code>{" "}
        to surface a destructive border + ring. This is distinct from the{" "}
        <em>destructive</em> variant, use it to signal a validation or
        submission error on a button in a form.
      </p>
    </div>
  )
}

"use client"

import {
  Alert,
  AlertTitle,
  AlertDescription,
  AlertAction,
} from "@/components/ui/alert"
import { Info, Warning, XCircle } from "@/lib/icons"
import { useState } from "react"

export default function Example() {
  const [dismissed, setDismissed] = useState<string[]>([])

  const isDismissed = (id: string) => dismissed.includes(id)
  const dismiss = (id: string) => setDismissed((prev) => [...prev, id])

  return (
    <div className="flex flex-col gap-4 p-6 max-w-lg">
      {!isDismissed("info") && (
        <Alert>
          <Info />
          <AlertTitle>Read-only mode</AlertTitle>
          <AlertDescription>
            You are viewing a shared snapshot. Changes won&apos;t be saved.
          </AlertDescription>
          <AlertAction>
            <button
              onClick={() => dismiss("info")}
              className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-3"
            >
              Dismiss
            </button>
          </AlertAction>
        </Alert>
      )}

      {!isDismissed("warning") && (
        <Alert variant="warning">
          <Warning />
          <AlertTitle>Unsaved changes</AlertTitle>
          <AlertDescription>
            You have uncommitted edits. Save before leaving this page.
          </AlertDescription>
          <AlertAction>
            <button
              onClick={() => dismiss("warning")}
              className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-3"
            >
              Save
            </button>
          </AlertAction>
        </Alert>
      )}

      {!isDismissed("error") && (
        <Alert variant="destructive">
          <XCircle />
          <AlertTitle>Export failed</AlertTitle>
          <AlertDescription>
            The file could not be generated. Try again or contact support.
          </AlertDescription>
          <AlertAction>
            <button
              onClick={() => dismiss("error")}
              className="text-xs underline underline-offset-3"
            >
              Retry
            </button>
          </AlertAction>
        </Alert>
      )}

      {dismissed.length === 3 && (
        <p className="text-sm text-muted-foreground text-center">
          All alerts dismissed.{" "}
          <button
            onClick={() => setDismissed([])}
            className="underline hover:text-foreground"
          >
            Reset
          </button>
        </p>
      )}
    </div>
  )
}

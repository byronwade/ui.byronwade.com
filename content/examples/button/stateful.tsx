"use client"

import { Button } from "@/components/ui/button"

/**
 * Stateful (auto-async) buttons. Pass `onClickAsync` and the button drives
 * itself: idle → loading → success | error → idle. Optional *Text props swap
 * the label per state; `loading` forces the loading state for manual control.
 */
export default function Example() {
  const succeed = () =>
    new Promise<void>((resolve) => setTimeout(resolve, 1200))
  const fail = () =>
    new Promise<void>((_, reject) =>
      setTimeout(() => reject(new Error("nope")), 1200),
    )

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button
          onClickAsync={succeed}
          loadingText="Saving…"
          successText="Saved"
        >
          Save changes
        </Button>

        <Button
          variant="outline"
          onClickAsync={fail}
          loadingText="Submitting…"
          errorText="Failed, retry"
        >
          Submit
        </Button>

        <Button variant="secondary" loading>
          Always loading
        </Button>
      </div>

      <p className="text-muted-foreground text-sm">
        Click a button to run a 1.2s async action. It shows a spinner while
        pending, then a check (success) or alert (error), and resets after{" "}
        <code className="bg-muted rounded px-1 py-0.5 text-xs">resetDelay</code>
        .
      </p>
    </div>
  )
}

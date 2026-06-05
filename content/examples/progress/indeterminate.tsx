"use client"

import {
  Progress,
  ProgressIndicator,
  ProgressLabel,
  ProgressTrack,
  ProgressValue,
} from "@/components/ui/progress"

export default function Example() {
  return (
    <div className="w-full max-w-sm space-y-6 p-6">
      {/* value={null} triggers the indeterminate state */}
      <Progress value={null}>
        <ProgressLabel>Loading resources…</ProgressLabel>
        <ProgressValue>{(formatted) => formatted ?? "Loading"}</ProgressValue>
        <ProgressTrack className="h-1.5">
          <ProgressIndicator className="animate-[indeterminate_1.4s_ease_infinite] bg-primary [--progress-indicator-transform:translateX(-100%)] data-[indeterminate]:w-1/2" />
        </ProgressTrack>
      </Progress>

      <Progress value={null}>
        <ProgressLabel>Syncing data</ProgressLabel>
        <ProgressTrack className="h-1.5">
          <ProgressIndicator className="animate-[indeterminate_1.4s_ease_infinite] bg-primary [--progress-indicator-transform:translateX(-100%)] data-[indeterminate]:w-1/2" />
        </ProgressTrack>
      </Progress>

      <p className="text-xs text-muted-foreground">
        <code className="font-mono">value=&#123;null&#125;</code> puts the bar
        in indeterminate state — useful when task duration is unknown.
      </p>
    </div>
  )
}

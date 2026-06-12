"use client"

import { useState } from "react"
import { ArrowCounterClockwise } from "@/lib/icons"

import {
  Checkpoint,
  CheckpointIcon,
  CheckpointTrigger,
} from "@/components/ai-elements/checkpoint"

export default function Example() {
  const [restoredAt, setRestoredAt] = useState<string | null>(null)

  return (
    <div className="flex min-h-0 flex-col items-center justify-center gap-6 bg-background p-8">
      <div className="flex w-full max-w-md flex-col gap-3">
        <p className="text-sm text-muted-foreground">
          Agent saved a checkpoint before editing 4 files.
        </p>

        <Checkpoint>
          <CheckpointIcon />
          <CheckpointTrigger
            tooltip="Restore conversation to this checkpoint"
            onClick={() => setRestoredAt(new Date().toLocaleTimeString())}
          >
            <ArrowCounterClockwise className="size-3.5" />
            <span className="font-mono text-xs">Checkpoint #3</span>
          </CheckpointTrigger>
        </Checkpoint>

        <p className="text-xs text-muted-foreground">
          {restoredAt ? (
            <>
              Restored at <span className="font-mono">{restoredAt}</span>
            </>
          ) : (
            "Click the checkpoint to restore."
          )}
        </p>
      </div>
    </div>
  )
}

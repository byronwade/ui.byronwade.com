"use client"

import * as React from "react"

import { DropZone } from "@/components/ui/drop-zone"

export default function Example() {
  const [rejected, setRejected] = React.useState<string[]>([])

  return (
    <div className="flex max-w-md flex-col gap-3">
      <DropZone
        accept=".png,.jpg"
        maxSize={1024 * 1024}
        multiple
        label="PNG or JPG up to 1 MB"
        onReject={(files) => setRejected(files.map((f) => f.name))}
      />
      {rejected.length > 0 ? (
        <p className="font-mono text-xs text-destructive">
          Rejected: {rejected.join(", ")}
        </p>
      ) : null}
    </div>
  )
}

"use client"

import { useState } from "react"
import { SegmentedControl } from "@/components/ui/segmented-control"
import { CodeBlock } from "@/app/(docs)/_components/code-block"

export function ExampleTabs({
  title,
  preview,
  code,
}: {
  title?: string
  preview: React.ReactNode
  code: string
}) {
  const [view, setView] = useState<"preview" | "code">("preview")
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        {title ? <span className="text-sm font-medium">{title}</span> : null}
        <SegmentedControl
          options={[
            { label: "Preview", value: "preview" as const },
            { label: "Code", value: "code" as const },
          ]}
          value={view}
          onValueChange={setView}
        />
      </div>
      {view === "preview" ? (
        // flex + justify-center centers fixed-size demos (single button, etc.)
        // while full-width demos (w-full / full-bleed) still fill, no collapse.
        <div className="flex min-h-56 w-full items-stretch justify-center rounded-xl edge p-8">
          {preview}
        </div>
      ) : (
        <CodeBlock code={code} />
      )}
    </div>
  )
}

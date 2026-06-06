"use client"

import { useState } from "react"

import type { ComponentDoc, Variant } from "@/content/components"
import type { DemoSurface } from "@/content/demo-contexts"
import { SegmentedControl } from "@/components/ui/segmented-control"
import { CodeBlock } from "@/app/(docs)/_components/code-block"
import { DocsDemoPreview } from "@/app/(docs)/_components/docs-demo-preview"

type DemoProps = {
  slug: string
  defaultSurface: DemoSurface
  demoContext?: ComponentDoc["demoContext"]
  activeVariant: Variant
  allVariants: Variant[]
  codeByExample: Record<string, string>
  docExamples: string[]
}

export function ExampleTabs({
  title,
  preview,
  code,
  demo,
}: {
  title?: string
  preview: React.ReactNode
  code: string
  demo?: DemoProps
}) {
  if (demo) {
    return <DocsDemoPreview title={title} code={code} {...demo} />
  }

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

"use client"

import * as React from "react"
import { useState } from "react"
import { useSearchParams } from "next/navigation"

import { examples } from "@/content/examples/registry"
import type { ComponentDoc, Variant } from "@/content/components"
import {
  resolveDemoExample,
  type DemoContext,
  type DemoSurface,
} from "@/content/demo-contexts"
import {
  DemoPreviewFrame,
  readInitialDemoContext,
} from "@/app/(docs)/_components/demo-preview-frame"
import { SegmentedControl } from "@/components/ui/segmented-control"
import { CodeBlock } from "@/app/(docs)/_components/code-block"

function findExampleComponent(slug: string, exampleBase: string) {
  const slugExamples = examples[slug] ?? []
  const demo = slugExamples.find((d) => {
    const base = d.file
      .split("/")
      .pop()!
      .replace(/\.tsx$/, "")
    return base === exampleBase
  })
  return demo?.Component ?? null
}

type Props = {
  title?: string
  slug: string
  defaultSurface: DemoSurface
  demoContext?: ComponentDoc["demoContext"]
  activeVariant: Variant
  allVariants: Variant[]
  docExamples: string[]
  codeByExample: Record<string, string>
  code?: string
}

export function DocsDemoPreview({
  title,
  slug,
  defaultSurface,
  demoContext,
  activeVariant,
  allVariants,
  docExamples,
  codeByExample,
  code: fallbackCode,
}: Props) {
  const [view, setView] = useState<"preview" | "code">("preview")
  const searchParams = useSearchParams()

  const doc = React.useMemo(
    () =>
      ({
        slug,
        examples: docExamples,
        name: "",
        category: "UI",
        description: "",
      }) as ComponentDoc,
    [slug, docExamples],
  )

  const ctx = React.useMemo(
    () => readInitialDemoContext(searchParams, defaultSurface),
    [searchParams, defaultSurface],
  )

  const resolvedCode = React.useMemo(() => {
    const { example } = resolveDemoExample(doc, activeVariant, ctx, allVariants)
    return codeByExample[example] ?? fallbackCode ?? ""
  }, [doc, activeVariant, ctx, allVariants, codeByExample, fallbackCode])

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
        <DemoPreviewFrame
          defaultSurface={defaultSurface}
          skipSurfaceWrapper={demoContext?.skipSurfaceWrapper}
          hidden={demoContext?.hidden}
        >
          {(frameCtx: DemoContext) => {
            const { example } = resolveDemoExample(
              doc,
              activeVariant,
              frameCtx,
              allVariants,
            )
            const Component = findExampleComponent(slug, example)
            return Component ? <Component /> : null
          }}
        </DemoPreviewFrame>
      ) : (
        <CodeBlock code={resolvedCode} />
      )}
    </div>
  )
}

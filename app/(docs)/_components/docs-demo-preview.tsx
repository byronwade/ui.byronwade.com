"use client"

import * as React from "react"

import { examples } from "@/content/examples/registry"
import type { ComponentDoc, Variant } from "@/content/components"
import {
  resolveDemoExample,
  type DemoContext,
  type DemoSurface,
} from "@/content/demo-contexts"
import {
  DemoPreviewFrame,
  type DemoToolbarDisabledControls,
} from "@/app/(docs)/_components/demo-preview-frame"
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

export function getDisabledDemoControlsForSource(
  source: string,
): DemoToolbarDisabledControls {
  return {
    frame: !source.includes("useDemoFrame"),
    depth: !source.includes("useDemoDepth"),
    state: !source.includes("useDemoState"),
  }
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

  return (
    <div className="space-y-3">
      {title ? <span className="text-sm font-medium">{title}</span> : null}
      <DemoPreviewFrame
        defaultSurface={defaultSurface}
        skipSurfaceWrapper={demoContext?.skipSurfaceWrapper}
        hidden={demoContext?.hidden}
        disabledControls={(frameCtx) => {
          const { example } = resolveDemoExample(
            doc,
            activeVariant,
            frameCtx,
            allVariants,
          )
          return getDisabledDemoControlsForSource(
            codeByExample[example] ?? fallbackCode ?? "",
          )
        }}
        code={(frameCtx) => {
          const { example } = resolveDemoExample(
            doc,
            activeVariant,
            frameCtx,
            allVariants,
          )
          return (
            <CodeBlock code={codeByExample[example] ?? fallbackCode ?? ""} />
          )
        }}
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
    </div>
  )
}

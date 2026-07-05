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

/** Example bases that express a density/frame axis via a dedicated example file. */
const DENSITY_EXAMPLE_BASES = new Set([
  "compact",
  "comfortable",
  "inset",
  "compact-inset",
  "comfortable-inset",
])

function normalizeExampleBase(example: string): string {
  return (
    example
      .split("/")
      .pop()
      ?.replace(/\.tsx$/, "") ?? example
  )
}

/**
 * Viewer toolbar disabled-state for a component page. Frame + depth are
 * universal viewer-level treatments (elevated stage / inset well), so they are
 * always available. Density is available when the example reads the density
 * hook or the component ships a density/frame example file. State is available
 * only when the active example reads the state hook.
 */
function getDisabledDemoControls(
  source: string,
  exampleBases: string[],
): DemoToolbarDisabledControls {
  const densitySupported =
    source.includes("useDemoDensity") ||
    exampleBases.some((base) => DENSITY_EXAMPLE_BASES.has(base))
  return {
    density: !densitySupported,
    frame: false,
    depth: false,
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
          return getDisabledDemoControls(
            codeByExample[example] ?? fallbackCode ?? "",
            docExamples.map(normalizeExampleBase),
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

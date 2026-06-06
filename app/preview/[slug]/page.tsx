import type { CSSProperties } from "react"
import { notFound } from "next/navigation"

import { archetypes, getArchetype } from "@/app/layouts/_archetypes"
import { archetypeComponents } from "@/app/layouts/_archetypes/components"
import { templates, getTemplate } from "@/app/templates/_templates"
import { templateComponents } from "@/app/templates/_templates/components"

// The preview route renders both layout archetypes and starter templates
// full-bleed inside an iframe (one shared re-skin pipeline for both galleries).
const previewComponents: Record<string, React.ComponentType> = {
  ...archetypeComponents,
  ...templateComponents,
}

const getPreviewMeta = (slug: string) => getArchetype(slug) ?? getTemplate(slug)

// Only the known archetype/template slugs are valid; anything else 404s.
export const dynamicParams = false

export function generateStaticParams() {
  return [...archetypes, ...templates].map((x) => ({ slug: x.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const meta = getPreviewMeta(slug)
  return { title: meta ? `${meta.name}, preview` : "Preview" }
}

/** Restrict re-skin overrides to a safe color/length subset (defence in depth;
 *  inline style values cannot inject CSS rules, but we still keep them tidy). */
function safeCss(value: string | undefined): string | undefined {
  if (!value) return undefined
  const trimmed = value.trim().slice(0, 64)
  return /^[#a-z0-9().,%\s/-]+$/i.test(trimmed) ? trimmed : undefined
}

export default async function PreviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ brand?: string; radius?: string }>
}) {
  const { slug } = await params
  const meta = getPreviewMeta(slug)
  if (!meta) notFound()

  const Component = previewComponents[meta.slug]
  const { brand, radius } = await searchParams

  // Overriding --brand cascades to --ring/--success/--chart-1 etc., re-skinning
  // the whole archetype; --radius reshapes every rounded surface.
  const style: Record<string, string> = {}
  const safeBrand = safeCss(brand)
  const safeRadius = safeCss(radius)
  if (safeBrand) style["--brand"] = safeBrand
  if (safeRadius) style["--radius"] = safeRadius

  return (
    <div
      style={style as CSSProperties}
      className="min-h-dvh bg-background text-foreground"
    >
      <Component />
    </div>
  )
}

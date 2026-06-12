"use client"

import * as React from "react"
import { use } from "react"
import Link from "next/link"
import { ArrowUpRight } from "@/lib/icons"

import { cn } from "@/lib/utils"
import { getArchetype } from "@/app/layouts/_archetypes"
import { SegmentedControl } from "@/components/ui/segmented-control"
import { buttonVariants } from "@/components/ui/button-variants"
import { ReskinBar, type Reskin } from "@/app/layouts/_components/reskin-bar"

type ViewportKey = "desktop" | "tablet" | "mobile"

const widths: Record<ViewportKey, number | null> = {
  desktop: null,
  tablet: 834,
  mobile: 390,
}

export default function FramePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const meta = getArchetype(slug)

  const [viewport, setViewport] = React.useState<ViewportKey>("desktop")
  const [reskin, setReskin] = React.useState<Reskin>({})

  if (!meta) {
    return (
      <div className="grid h-full place-items-center p-10 text-center">
        <div>
          <p className="text-lg font-medium tracking-tight">Unknown layout</p>
          <p className="mt-1 text-sm text-muted-foreground">
            “{slug}” is not a known archetype.
          </p>
          <Link
            href="/layouts"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "mt-4",
            )}
          >
            Back to gallery
          </Link>
        </div>
      </div>
    )
  }

  const query = new URLSearchParams()
  if (reskin.brand) query.set("brand", reskin.brand)
  if (reskin.radius) query.set("radius", reskin.radius)
  const qs = query.toString()
  const src = `/preview/${meta.slug}${qs ? `?${qs}` : ""}`
  const width = widths[viewport]

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-6">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium tracking-tight">
            {meta.name}
          </p>
          <p className="hidden truncate text-xs text-muted-foreground sm:block">
            {meta.tagline}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <ReskinBar value={reskin} onChange={setReskin} />
          <SegmentedControl
            value={viewport}
            onValueChange={setViewport}
            options={[
              { label: "Desktop", value: "desktop" },
              { label: "Tablet", value: "tablet" },
              { label: "Mobile", value: "mobile" },
            ]}
          />
          <Link
            href={src}
            target="_blank"
            rel="noreferrer"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            Open full
            <ArrowUpRight data-icon="inline-end" />
          </Link>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto bg-muted/30 p-4 sm:p-6">
        <div
          className="mx-auto h-full overflow-hidden rounded-xl bg-background edge transition-[max-width] duration-300"
          style={{ maxWidth: width ? `${width}px` : "100%" }}
        >
          <iframe
            key={src}
            src={src}
            title={`${meta.name} preview`}
            className="h-full w-full border-0"
          />
        </div>
      </div>
    </div>
  )
}

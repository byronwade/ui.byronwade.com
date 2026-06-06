"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { SegmentedControl } from "@/components/ui/segmented-control"
import { catalogSurfaces } from "@/content/catalog-surfaces"
import {
  demoViewportWidths,
  parseDemoViewport,
  type DemoContext,
  type DemoSurface,
  type DemoViewport,
} from "@/content/demo-contexts"
import { DemoViewportProvider } from "@/lib/demo-viewport"
import { cn } from "@/lib/utils"

const SURFACE_STORAGE_KEY = "demo-surface"
const VIEWPORT_STORAGE_KEY = "demo-viewport"

const SURFACE_OPTIONS = catalogSurfaces.map((s) => ({
  label: s.shortLabel,
  value: s.id,
}))

const VIEWPORT_OPTIONS: { label: string; value: DemoViewport }[] = [
  { label: "Desktop", value: "desktop" },
  { label: "Tablet", value: "tablet" },
  { label: "Mobile", value: "mobile" },
]

function readStorage(key: string): string | null {
  if (typeof window === "undefined") return null
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function writeStorage(key: string, value: string) {
  try {
    localStorage.setItem(key, value)
  } catch {
    // ignore quota / private mode
  }
}

function parseStoredSurface(
  value: string | null,
  defaultSurface: DemoSurface,
): DemoSurface {
  if (value === "marketing") return "marketing"
  if (value === "app") return "app"
  return defaultSurface
}

export function readInitialDemoContext(
  searchParams: Pick<URLSearchParams, "get">,
  defaultSurface: DemoSurface,
): DemoContext {
  const surfaceParam = searchParams.get("surface")
  const viewportParam = searchParams.get("viewport")

  const surface =
    surfaceParam === "app" || surfaceParam === "marketing"
      ? surfaceParam
      : parseStoredSurface(readStorage(SURFACE_STORAGE_KEY), defaultSurface)

  const viewport =
    viewportParam === "desktop" ||
    viewportParam === "tablet" ||
    viewportParam === "mobile"
      ? viewportParam
      : parseDemoViewport(readStorage(VIEWPORT_STORAGE_KEY))

  return { surface, viewport }
}

type DemoPreviewFrameProps = {
  defaultSurface: DemoSurface
  skipSurfaceWrapper?: boolean
  hidden?: boolean
  children: (ctx: DemoContext) => React.ReactNode
}

function DemoPreviewContent({
  surface,
  viewport,
  skipSurfaceWrapper,
  children,
}: {
  surface: DemoSurface
  viewport: DemoViewport
  skipSurfaceWrapper?: boolean
  children: (ctx: DemoContext) => React.ReactNode
}) {
  const width = demoViewportWidths[viewport]
  const ctx = { surface, viewport }

  const viewportBox = (
    <div
      className="mx-auto w-full transition-[max-width] duration-300"
      style={{ maxWidth: width != null ? `${width}px` : undefined }}
    >
      <DemoViewportProvider viewport={viewport}>
        {children(ctx)}
      </DemoViewportProvider>
    </div>
  )

  if (skipSurfaceWrapper) return viewportBox

  return (
    <div
      data-demo-surface={surface}
      className={cn(
        "w-full rounded-lg border border-border/60 p-6",
        surface === "app"
          ? "bg-background"
          : "reading-ui reading-measure mx-auto bg-card",
      )}
    >
      {viewportBox}
    </div>
  )
}

export function DemoPreviewFrame({
  defaultSurface,
  skipSurfaceWrapper,
  hidden,
  children,
}: DemoPreviewFrameProps) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const [ctx, setCtx] = React.useState<DemoContext>(() =>
    readInitialDemoContext(searchParams, defaultSurface),
  )

  const updateContext = React.useCallback(
    (patch: Partial<DemoContext>) => {
      setCtx((prev) => {
        const next = { ...prev, ...patch }
        writeStorage(SURFACE_STORAGE_KEY, next.surface)
        writeStorage(VIEWPORT_STORAGE_KEY, next.viewport)

        const params = new URLSearchParams(searchParams.toString())
        params.set("surface", next.surface)
        params.set("viewport", next.viewport)
        const qs = params.toString()
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })

        return next
      })
    },
    [pathname, router, searchParams],
  )

  if (hidden) {
    const defaultCtx: DemoContext = {
      surface: defaultSurface,
      viewport: "desktop",
    }
    return (
      <DemoViewportProvider viewport="desktop">
        {children(defaultCtx)}
      </DemoViewportProvider>
    )
  }

  return (
    <div className="flex flex-col space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <SegmentedControl
          options={SURFACE_OPTIONS}
          value={ctx.surface}
          onValueChange={(surface) => updateContext({ surface })}
        />
        <SegmentedControl
          options={VIEWPORT_OPTIONS}
          value={ctx.viewport}
          onValueChange={(viewport) => updateContext({ viewport })}
        />
      </div>
      <div className="flex min-h-56 w-full items-stretch justify-center rounded-xl edge p-8">
        <DemoPreviewContent
          surface={ctx.surface}
          viewport={ctx.viewport}
          skipSurfaceWrapper={skipSurfaceWrapper}
        >
          {children}
        </DemoPreviewContent>
      </div>
    </div>
  )
}

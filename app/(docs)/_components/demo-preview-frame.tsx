"use client"

import * as React from "react"
import {
  Code2,
  CheckCircle,
  CircleOff,
  Cloud,
  Eye,
  Inbox,
  Layers,
  LoaderCircle,
  Monitor,
  PanelTop,
  Smartphone,
  Square,
  Tablet,
  XCircle,
  type LucideIcon,
} from "lucide-react"
import { useSearchParams } from "next/navigation"

import {
  demoViewportWidths,
  type DemoContext,
  type DemoDensity,
  type DemoDepth,
  type DemoFrame,
  type DemoState,
  type DemoSurface,
  type DemoViewport,
} from "@/content/demo-contexts"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { DemoViewportProvider } from "@/lib/demo-viewport"
import { cn } from "@/lib/utils"

type DemoView = "preview" | "code"
export type DemoToolbarDisabledControls = {
  frame?: boolean
  depth?: boolean
  state?: boolean
}

const VIEW_OPTIONS: {
  label: string
  value: DemoView
  icon: LucideIcon
  tooltip: string
}[] = [
  { label: "Preview", value: "preview", icon: Eye, tooltip: "Show preview" },
  { label: "Code", value: "code", icon: Code2, tooltip: "Show code" },
]

const VIEWPORT_OPTIONS: {
  label: string
  value: DemoViewport
  icon: LucideIcon
  tooltip: string
}[] = [
  {
    label: "Desktop",
    value: "desktop",
    icon: Monitor,
    tooltip: "Desktop viewport",
  },
  {
    label: "Tablet",
    value: "tablet",
    icon: Tablet,
    tooltip: "Tablet viewport",
  },
  {
    label: "Mobile",
    value: "mobile",
    icon: Smartphone,
    tooltip: "Mobile viewport",
  },
]

const DENSITY_OPTIONS: {
  label: string
  value: DemoDensity
  tooltip: string
}[] = [
  { label: "Compact", value: "compact", tooltip: "Compact density" },
  { label: "Default", value: "default", tooltip: "Default density" },
  { label: "Comfort", value: "comfortable", tooltip: "Comfortable density" },
]

const FRAME_OPTIONS: {
  label: string
  value: DemoFrame
  icon: LucideIcon
  tooltip: string
}[] = [
  { label: "Flat", value: "default", icon: Square, tooltip: "Flat frame" },
  { label: "Inset", value: "inset", icon: PanelTop, tooltip: "Inset frame" },
]

const DEPTH_OPTIONS: {
  label: string
  value: DemoDepth
  icon: LucideIcon
  tooltip: string
}[] = [
  { label: "No edge", value: "none", icon: CircleOff, tooltip: "Flat plane" },
  { label: "Soft edge", value: "soft", icon: Cloud, tooltip: "Soft edge" },
  {
    label: "Raised edge",
    value: "raised",
    icon: Layers,
    tooltip: "Raised edge",
  },
]

const STATE_OPTIONS: {
  label: string
  value: DemoState
  icon: LucideIcon
  tooltip: string
}[] = [
  {
    label: "Default state",
    value: "default",
    icon: CircleOff,
    tooltip: "Default state",
  },
  {
    label: "Loading",
    value: "loading",
    icon: LoaderCircle,
    tooltip: "Loading state",
  },
  {
    label: "Empty",
    value: "empty",
    icon: Inbox,
    tooltip: "Empty state",
  },
  {
    label: "Success",
    value: "success",
    icon: CheckCircle,
    tooltip: "Success state",
  },
  {
    label: "Error",
    value: "error",
    icon: XCircle,
    tooltip: "Error state",
  },
]

const GROUP_TOOLTIPS: Record<string, string> = {
  View: "Switch between preview and code.",
  Device: "Preview the example at different viewport widths.",
  Density: "Adjust the example density.",
  Frame: "Toggle the example frame treatment.",
  Depth: "Toggle the example depth treatment.",
  State: "Toggle the example state treatment.",
}

export function readInitialDemoContext(
  searchParams: Pick<URLSearchParams, "get">,
  defaultSurface: DemoSurface,
): DemoContext {
  const viewportParam = searchParams.get("viewport")
  const densityParam = searchParams.get("density")
  const frameParam = searchParams.get("frame")
  const depthParam = searchParams.get("depth")
  const stateParam = searchParams.get("state")

  const viewport =
    viewportParam === "desktop" ||
    viewportParam === "tablet" ||
    viewportParam === "mobile"
      ? viewportParam
      : "desktop"

  const density =
    densityParam === "compact" ||
    densityParam === "default" ||
    densityParam === "comfortable"
      ? densityParam
      : "default"

  const frame =
    frameParam === "default" || frameParam === "inset" ? frameParam : "default"

  const depth =
    depthParam === "soft" || depthParam === "raised" ? depthParam : "none"

  const state =
    stateParam === "loading" ||
    stateParam === "empty" ||
    stateParam === "success" ||
    stateParam === "error"
      ? stateParam
      : "default"

  return { surface: defaultSurface, viewport, density, frame, depth, state }
}

type DemoPreviewFrameProps = {
  defaultSurface: DemoSurface
  skipSurfaceWrapper?: boolean
  hidden?: boolean
  children: (ctx: DemoContext) => React.ReactNode
  code?: (ctx: DemoContext) => React.ReactNode
  disabledControls?: (ctx: DemoContext) => DemoToolbarDisabledControls
}

function DemoPreviewContent({
  surface,
  viewport,
  density,
  frame,
  depth,
  state,
  skipSurfaceWrapper,
  children,
}: {
  surface: DemoSurface
  viewport: DemoViewport
  density: DemoDensity
  frame: DemoFrame
  depth: DemoDepth
  state: DemoState
  skipSurfaceWrapper?: boolean
  children: (ctx: DemoContext) => React.ReactNode
}) {
  const width = demoViewportWidths[viewport]
  const ctx: DemoContext = { surface, viewport, density, frame, depth, state }

  return (
    <div
      className={cn(
        "mx-auto flex w-full justify-center transition-[max-width] duration-300",
        !skipSurfaceWrapper &&
          surface === "marketing" &&
          "reading-ui reading-measure",
      )}
      style={{ maxWidth: width != null ? `${width}px` : undefined }}
    >
      <DemoViewportProvider
        surface={surface}
        viewport={viewport}
        density={ctx.density}
        frame={ctx.frame}
        depth={ctx.depth}
        state={ctx.state}
      >
        {children(ctx)}
      </DemoViewportProvider>
    </div>
  )
}

function ToolbarGroup({
  label,
  displayLabel = label,
  disabled = false,
  children,
}: {
  label: string
  displayLabel?: string
  disabled?: boolean
  children: React.ReactNode
}) {
  return (
    <div
      data-slot="demo-preview-toolbar-group"
      data-disabled={disabled}
      role="group"
      aria-label={label}
      className="flex min-w-0 shrink-0 flex-col items-start gap-0.5 border-l border-border/70 pl-3 first:border-l-0 first:pl-0 max-sm:min-w-16"
    >
      <Tooltip>
        <TooltipTrigger
          render={
            <span
              data-slot="demo-preview-toolbar-group-label"
              className="shrink-0 text-[10px] font-medium uppercase tracking-wide text-muted-foreground/80"
            />
          }
        >
          {displayLabel}
        </TooltipTrigger>
        <TooltipContent side="top">
          {GROUP_TOOLTIPS[label] ?? label}
        </TooltipContent>
      </Tooltip>
      <span
        data-slot="demo-preview-toolbar-group-controls"
        className="flex items-center gap-1"
      >
        {children}
      </span>
    </div>
  )
}

function DensityGlyph({ density }: { density: DemoDensity }) {
  const rows =
    density === "compact"
      ? ["w-4", "w-4", "w-4", "w-4"]
      : density === "comfortable"
        ? ["w-4", "w-3"]
        : ["w-4", "w-3.5", "w-4"]

  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex size-4 flex-col justify-center",
        density === "compact"
          ? "gap-px"
          : density === "comfortable"
            ? "gap-1.5"
            : "gap-1",
      )}
    >
      {rows.map((width, index) => (
        <span
          key={`${density}-${index}`}
          className={cn("h-px rounded-full bg-current", width)}
        />
      ))}
    </span>
  )
}

function DemoToolbarIconButton<TValue extends string>({
  label,
  tooltip,
  value,
  currentValue,
  onSelect,
  disabled = false,
  children,
}: {
  label: string
  tooltip: string
  value: TValue
  currentValue: TValue
  onSelect: (value: TValue) => void
  disabled?: boolean
  children: React.ReactNode
}) {
  const active = value === currentValue

  return (
    <Tooltip>
      <TooltipTrigger render={<span className="inline-flex" />}>
        <button
          type="button"
          aria-label={label}
          aria-pressed={active}
          title={label}
          data-active={active}
          disabled={disabled}
          onClick={() => onSelect(value)}
          className={cn(
            "inline-flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors",
            "hover:bg-muted hover:text-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            "data-[active=true]:bg-brand/10 data-[active=true]:text-brand data-[active=true]:ring-1 data-[active=true]:ring-brand/30 data-[active=true]:ring-inset",
            "disabled:opacity-35",
          )}
        >
          {children}
        </button>
      </TooltipTrigger>
      <TooltipContent side="top">{tooltip}</TooltipContent>
    </Tooltip>
  )
}

export function DemoPreviewFrame({
  defaultSurface,
  skipSurfaceWrapper,
  hidden,
  code,
  disabledControls,
  children,
}: DemoPreviewFrameProps) {
  const searchParams = useSearchParams()
  const searchParamString = searchParams.toString()

  const [view, setView] = React.useState<DemoView>("preview")
  const [ctx, setCtx] = React.useState<DemoContext>(() =>
    readInitialDemoContext(searchParams, defaultSurface),
  )

  React.useEffect(() => {
    const next = readInitialDemoContext(
      new URLSearchParams(searchParamString),
      defaultSurface,
    )
    setCtx((current) =>
      current.surface === next.surface &&
      current.viewport === next.viewport &&
      current.density === next.density &&
      current.frame === next.frame &&
      current.depth === next.depth &&
      current.state === next.state
        ? current
        : next,
    )
  }, [defaultSurface, searchParamString])

  const updateContext = React.useCallback(
    (patch: Partial<DemoContext>) => {
      const next = { ...ctx, ...patch }
      setCtx(next)
    },
    [ctx],
  )
  const disabled = disabledControls?.(ctx) ?? {}

  if (hidden) {
    const defaultCtx: DemoContext = {
      surface: defaultSurface,
      viewport: "desktop",
      density: "default",
      frame: "default",
      depth: "none",
      state: "default",
    }
    return (
      <DemoViewportProvider
        surface={defaultSurface}
        viewport="desktop"
        density="default"
        frame="default"
        depth="none"
        state="default"
      >
        {children(defaultCtx)}
      </DemoViewportProvider>
    )
  }

  return (
    <TooltipProvider delay={0}>
      <div
        data-slot="demo-preview-card"
        className={cn(
          "overflow-hidden rounded-xl bg-card text-card-foreground edge",
          ctx.depth !== "none" && "edge",
        )}
      >
        <div
          data-slot="demo-preview-header"
          className="overflow-x-auto border-b border-border bg-muted/30 px-2 py-1.5 scrollbar-thin"
        >
          <div
            data-slot="demo-preview-toolbar"
            className="flex min-h-9 w-max min-w-full max-w-none flex-nowrap items-center gap-1 pr-2"
          >
            <ToolbarGroup label="View">
              {VIEW_OPTIONS.map(({ label, value, icon: Icon, tooltip }) => (
                <DemoToolbarIconButton
                  key={value}
                  label={label}
                  tooltip={tooltip}
                  value={value}
                  currentValue={view}
                  onSelect={setView}
                >
                  <Icon aria-hidden="true" className="size-4" />
                </DemoToolbarIconButton>
              ))}
            </ToolbarGroup>
            <ToolbarGroup label="Device">
              {VIEWPORT_OPTIONS.map(({ label, value, icon: Icon, tooltip }) => (
                <DemoToolbarIconButton
                  key={value}
                  label={label}
                  tooltip={tooltip}
                  value={value}
                  currentValue={ctx.viewport}
                  onSelect={(viewport) => updateContext({ viewport })}
                >
                  <Icon aria-hidden="true" className="size-4" />
                </DemoToolbarIconButton>
              ))}
            </ToolbarGroup>
            <ToolbarGroup label="Density">
              {DENSITY_OPTIONS.map(({ label, value, tooltip }) => (
                <DemoToolbarIconButton
                  key={value}
                  label={label}
                  tooltip={tooltip}
                  value={value}
                  currentValue={ctx.density}
                  onSelect={(density) => updateContext({ density })}
                >
                  <DensityGlyph density={value} />
                </DemoToolbarIconButton>
              ))}
            </ToolbarGroup>
            <ToolbarGroup label="Frame" disabled={disabled.frame}>
              {FRAME_OPTIONS.map(({ label, value, icon: Icon, tooltip }) => (
                <DemoToolbarIconButton
                  key={value}
                  label={label}
                  tooltip={
                    disabled.frame
                      ? "Frame is not available for this example."
                      : tooltip
                  }
                  value={value}
                  currentValue={ctx.frame}
                  onSelect={(frame) => updateContext({ frame })}
                  disabled={disabled.frame}
                >
                  <Icon aria-hidden="true" className="size-4" />
                </DemoToolbarIconButton>
              ))}
            </ToolbarGroup>
            <ToolbarGroup label="Depth" disabled={disabled.depth}>
              {DEPTH_OPTIONS.map(({ label, value, icon: Icon, tooltip }) => (
                <DemoToolbarIconButton
                  key={value}
                  label={label}
                  tooltip={
                    disabled.depth
                      ? "Depth is not available for this example."
                      : tooltip
                  }
                  value={value}
                  currentValue={ctx.depth}
                  onSelect={(depth) => updateContext({ depth })}
                  disabled={disabled.depth}
                >
                  <Icon aria-hidden="true" className="size-4" />
                </DemoToolbarIconButton>
              ))}
            </ToolbarGroup>
            <ToolbarGroup label="State" disabled={disabled.state}>
              {STATE_OPTIONS.map(({ label, value, icon: Icon, tooltip }) => (
                <DemoToolbarIconButton
                  key={value}
                  label={label}
                  tooltip={
                    disabled.state
                      ? "State is not available for this example."
                      : tooltip
                  }
                  value={value}
                  currentValue={ctx.state}
                  onSelect={(state) => updateContext({ state })}
                  disabled={disabled.state}
                >
                  <Icon
                    aria-hidden="true"
                    className={cn(
                      "size-4",
                      value === "loading" && "animate-spin",
                    )}
                  />
                </DemoToolbarIconButton>
              ))}
            </ToolbarGroup>
          </div>
        </div>
        <div
          data-slot="demo-preview-surface"
          data-demo-surface={ctx.surface}
          data-demo-density={ctx.density}
          data-demo-frame={ctx.frame}
          data-demo-depth={ctx.depth}
          data-demo-state={ctx.state}
          data-demo-view={view}
          className={cn(
            "flex min-h-56 w-full items-center justify-center overflow-hidden",
            view === "preview" ? "p-6 sm:p-8" : "p-0",
            ctx.frame === "inset" && "bg-muted/20",
          )}
        >
          {view === "preview" ? (
            <DemoPreviewContent
              surface={ctx.surface}
              viewport={ctx.viewport}
              skipSurfaceWrapper={skipSurfaceWrapper}
              density={ctx.density}
              frame={ctx.frame}
              depth={ctx.depth}
              state={ctx.state}
            >
              {children}
            </DemoPreviewContent>
          ) : (
            <div className="w-full">{code?.(ctx)}</div>
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}

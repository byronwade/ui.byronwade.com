"use client"

import * as React from "react"
import { CheckCircle, CircleNotch, Clock, Warning } from "@/lib/icons"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress, type ProgressTone } from "@/components/ui/progress"
import { StatusDot, type StatusTone } from "@/components/ui/status-dot"
import { Thumbnail } from "@/components/ui/thumbnail"

type UploadStatus = "queued" | "uploading" | "processing" | "done" | "error"

type BadgeVariant = "secondary" | "warning" | "success" | "destructive"

// Each status owns its consumer-specific tone words because StatusDot, Badge,
// and Progress use *different* vocabularies (e.g. StatusDot says `danger` where
// Badge/Progress say `destructive`). Mapping them per-row keeps every value
// valid against its target component's union, and resolves every tone to a
// semantic token so the row re-skins with `--brand`/`--success`/etc.
const statusConfig: Record<
  UploadStatus,
  {
    label: string
    dot: StatusTone
    badge: BadgeVariant
    bar: ProgressTone
    Icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>
  }
> = {
  queued: {
    label: "Queued",
    dot: "neutral",
    badge: "secondary",
    bar: "default",
    Icon: Clock,
  },
  uploading: {
    label: "Uploading",
    dot: "warning",
    badge: "warning",
    bar: "warning",
    Icon: CircleNotch,
  },
  processing: {
    label: "Processing",
    dot: "warning",
    badge: "warning",
    bar: "warning",
    Icon: CircleNotch,
  },
  done: {
    label: "Done",
    dot: "success",
    badge: "success",
    bar: "success",
    Icon: CheckCircle,
  },
  error: {
    label: "Error",
    dot: "danger",
    badge: "destructive",
    bar: "destructive",
    Icon: Warning,
  },
}

const inFlight: ReadonlySet<UploadStatus> = new Set([
  "queued",
  "uploading",
  "processing",
])

interface UploadRowProps extends React.ComponentProps<"div"> {
  filename: string
  thumbnailSrc?: string
  sizeLabel?: string
  status: UploadStatus
  progress?: number
  statusLabel?: string
  onCancel?: () => void
  onRetry?: () => void
}

function clampPercent(value: number) {
  return Math.min(100, Math.max(0, value))
}

function UploadRow({
  filename,
  thumbnailSrc,
  sizeLabel,
  status,
  progress,
  statusLabel,
  onCancel,
  onRetry,
  className,
  ...props
}: UploadRowProps) {
  const config = statusConfig[status]
  const label = statusLabel ?? config.label

  // `done` always reads 100; `error` clamps to a defined floor; the active
  // transfers reflect the live `progress`. `null` is Base UI's indeterminate
  // sentinel, the bar animates with no `aria-valuenow`, which is what we want
  // when an in-flight row has no numeric progress yet (e.g. `queued`).
  const percent: number | null =
    status === "done"
      ? 100
      : status === "error"
        ? clampPercent(progress ?? 0)
        : progress === undefined
          ? null
          : clampPercent(progress)

  // Mono percent text only belongs to an in-progress *upload*, `processing`
  // shows the bar but no countable percent, `done`/`error` have their own state.
  const showPercent = status === "uploading" && percent !== null

  const showCancel = inFlight.has(status) && onCancel != null
  const showRetry = status === "error" && onRetry != null

  return (
    <div
      data-slot="upload-row"
      data-status={status}
      className={cn(
        "flex items-center gap-3 border-b border-border py-3",
        className,
      )}
      {...props}
    >
      <Thumbnail
        data-slot="upload-row-preview"
        src={thumbnailSrc}
        alt={filename}
        ratio={16 / 9}
        className="w-20 shrink-0"
      />

      <div
        data-slot="upload-row-info"
        className="flex min-w-0 flex-1 flex-col gap-1.5"
      >
        <div className="flex items-baseline justify-between gap-3">
          <span
            data-slot="upload-row-filename"
            className="truncate text-sm text-foreground"
          >
            {filename}
          </span>
          {sizeLabel ? (
            <span
              data-slot="upload-row-size"
              className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground"
            >
              {sizeLabel}
            </span>
          ) : null}
        </div>

        <Progress
          data-slot="upload-row-progress"
          value={percent}
          tone={config.bar}
          aria-label={`${filename}, ${label}`}
        />
      </div>

      <div
        data-slot="upload-row-status"
        className="flex shrink-0 items-center gap-1.5"
      >
        {showPercent ? (
          <span
            data-slot="upload-row-percent"
            className="font-mono text-xs tabular-nums text-muted-foreground"
          >
            {Math.round(percent as number)}%
          </span>
        ) : null}
        <StatusDot tone={config.dot} />
        <Badge variant={config.badge}>
          <config.Icon
            aria-hidden
            className={cn(
              "size-3",
              (status === "uploading" || status === "processing") &&
                "animate-spin",
            )}
          />
          {label}
        </Badge>
      </div>

      {showCancel || showRetry ? (
        <div
          data-slot="upload-row-actions"
          className="flex shrink-0 items-center"
        >
          {showCancel ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              data-slot="upload-row-cancel"
            >
              Cancel
            </Button>
          ) : null}
          {showRetry ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRetry}
              data-slot="upload-row-retry"
            >
              Retry
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

export { UploadRow }
export type { UploadRowProps, UploadStatus }

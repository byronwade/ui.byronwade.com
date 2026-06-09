"use client"

import * as React from "react"
import { cva } from "class-variance-authority"
import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Checkbox } from "@/components/ui/checkbox"

const bulkActionBarVariants = cva(
  "flex items-center gap-2 rounded-lg edge px-3 py-2 edge",
  {
    variants: {
      variant: {
        default: "border-border bg-card text-card-foreground",
        index:
          "h-8 min-h-8 border-0 bg-foreground px-2.5 py-0 text-[13px] text-background shadow-none [&_[data-slot=bulk-action-bar-label]]:text-xs [&_[data-slot=bulk-action-bar-label]]:text-background/70 [&_[data-slot=bulk-action-bar-action]]:h-7 [&_[data-slot=bulk-action-bar-action]]:px-2.5 [&_[data-slot=bulk-action-bar-action]]:text-xs [&_[data-slot=bulk-action-bar-action][data-tone=default]]:border-background/25 [&_[data-slot=bulk-action-bar-action][data-tone=default]]:bg-transparent [&_[data-slot=bulk-action-bar-action][data-tone=default]]:text-background [&_[data-slot=bulk-action-bar-action][data-tone=default]]:hover:bg-background/10 [&_[data-slot=bulk-action-bar-clear]]:size-7 [&_[data-slot=bulk-action-bar-clear]]:text-background/70 [&_[data-slot=bulk-action-bar-clear]]:hover:bg-background/10 [&_[data-slot=bulk-action-bar-clear]]:hover:text-background",
      },
      sticky: { true: "sticky z-10", false: "" },
      position: { top: "", bottom: "" },
    },
    compoundVariants: [
      { sticky: true, position: "top", className: "top-0" },
      { sticky: true, position: "bottom", className: "bottom-0" },
    ],
    defaultVariants: { variant: "default", sticky: false, position: "top" },
  },
)

type BulkAction = {
  id?: string
  label: string
  onClick?: () => void
  icon?: React.ComponentType<{ className?: string }>
  tone?: "default" | "destructive"
  promoted?: boolean
  disabled?: boolean
}

type BulkActionBarProps = {
  selectedCount: number
  totalCount?: number
  actions: BulkAction[]
  onClearSelection?: () => void
  selectAllChecked?: boolean
  onSelectAllChange?: (checked: boolean) => void
  label?: (count: number) => React.ReactNode
  variant?: "default" | "index"
  sticky?: boolean
  position?: "top" | "bottom"
  className?: string
}

function defaultLabel(count: number) {
  return (
    <>
      <span
        data-slot="bulk-action-bar-count"
        className="font-mono tabular-nums"
      >
        {count}
      </span>{" "}
      selected
    </>
  )
}

function BulkActionButton({ action }: { action: BulkAction }) {
  const Icon = action.icon
  return (
    <Button
      data-slot="bulk-action-bar-action"
      data-tone={action.tone ?? "default"}
      variant={
        action.tone === "destructive"
          ? "destructive"
          : action.promoted
            ? "default"
            : "outline"
      }
      size="sm"
      disabled={action.disabled}
      onClick={action.onClick}
    >
      {Icon ? <Icon /> : null}
      {action.label}
    </Button>
  )
}

function BulkActionBar({
  selectedCount,
  totalCount,
  actions,
  onClearSelection,
  selectAllChecked,
  onSelectAllChange,
  label,
  variant = "default",
  sticky = false,
  position = "top",
  className,
}: BulkActionBarProps) {
  if (selectedCount <= 0) return null

  const showSelectAll = totalCount != null
  const checked =
    selectAllChecked ?? (totalCount != null && selectedCount >= totalCount)
  const indeterminate =
    !checked && totalCount != null && selectedCount < totalCount

  const renderLabel = label ?? defaultLabel
  const promoted = actions.filter((action) => action.promoted)
  const grouped = actions.filter((action) => !action.promoted)

  return (
    <div
      data-slot="bulk-action-bar"
      className={cn(
        bulkActionBarVariants({ variant, sticky, position }),
        className,
      )}
    >
      <div
        data-slot="bulk-action-bar-summary"
        className="flex items-center gap-2.5"
      >
        {showSelectAll ? (
          <Checkbox
            data-slot="bulk-action-bar-select-all"
            aria-label="Select all"
            checked={checked}
            indeterminate={indeterminate}
            onCheckedChange={(value) => onSelectAllChange?.(value)}
          />
        ) : null}
        <span
          data-slot="bulk-action-bar-label"
          className="text-sm text-muted-foreground"
        >
          {renderLabel(selectedCount)}
        </span>
      </div>

      <div
        data-slot="bulk-action-bar-actions"
        className="ml-auto flex items-center gap-2"
      >
        {promoted.map((action) => (
          <BulkActionButton key={action.id ?? action.label} action={action} />
        ))}
        {grouped.length > 0 ? (
          <ButtonGroup data-slot="bulk-action-bar-group">
            {grouped.map((action) => (
              <BulkActionButton
                key={action.id ?? action.label}
                action={action}
              />
            ))}
          </ButtonGroup>
        ) : null}
        {onClearSelection ? (
          <Button
            data-slot="bulk-action-bar-clear"
            variant="ghost"
            size="icon-sm"
            aria-label="Clear selection"
            onClick={onClearSelection}
          >
            <XIcon />
          </Button>
        ) : null}
      </div>
    </div>
  )
}

export { BulkActionBar, bulkActionBarVariants }
export type { BulkAction, BulkActionBarProps }

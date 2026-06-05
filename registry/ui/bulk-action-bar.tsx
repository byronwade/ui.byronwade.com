"use client"

import * as React from "react"
import { cva } from "class-variance-authority"
import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Checkbox } from "@/components/ui/checkbox"

const bulkActionBarVariants = cva(
  "flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2 text-card-foreground shadow-sm",
  {
    variants: {
      sticky: { true: "sticky z-10", false: "" },
      position: { top: "", bottom: "" },
    },
    compoundVariants: [
      { sticky: true, position: "top", className: "top-0" },
      { sticky: true, position: "bottom", className: "bottom-0" },
    ],
    defaultVariants: { sticky: false, position: "top" },
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
      className={cn(bulkActionBarVariants({ sticky, position }), className)}
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

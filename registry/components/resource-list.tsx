"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import {
  useDemoDensity,
  useDemoFrame,
  useDemoDepth,
} from "@/lib/demo-viewport"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { EntityRow } from "@/components/ui/entity-row"
import { BulkActionBar, type BulkAction } from "@/components/ui/bulk-action-bar"

type ResourceBadge = {
  label: string
  variant?: React.ComponentProps<typeof Badge>["variant"]
}

type ResourceSelectionContextValue = {
  selectable: boolean
  density: ResourceListDensity
  frame: ResourceListFrame
  isSelected: (id: string) => boolean
  toggle: (id: string, next: boolean) => void
}

const ResourceSelectionContext =
  React.createContext<ResourceSelectionContextValue | null>(null)

type ResourceListDensity = "compact" | "default" | "comfortable"
type ResourceListFrame = "default" | "inset"
type ResourceListDepth = "none" | "soft" | "raised"

type ResourceItemProps = {
  id: string
  /** Leading media — compose an `Avatar` as a thumbnail, or any media node. */
  media?: React.ReactNode
  title: React.ReactNode
  subtitle?: React.ReactNode
  badges?: ResourceBadge[]
  /** Hover/focus-revealed shortcut actions — compose `Button`s. */
  actions?: React.ReactNode
  onClick?: () => void
  href?: string
  /** Standalone selection — overrides list-driven selection when provided. */
  selected?: boolean
  onSelectedChange?: (next: boolean) => void
  selectable?: boolean
  className?: string
}

function ResourceItem({
  id,
  media,
  title,
  subtitle,
  badges,
  actions,
  onClick,
  href,
  selected,
  onSelectedChange,
  selectable,
  className,
}: ResourceItemProps) {
  const list = React.useContext(ResourceSelectionContext)
  const density = list?.density ?? "default"
  const frame = list?.frame ?? "default"

  // Explicit item props win; otherwise the row inherits the list's selection.
  const isSelectable = selectable ?? list?.selectable ?? false
  const isSelected = selected ?? (list ? list.isSelected(id) : false)

  function setSelected(next: boolean) {
    onSelectedChange?.(next)
    list?.toggle(id, next)
  }

  function activate() {
    onClick?.()
  }

  const interactive = href != null || onClick != null
  const label = typeof title === "string" ? title : id

  // Whole-row click is a stretched overlay sibling, never a wrapper `role`,
  // so the checkbox and shortcut actions sit *beside* it (z-indexed above)
  // rather than nested inside an interactive ancestor — which would trip
  // axe's `nested-interactive` rule.
  const overlay = interactive ? (
    href ? (
      <a
        data-slot="resource-item-link"
        href={href}
        aria-label={label}
        className="absolute inset-0 rounded-lg focus-visible:ring-2 focus-visible:ring-ring outline-none"
        onClick={activate}
      />
    ) : (
      <button
        type="button"
        data-slot="resource-item-link"
        aria-label={label}
        className="absolute inset-0 rounded-lg focus-visible:ring-2 focus-visible:ring-ring outline-none"
        onClick={activate}
      />
    )
  ) : null

  const leading =
    isSelectable || media != null ? (
      <>
        {isSelectable ? (
          <span data-slot="resource-item-selection" className="relative z-10">
            <Checkbox
              data-slot="resource-item-checkbox"
              aria-label={`Select ${label}`}
              checked={isSelected}
              onCheckedChange={(next) => setSelected(next)}
            />
          </span>
        ) : null}

        {media != null ? (
          <span
            data-slot="resource-item-media"
            className={cn(
              "relative z-10 flex shrink-0 items-center justify-center overflow-hidden rounded-lg [&>*]:size-full",
              density === "compact" && "size-7",
              density === "default" && "size-8",
              density === "comfortable" && "size-10",
            )}
          >
            {media}
          </span>
        ) : null}
      </>
    ) : undefined

  return (
    <EntityRow
      data-slot="resource-item"
      data-selected={isSelected || undefined}
      variant={density === "compact" ? "compact" : "default"}
      className={cn(
        "group/item",
        density === "compact" && "min-h-9 px-2 py-1.5",
        density === "default" && "min-h-11",
        density === "comfortable" && "min-h-14 px-3.5 py-3",
        frame === "inset" && "rounded-lg",
        interactive && "hover:bg-muted/50",
        isSelected && "bg-brand/5",
        className,
      )}
      leading={leading}
      title={
        <span
          data-slot="resource-item-content"
          className="pointer-events-none relative z-10 min-w-0 flex-1"
        >
          <span
            data-slot="resource-item-title-line"
            className={cn(
              "flex items-center",
              density === "compact" ? "gap-1.5" : "gap-2",
            )}
          >
            <span
              data-slot="resource-item-title"
              className={cn(
                "truncate font-medium",
                density === "compact" ? "text-[13px]" : "text-sm",
              )}
            >
              {title}
            </span>
            {badges?.length ? (
              <span
                data-slot="resource-item-badges"
                className="flex shrink-0 items-center gap-1"
              >
                {badges.map((badge, i) => (
                  <Badge key={i} variant={badge.variant}>
                    {badge.label}
                  </Badge>
                ))}
              </span>
            ) : null}
          </span>
          {subtitle != null ? (
            <span
              data-slot="resource-item-subtitle"
              className={cn(
                "block truncate text-xs text-muted-foreground",
                density === "compact" && "mt-0",
                density === "default" && "mt-0.5",
                density === "comfortable" && "mt-1",
              )}
            >
              {subtitle}
            </span>
          ) : null}
        </span>
      }
      actions={
        actions != null ? (
          <span
            data-slot="resource-item-actions"
            className={cn(
              "relative z-10 shrink-0 opacity-0 transition-opacity group-focus-within/item:opacity-100 group-hover/item:opacity-100",
              density === "compact" && "scale-95",
            )}
          >
            {actions}
          </span>
        ) : undefined
      }
    >
      {overlay}
    </EntityRow>
  )
}

function ResourceItemSkeleton() {
  return (
    <div
      data-slot="resource-item-skeleton"
      className="flex items-center gap-3 px-3 py-2.5"
    >
      <span className="size-8 shrink-0 animate-pulse rounded-full bg-muted" />
      <span className="flex min-w-0 flex-1 flex-col gap-1.5">
        <span className="h-3 w-1/3 animate-pulse rounded-sm bg-muted" />
        <span className="h-2.5 w-1/2 animate-pulse rounded-sm bg-muted" />
      </span>
    </div>
  )
}

type ResourceListProps = {
  selectable?: boolean
  selectedIds?: string[]
  onSelectionChange?: (next: string[]) => void
  /** Total item count for the header summary and select-all state. */
  totalCount?: number
  loading?: boolean
  emptyState?: React.ReactNode
  bulkActions?: BulkAction[]
  header?: React.ReactNode
  children: React.ReactNode
  className?: string
  density?: ResourceListDensity
  frame?: ResourceListFrame
  depth?: ResourceListDepth
}

function ResourceList({
  selectable = false,
  selectedIds,
  onSelectionChange,
  totalCount,
  loading = false,
  emptyState,
  bulkActions,
  header,
  children,
  className,
  density: densityProp,
  frame: frameProp,
  depth: depthProp,
}: ResourceListProps) {
  const demoDensity = useDemoDensity()
  const demoFrame = useDemoFrame()
  const demoDepth = useDemoDepth()
  const density = densityProp ?? demoDensity ?? "default"
  const frame = frameProp ?? demoFrame ?? "default"
  const depth = depthProp ?? demoDepth ?? "none"
  const selected = selectedIds ?? []
  const items = React.Children.toArray(children)
  const count = totalCount ?? items.length

  const itemIds = React.useMemo(
    () =>
      items
        .map((child) =>
          React.isValidElement<ResourceItemProps>(child)
            ? child.props.id
            : null,
        )
        .filter((id): id is string => id != null),
    [items],
  )

  const isSelected = React.useCallback(
    (id: string) => selected.includes(id),
    [selected],
  )

  const toggle = React.useCallback(
    (id: string, next: boolean) => {
      const set = new Set(selected)
      if (next) set.add(id)
      else set.delete(id)
      onSelectionChange?.([...set])
    },
    [selected, onSelectionChange],
  )

  const selectionValue = React.useMemo<ResourceSelectionContextValue>(
    () => ({ selectable, density, frame, isSelected, toggle }),
    [selectable, density, frame, isSelected, toggle],
  )

  function handleSelectAll(next: boolean) {
    onSelectionChange?.(next ? itemIds : [])
  }

  const isEmpty = !loading && items.length === 0
  const showBulk = selectable && bulkActions != null && selected.length > 0

  return (
    <ResourceSelectionContext.Provider value={selectionValue}>
      <div
        data-slot="resource-list"
        data-density={density}
        data-frame={frame}
        data-depth={depth}
        className={cn(
          "flex flex-col text-card-foreground",
          frame === "inset"
            ? "rounded-2xl edge bg-muted/20 p-1.5 ring-1 ring-border/70"
            : "rounded-lg edge bg-card",
          depth === "none" && "shadow-none",
          depth === "soft" && "depth-soft",
          depth === "raised" && "depth-raised",
          className,
        )}
      >
        {showBulk ? (
          <BulkActionBar
            selectedCount={selected.length}
            totalCount={count}
            actions={bulkActions}
            onClearSelection={() => onSelectionChange?.([])}
            onSelectAllChange={handleSelectAll}
            className="rounded-t-lg rounded-b-none border-0 border-b border-border shadow-none"
          />
        ) : (
          <div
            data-slot="resource-list-header"
            className={cn(
              "flex items-center border-b border-border",
              density === "compact" ? "gap-2 px-2 py-1.5" : "gap-3 px-3 py-2",
              density === "comfortable" && "px-3.5 py-2.5",
            )}
          >
            {selectable ? (
              <Checkbox
                data-slot="resource-list-select-all"
                aria-label="Select all"
                checked={count > 0 && selected.length >= count}
                indeterminate={selected.length > 0 && selected.length < count}
                onCheckedChange={handleSelectAll}
              />
            ) : null}
            <span
              data-slot="resource-list-count"
              className="font-mono text-xs tabular-nums text-muted-foreground"
            >
              {count} {count === 1 ? "item" : "items"}
            </span>
            {header != null ? (
              <span
                data-slot="resource-list-header-extra"
                className="ml-auto flex items-center gap-2"
              >
                {header}
              </span>
            ) : null}
          </div>
        )}

        <div
          data-slot="resource-list-items"
          className={cn(
            "flex flex-col",
            frame === "inset"
              ? "gap-0.5 rounded-lg bg-card p-1 ring-1 ring-border/50"
              : "p-1",
          )}
        >
          {loading ? (
            <>
              <ResourceItemSkeleton />
              <ResourceItemSkeleton />
              <ResourceItemSkeleton />
            </>
          ) : isEmpty ? (
            <div data-slot="resource-list-empty">{emptyState}</div>
          ) : (
            children
          )}
        </div>
      </div>
    </ResourceSelectionContext.Provider>
  )
}

export { ResourceList, ResourceItem }
export type { ResourceItemProps, ResourceListProps, ResourceBadge }

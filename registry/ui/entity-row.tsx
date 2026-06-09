"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const entityRowVariants = cva(
  "group/entity-row relative flex w-full items-center gap-3 text-left transition-colors",
  {
    variants: {
      variant: {
        default: "rounded-md px-3 py-2.5",
        card: "rounded-lg border border-border bg-card px-3 py-3 text-card-foreground",
        compact: "gap-2 rounded-md px-2 py-1.5",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

type EntityRowOwnProps = VariantProps<typeof entityRowVariants> & {
  leading?: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
  meta?: React.ReactNode
  status?: React.ReactNode
  actions?: React.ReactNode
  onActivate?: (event: React.MouseEvent<HTMLButtonElement>) => void
  activationLabel?: string
}

type EntityRowProps =
  | (Omit<React.ComponentPropsWithoutRef<"div">, "title"> &
      EntityRowOwnProps & { as?: "div" })
  | (Omit<React.ComponentPropsWithoutRef<"li">, "title"> &
      EntityRowOwnProps & { as: "li" })

function EntityRowContent({
  children,
  leading,
  title,
  description,
  meta,
  status,
  actions,
  onActivate,
  activationLabel,
}: EntityRowOwnProps & { children?: React.ReactNode }) {
  const interactive = onActivate != null
  const resolvedLabel =
    activationLabel ?? (typeof title === "string" ? title : "Activate row")

  return (
    <>
      {children}

      {interactive ? (
        <button
          type="button"
          data-slot="entity-row-activator"
          aria-label={resolvedLabel}
          className="absolute inset-0 rounded-[inherit] outline-none focus-visible:ring-2 focus-visible:ring-ring"
          onClick={onActivate}
        />
      ) : null}

      {leading != null ? (
        <span
          data-slot="entity-row-leading"
          className={cn(
            "relative z-10 flex shrink-0 items-center justify-center",
            interactive && "pointer-events-none",
          )}
        >
          {leading}
        </span>
      ) : null}

      <span
        data-slot="entity-row-body"
        className={cn(
          "relative z-10 flex min-w-0 flex-1 flex-col",
          interactive && "pointer-events-none",
        )}
      >
        <span
          data-slot="entity-row-title"
          className="truncate text-sm leading-tight font-medium"
        >
          {title}
        </span>
        {description != null ? (
          <span
            data-slot="entity-row-description"
            className="mt-0.5 truncate text-xs leading-tight text-muted-foreground"
          >
            {description}
          </span>
        ) : null}
      </span>

      {meta != null ? (
        <span
          data-slot="entity-row-meta"
          className={cn(
            "relative z-10 ml-auto shrink-0 font-mono text-xs tabular-nums text-muted-foreground",
            interactive && "pointer-events-none",
          )}
        >
          {meta}
        </span>
      ) : null}

      {status != null ? (
        <span
          data-slot="entity-row-status"
          className={cn(
            "relative z-10 shrink-0",
            meta == null && actions == null && "ml-auto",
            interactive && "pointer-events-none",
          )}
        >
          {status}
        </span>
      ) : null}

      {actions != null ? (
        <span
          data-slot="entity-row-actions"
          className={cn("relative z-10 shrink-0", meta == null && "ml-auto")}
        >
          {actions}
        </span>
      ) : null}
    </>
  )
}

function EntityRow(props: EntityRowProps) {
  if (props.as === "li") {
    const {
      as: _as,
      className,
      variant,
      leading,
      title,
      description,
      meta,
      status,
      actions,
      onActivate,
      activationLabel,
      children,
      ...liProps
    } = props
    const interactive = onActivate != null

    return (
      <li
        data-slot="entity-row"
        className={cn(
          entityRowVariants({ variant }),
          interactive && "hover:bg-muted/50",
          className,
        )}
        {...liProps}
      >
        <EntityRowContent
          leading={leading}
          title={title}
          description={description}
          meta={meta}
          status={status}
          actions={actions}
          onActivate={onActivate}
          activationLabel={activationLabel}
        >
          {children}
        </EntityRowContent>
      </li>
    )
  }

  const {
    as: _as,
    className,
    variant,
    leading,
    title,
    description,
    meta,
    status,
    actions,
    onActivate,
    activationLabel,
    children,
    ...divProps
  } = props
  const interactive = onActivate != null

  return (
    <div
      data-slot="entity-row"
      className={cn(
        entityRowVariants({ variant }),
        interactive && "hover:bg-muted/50",
        className,
      )}
      {...divProps}
    >
      <EntityRowContent
        leading={leading}
        title={title}
        description={description}
        meta={meta}
        status={status}
        actions={actions}
        onActivate={onActivate}
        activationLabel={activationLabel}
      >
        {children}
      </EntityRowContent>
    </div>
  )
}

export { EntityRow, entityRowVariants }
export type { EntityRowOwnProps, EntityRowProps }

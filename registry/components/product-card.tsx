"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { StatusDot, type StatusTone } from "@/components/ui/status-dot"

type ProductStatus = "active" | "draft" | "archived"

interface ProductCardProps {
  title: string
  image?: string
  vendor?: string
  price: number
  compareAtPrice?: number
  currency?: string
  locale?: string
  status?: ProductStatus
  inventory?: number
  lowStockThreshold?: number
  onClick?: () => void
  className?: string
}

// Status → tone map, mirroring StatusPill/VerificationProgress. The StatusDot
// tone and the Badge variant are driven from one record so the dot and chip
// always agree. `archived` reads as muted via the `secondary` chip — there is
// no literal grey, the token carries the meaning.
const statusMap: Record<
  ProductStatus,
  {
    tone: StatusTone
    variant: "success" | "warning" | "secondary"
    label: string
  }
> = {
  active: { tone: "success", variant: "success", label: "Active" },
  draft: { tone: "warning", variant: "warning", label: "Draft" },
  archived: { tone: "neutral", variant: "secondary", label: "Archived" },
}

function ProductCard({
  title,
  image,
  vendor,
  price,
  compareAtPrice,
  currency = "USD",
  locale = "en-US",
  status,
  inventory,
  lowStockThreshold = 5,
  onClick,
  className,
}: ProductCardProps) {
  const money = React.useMemo(
    () => new Intl.NumberFormat(locale, { style: "currency", currency }),
    [locale, currency],
  )

  const interactive = onClick !== undefined

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      onClick!()
    }
  }

  const statusInfo = status ? statusMap[status] : undefined

  return (
    <Card
      data-slot="product-card"
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={interactive ? onClick : undefined}
      onKeyDown={interactive ? handleKeyDown : undefined}
      className={cn(
        interactive &&
          "cursor-pointer transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none",
        className,
      )}
    >
      <AspectRatio ratio={1} data-slot="product-card-media">
        {image ? (
          <img
            data-slot="product-card-image"
            src={image}
            alt={title}
            className="size-full object-cover"
          />
        ) : (
          <div
            data-slot="product-card-placeholder"
            className="grid size-full place-items-center border-b border-border bg-muted"
          >
            <span
              aria-hidden
              className="font-mono text-2xl text-muted-foreground"
            >
              {title.charAt(0)}
            </span>
          </div>
        )}
      </AspectRatio>

      <CardContent
        data-slot="product-card-body"
        className="flex flex-col gap-2"
      >
        <div className="flex flex-col gap-0.5">
          <span
            data-slot="product-card-title"
            className="truncate text-sm font-medium leading-snug"
          >
            {title}
          </span>
          {vendor && (
            <span
              data-slot="product-card-vendor"
              className="truncate text-xs text-muted-foreground"
            >
              {vendor}
            </span>
          )}
        </div>

        {statusInfo && (
          <div
            data-slot="product-card-status"
            className="flex items-center gap-1.5"
          >
            <StatusDot tone={statusInfo.tone} />
            <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
          </div>
        )}

        <div
          data-slot="product-card-price"
          className="flex items-baseline gap-1.5 font-mono text-sm tabular-nums"
        >
          {compareAtPrice !== undefined && (
            <span className="text-muted-foreground line-through">
              {money.format(compareAtPrice)}
            </span>
          )}
          <span className="text-foreground">{money.format(price)}</span>
        </div>

        {inventory !== undefined && (
          <span
            data-slot="product-card-inventory"
            className={cn(
              "font-mono text-xs tabular-nums",
              inventory === 0
                ? "text-destructive"
                : inventory <= lowStockThreshold
                  ? "text-warning"
                  : "text-muted-foreground",
            )}
          >
            {inventory === 0
              ? "Out of stock"
              : inventory <= lowStockThreshold
                ? `Low stock · ${inventory}`
                : `${inventory} in stock`}
          </span>
        )}
      </CardContent>
    </Card>
  )
}

export { ProductCard }
export type { ProductCardProps, ProductStatus }

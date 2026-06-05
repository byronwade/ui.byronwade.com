import type { ComponentPropsWithoutRef } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PriceChange } from "@/components/ui/price-change"
import { formatPrice, makePosition, type Position } from "@/lib/market"
import { cn } from "@/lib/utils"

const DEFAULT_POSITION = makePosition({ seed: 6 })

type PositionCardProps = Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  position?: Position
  onClose?: (symbol: string) => void
}

function PositionCard({
  position = DEFAULT_POSITION,
  onClose,
  className,
  ...props
}: PositionCardProps) {
  const sideTone =
    position.side === "long"
      ? "bg-success/10 text-success"
      : "bg-destructive/10 text-destructive"

  return (
    <div
      data-slot="position-card"
      className={cn(
        "flex w-full max-w-sm flex-col gap-4 rounded-xl border border-border bg-card p-4",
        className,
      )}
      {...props}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span
              data-slot="position-card-symbol"
              className="text-lg font-medium tracking-tight"
            >
              {position.symbol}
            </span>
            <Badge
              data-slot="position-card-side"
              variant="outline"
              className={sideTone}
            >
              {position.side}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Size{" "}
            <span className="font-mono text-foreground">{position.size}</span>
          </p>
        </div>
        {onClose ? (
          <Button
            data-slot="position-card-close"
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onClose(position.symbol)}
          >
            Close
          </Button>
        ) : null}
      </div>
      <dl className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-muted-foreground">Entry</dt>
          <dd className="font-mono">{formatPrice(position.entry, { currency: "USD" })}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Mark</dt>
          <dd className="font-mono">{formatPrice(position.mark, { currency: "USD" })}</dd>
        </div>
      </dl>
      <div data-slot="position-card-pnl">
        <span className="mb-1 block text-sm text-muted-foreground">
          Unrealized P&amp;L
        </span>
        <PriceChange value={position.pnl} percent={position.pnlPercent} />
      </div>
    </div>
  )
}

export { PositionCard }
export type { PositionCardProps }

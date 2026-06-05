"use client"

import type { ComponentPropsWithoutRef } from "react"
import { Plus, X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PriceChange } from "@/components/ui/price-change"
import { makeQuotes, type Quote } from "@/lib/market"
import { cn } from "@/lib/utils"

const DEFAULT_SYMBOLS = makeQuotes(3, { seed: 14 })

type CompareSymbol = Pick<Quote, "symbol" | "change" | "changePercent">

type CompareSymbolsProps = Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  symbols?: CompareSymbol[]
  max?: number
  onRemove?: (symbol: string) => void
  onAdd?: () => void
}

function CompareSymbols({
  symbols = DEFAULT_SYMBOLS,
  max = 5,
  onRemove,
  onAdd,
  className,
  ...props
}: CompareSymbolsProps) {
  const canAdd = onAdd != null && symbols.length < max

  return (
    <div
      data-slot="compare-symbols"
      className={cn(
        "flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card px-3 py-2",
        className,
      )}
      {...props}
    >
      <span
        data-slot="compare-symbols-label"
        className="text-sm text-muted-foreground"
      >
        Compare
      </span>
      {symbols.map((item) => (
        <Badge
          key={item.symbol}
          data-slot="compare-symbols-chip"
          data-symbol={item.symbol}
          variant="outline"
          className="gap-2 py-1 pl-2 pr-1 font-mono"
        >
          <span>{item.symbol}</span>
          <PriceChange
            value={item.change}
            percent={item.changePercent}
            size="sm"
            format="percent"
            showIcon={false}
          />
          {onRemove ? (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="size-5"
              aria-label={`Remove ${item.symbol} from compare`}
              onClick={() => onRemove(item.symbol)}
            >
              <X className="size-3.5" />
            </Button>
          ) : null}
        </Badge>
      ))}
      {canAdd ? (
        <Button
          type="button"
          data-slot="compare-symbols-add"
          variant="outline"
          size="sm"
          onClick={onAdd}
        >
          <Plus className="size-4" />
          Add symbol
        </Button>
      ) : null}
    </div>
  )
}

export { CompareSymbols }
export type { CompareSymbolsProps, CompareSymbol }

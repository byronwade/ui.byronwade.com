"use client"

import type { ComponentPropsWithoutRef } from "react"
import { useMemo } from "react"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command"
import { Kbd } from "@/components/ui/kbd"
import { PriceChange } from "@/components/ui/price-change"
import { makeQuotes, type Quote } from "@/lib/market"
import { cn } from "@/lib/utils"

const DEFAULT_SYMBOLS = makeQuotes(8, { seed: 21 })

type SymbolGroup = {
  label: string
  symbols: Quote[]
}

type SymbolSearchProps = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onSelect"
> & {
  symbols?: Quote[]
  groups?: SymbolGroup[]
  placeholder?: string
  onSelect?: (symbol: string) => void
}

function buildDefaultGroups(symbols: Quote[]): SymbolGroup[] {
  return [
    { label: "Stocks", symbols: symbols.slice(0, 5) },
    { label: "Crypto", symbols: symbols.slice(5, 7) },
    { label: "Forex", symbols: symbols.slice(7) },
  ].filter((group) => group.symbols.length > 0)
}

function SymbolSearch({
  symbols = DEFAULT_SYMBOLS,
  groups,
  placeholder = "Search symbols…",
  onSelect,
  className,
  ...props
}: SymbolSearchProps) {
  const resolvedGroups = useMemo(
    () => groups ?? buildDefaultGroups(symbols),
    [groups, symbols],
  )

  return (
    <div
      data-slot="symbol-search"
      className={cn("w-full max-w-md overflow-hidden rounded-2xl edge bg-popover", className)}
      {...props}
    >
      <Command>
        <CommandInput placeholder={placeholder} aria-label={placeholder} />
        <div className="flex items-center justify-end gap-1 border-b border-border px-3 py-1.5 text-xs text-muted-foreground">
          <span>Navigate</span>
          <Kbd>↑</Kbd>
          <Kbd>↓</Kbd>
          <span>Select</span>
          <Kbd>↵</Kbd>
        </div>
        <CommandList>
          <CommandEmpty>No symbols found.</CommandEmpty>
          {resolvedGroups.map((group) => (
            <CommandGroup key={group.label} heading={group.label}>
              {group.symbols.map((quote) => (
                <CommandItem
                  key={quote.symbol}
                  value={`${quote.symbol} ${quote.name ?? ""}`}
                  onSelect={() => onSelect?.(quote.symbol)}
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <span className="font-medium">{quote.symbol}</span>
                    {quote.name ? (
                      <span className="truncate text-muted-foreground">{quote.name}</span>
                    ) : null}
                  </div>
                  <PriceChange
                    value={quote.change}
                    percent={quote.changePercent}
                    size="sm"
                  />
                  <CommandShortcut>{quote.symbol}</CommandShortcut>
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </Command>
    </div>
  )
}

export { SymbolSearch }
export type { SymbolSearchProps, SymbolGroup }

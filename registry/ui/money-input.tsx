"use client"

import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import {
  NumberField,
  NumberFieldGroup,
  NumberFieldInput,
} from "@/components/ui/number-field"

const moneyInputVariants = cva("", {
  variants: {
    size: {
      sm: "h-7 text-xs",
      default: "h-8 text-sm",
      lg: "h-9 text-base",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

const adornment =
  "flex items-center px-2.5 text-muted-foreground tabular-nums select-none"

/** Resolve the currency symbol and ISO code from `currency` + `locale`. */
function resolveCurrencyParts(currency: string, locale: string) {
  const parts = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).formatToParts(0)
  const symbol =
    parts.find((part) => part.type === "currency")?.value ?? currency
  return { symbol, code: currency }
}

type MoneyInputProps = {
  /** ISO 4217 currency code used to derive the symbol and trailing code. */
  currency?: string
  /** Locale used to derive the currency symbol via `Intl.NumberFormat`. */
  locale?: string
  /** Override the derived currency symbol (e.g. "£" instead of the locale default). */
  symbol?: string
  /** Render the trailing ISO currency code (e.g. "USD") after the input. */
  showCurrencyCode?: boolean
  value?: number | null
  defaultValue?: number
  onValueChange?: (value: number | null) => void
  size?: "sm" | "default" | "lg"
  min?: number
  max?: number
  disabled?: boolean
  id?: string
  name?: string
  className?: string
} & VariantProps<typeof moneyInputVariants>

function MoneyInput({
  currency = "USD",
  locale = "en-US",
  symbol,
  showCurrencyCode = false,
  value,
  defaultValue,
  onValueChange,
  size = "default",
  min,
  max,
  disabled,
  id,
  name,
  className,
}: MoneyInputProps) {
  const derived = resolveCurrencyParts(currency, locale)
  const displaySymbol = symbol ?? derived.symbol

  return (
    <NumberField
      data-slot="money-input"
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      locale={locale}
      format={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
      min={min}
      max={max}
      disabled={disabled}
      id={id}
      name={name}
    >
      <NumberFieldGroup
        data-slot="money-input-group"
        className={cn(moneyInputVariants({ size }), className)}
      >
        <span data-slot="money-input-symbol" className={cn(adornment, "pr-0")}>
          {displaySymbol}
        </span>
        <NumberFieldInput
          data-slot="money-input-control"
          aria-label="Amount"
          className="text-left font-mono tabular-nums"
        />
        {showCurrencyCode ? (
          <span
            data-slot="money-input-code"
            className={cn(adornment, "border-l border-border pl-2.5")}
          >
            {derived.code}
          </span>
        ) : null}
      </NumberFieldGroup>
    </NumberField>
  )
}

export { MoneyInput, moneyInputVariants }
export type { MoneyInputProps }

import { MoneyInput } from "@/components/ui/money-input"

export default function Example() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-4 p-8">
      {/* The symbol + trailing ISO code are derived from currency + locale. */}
      <MoneyInput
        currency="USD"
        locale="en-US"
        defaultValue={1234.5}
        showCurrencyCode
      />
      <MoneyInput
        currency="EUR"
        locale="de-DE"
        defaultValue={1234.5}
        showCurrencyCode
      />
      <MoneyInput
        currency="GBP"
        locale="en-GB"
        defaultValue={1234.5}
        showCurrencyCode
      />
      <MoneyInput
        currency="JPY"
        locale="ja-JP"
        defaultValue={1234.5}
        showCurrencyCode
      />
    </div>
  )
}

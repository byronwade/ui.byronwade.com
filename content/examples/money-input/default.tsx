"use client"

import { MoneyInput } from "@/components/ui/money-input"

export default function Example() {
  return (
    <div className="flex items-center justify-center p-8">
      <MoneyInput defaultValue={1234} currency="USD" showCurrencyCode />
    </div>
  )
}

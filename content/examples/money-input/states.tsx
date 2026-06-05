import { MoneyInput } from "@/components/ui/money-input"

export default function Example() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-4 p-8">
      {/* Symbol override — force "£" regardless of the derived locale symbol. */}
      <MoneyInput currency="GBP" symbol="£" defaultValue={49.99} />

      {/* Clamped to a 0–100 range. */}
      <MoneyInput defaultValue={100} min={0} max={100} />

      {/* Disabled. */}
      <MoneyInput defaultValue={250} disabled />
    </div>
  )
}

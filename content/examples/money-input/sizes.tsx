import { MoneyInput } from "@/components/ui/money-input"

export default function Example() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-4 p-8">
      <MoneyInput size="sm" defaultValue={19.99} />
      <MoneyInput size="default" defaultValue={199.99} />
      <MoneyInput size="lg" defaultValue={1999.99} />
    </div>
  )
}

import { CompareSymbols } from "@/components/compare-symbols"

export default function Example() {
  return (
    <div className="w-full max-w-2xl p-4">
      <CompareSymbols onAdd={() => undefined} onRemove={() => undefined} />
    </div>
  )
}

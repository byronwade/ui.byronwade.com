import { PriceChange } from "@/components/ui/price-change"

export default function Example() {
  return (
    <div className="flex flex-col gap-6 p-8">
      <div className="flex flex-wrap items-center gap-4">
        <PriceChange value={1.82} percent={1.82} />
        <PriceChange value={-2.14} percent={-2.14} />
        <PriceChange value={0} percent={0} />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <PriceChange value={1.82} percent={1.82} variant="chip" />
        <PriceChange value={-2.14} percent={-2.14} variant="chip" />
        <PriceChange value={0} percent={0} variant="chip" />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <PriceChange value={12.4} percent={1.05} size="sm" variant="chip" />
        <PriceChange value={12.4} percent={1.05} variant="chip" />
        <PriceChange value={12.4} percent={1.05} size="lg" variant="chip" />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <PriceChange value={68420.5} percent={3.21} format="absolute" />
        <PriceChange value={-2.14} percent={-2.14} format="percent" />
        <PriceChange value={5.5} percent={0.82} showIcon={false} />
      </div>
    </div>
  )
}

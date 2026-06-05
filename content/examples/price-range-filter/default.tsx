import { PriceRangeFilter } from "@/components/price-range-filter"

const ITEMS = [
  80, 95, 110, 130, 150, 165, 185, 205, 225, 245, 260, 275, 290, 300, 320, 345,
  365, 385, 400, 425, 450, 475, 500, 545, 590, 635, 680, 700, 750, 800, 845,
  880, 900,
].map((price) => ({ price }))

export default function Example() {
  return (
    <div className="mx-auto w-full max-w-sm p-6">
      <PriceRangeFilter items={ITEMS} defaultValue={[200, 780]} />
    </div>
  )
}

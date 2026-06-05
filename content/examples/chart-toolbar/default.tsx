import { ChartToolbar } from "@/components/chart-toolbar"

export default function Example() {
  return (
    <div className="w-full max-w-3xl">
      <ChartToolbar symbol="NVDA" interval="1D" />
    </div>
  )
}

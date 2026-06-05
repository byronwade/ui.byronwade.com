import { OrderEntry } from "@/components/order-entry"

export default function Example() {
  return (
    <div className="flex justify-center p-8">
      <OrderEntry symbol="NVDA" lastPrice={118.42} />
    </div>
  )
}

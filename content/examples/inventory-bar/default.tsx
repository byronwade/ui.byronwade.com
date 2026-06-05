"use client"

import { InventoryBar } from "@/components/inventory-bar"

export default function Example() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <InventoryBar available={128} total={200} />
      <InventoryBar available={6} total={200} />
      <InventoryBar available={0} total={200} />
    </div>
  )
}

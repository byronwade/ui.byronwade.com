"use client"

import { OrderSummary } from "@/components/order-summary"

export default function Example() {
  return (
    <OrderSummary
      className="max-w-sm"
      lineItems={[
        {
          id: "tee",
          title: "Heavyweight Cotton Tee",
          variant: "Black / M",
          quantity: 2,
          price: 32,
          image: "https://github.com/shadcn.png",
        },
        {
          id: "cap",
          title: "Embroidered Cap",
          sku: "CAP-001",
          quantity: 1,
          price: 24,
        },
      ]}
      discounts={[{ label: "Welcome offer", code: "WELCOME10", amount: 8.8 }]}
      shipping={5}
      tax={6.32}
    />
  )
}

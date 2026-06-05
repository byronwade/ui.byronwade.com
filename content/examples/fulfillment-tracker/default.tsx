"use client"

import { FulfillmentTracker } from "@/components/fulfillment-tracker"

export default function Example() {
  return (
    <FulfillmentTracker
      paymentStatus="paid"
      fulfillmentStatus="partially_fulfilled"
      steps={[
        {
          label: "Order placed",
          state: "done",
          description: "Payment captured",
          timestamp: "Jun 3, 9:42 AM",
        },
        {
          label: "Packed",
          state: "done",
          description: "2 of 3 items",
          timestamp: "Jun 3, 2:15 PM",
        },
        {
          label: "In transit",
          state: "current",
          description: "Out for delivery",
        },
        {
          label: "Delivered",
          state: "upcoming",
        },
      ]}
    />
  )
}

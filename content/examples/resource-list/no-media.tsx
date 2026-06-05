"use client"

import { ResourceList, ResourceItem } from "@/components/resource-list"

const orders = [
  { id: "1001", title: "#1001", subtitle: "Paid · 3 items", badge: "Sent" },
  {
    id: "1002",
    title: "#1002",
    subtitle: "Pending · 1 item",
    badge: "Unfulfilled",
  },
  {
    id: "1003",
    title: "#1003",
    subtitle: "Refunded · 2 items",
    badge: "Refunded",
  },
]

export default function Example() {
  return (
    <ResourceList className="mx-auto w-full max-w-md">
      {orders.map((order) => (
        <ResourceItem
          key={order.id}
          id={order.id}
          title={order.title}
          subtitle={order.subtitle}
          badges={[{ label: order.badge, variant: "secondary" }]}
          onClick={() => {}}
        />
      ))}
    </ResourceList>
  )
}

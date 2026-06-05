"use client"

import { CustomerCard } from "@/components/customer-card"

export default function Example() {
  return (
    <CustomerCard
      className="max-w-sm"
      name="Maya Hernandez"
      email="maya.hernandez@example.com"
      avatar="https://i.pravatar.cc/80?u=maya-hernandez"
      ordersCount={27}
      totalSpent={4821.5}
      currency="USD"
      locale="en-US"
      location="Austin, United States"
      address={{
        line1: "2417 Guadalupe St",
        line2: "Suite 210",
        city: "Austin",
        region: "TX",
        postalCode: "78705",
        country: "United States",
      }}
    />
  )
}

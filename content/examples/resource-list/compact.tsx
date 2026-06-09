"use client"

import {
  ResourceList,
  ResourceItem,
  type ResourceBadge,
} from "@/components/resource-list"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

type Customer = {
  id: string
  title: string
  subtitle: string
  initials: string
  badges: ResourceBadge[]
}

const customers: Customer[] = [
  {
    id: "ariana",
    title: "Ariana Cole",
    subtitle: "ariana@northwind.test",
    initials: "AC",
    badges: [{ label: "VIP", variant: "success" }],
  },
  {
    id: "devin",
    title: "Devin Park",
    subtitle: "devin@northwind.test",
    initials: "DP",
    badges: [{ label: "New" }],
  },
  {
    id: "mara",
    title: "Mara Lindqvist",
    subtitle: "mara@northwind.test",
    initials: "ML",
    badges: [{ label: "Refunded", variant: "warning" }],
  },
]

export default function Example() {
  return (
    <ResourceList
      className="mx-auto w-full max-w-md"
      density="compact"
      totalCount={customers.length}
    >
      {customers.map((customer) => (
        <ResourceItem
          key={customer.id}
          id={customer.id}
          media={
            <Avatar size="sm">
              <AvatarFallback>{customer.initials}</AvatarFallback>
            </Avatar>
          }
          title={customer.title}
          subtitle={customer.subtitle}
          badges={customer.badges}
          onClick={() => {}}
        />
      ))}
    </ResourceList>
  )
}

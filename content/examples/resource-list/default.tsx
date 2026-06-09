"use client"

import {
  ResourceList,
  ResourceItem,
  type ResourceBadge,
} from "@/components/resource-list"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useDemoState } from "@/lib/demo-viewport"
import {
  DemoEmptyState,
  DemoErrorState,
} from "@/app/(docs)/_components/demo-state-bits"

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
  const state = useDemoState() ?? "default"
  const isLoading = state === "loading"
  const isEmpty = state === "empty"
  const isError = state === "error"

  if (isError) {
    return (
      <div className="mx-auto w-full max-w-md">
        <DemoErrorState>
          Couldn't load customers. Please try again.
        </DemoErrorState>
      </div>
    )
  }

  return (
    <ResourceList
      className="mx-auto w-full max-w-md"
      totalCount={isLoading || isEmpty ? 0 : customers.length}
      loading={isLoading}
      emptyState={
        <DemoEmptyState>
          No customers yet. Add your first customer to get started.
        </DemoEmptyState>
      }
    >
      {!isLoading && !isEmpty
        ? customers.map((customer) => (
            <ResourceItem
              key={customer.id}
              id={customer.id}
              media={
                <Avatar>
                  <AvatarFallback>{customer.initials}</AvatarFallback>
                </Avatar>
              }
              title={customer.title}
              subtitle={customer.subtitle}
              badges={customer.badges}
              onClick={() => {}}
            />
          ))
        : null}
    </ResourceList>
  )
}

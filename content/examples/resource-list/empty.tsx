"use client"

import { Users } from "@/lib/icons"

import { ResourceList } from "@/components/resource-list"
import { EmptyState } from "@/components/empty-state"

export default function Example() {
  return (
    <ResourceList
      className="mx-auto w-full max-w-md"
      emptyState={
        <EmptyState
          icon={Users}
          title="No customers yet"
          description="Customers you add will show up in this list."
          className="border-0"
        />
      }
    >
      {[]}
    </ResourceList>
  )
}

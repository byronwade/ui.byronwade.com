"use client"

import { ResourceList, ResourceItem } from "@/components/resource-list"

export default function Example() {
  return (
    <ResourceList className="mx-auto w-full max-w-md" loading totalCount={3}>
      <ResourceItem id="placeholder" title="Loading" />
    </ResourceList>
  )
}

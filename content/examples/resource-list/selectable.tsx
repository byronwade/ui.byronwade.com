"use client"

import { useState } from "react"
import { Archive, Tag, Trash2 } from "lucide-react"

import { ResourceList, ResourceItem } from "@/components/resource-list"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const customers = [
  {
    id: "ariana",
    title: "Ariana Cole",
    subtitle: "ariana@northwind.test",
    initials: "AC",
  },
  {
    id: "devin",
    title: "Devin Park",
    subtitle: "devin@northwind.test",
    initials: "DP",
  },
  {
    id: "mara",
    title: "Mara Lindqvist",
    subtitle: "mara@northwind.test",
    initials: "ML",
  },
  {
    id: "soren",
    title: "Søren Brandt",
    subtitle: "soren@northwind.test",
    initials: "SB",
  },
]

export default function Example() {
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  return (
    <ResourceList
      className="mx-auto w-full max-w-md"
      selectable
      selectedIds={selectedIds}
      onSelectionChange={setSelectedIds}
      bulkActions={[
        { id: "tag", label: "Add tags", icon: Tag, promoted: true },
        { id: "archive", label: "Archive", icon: Archive },
        { id: "delete", label: "Delete", icon: Trash2, tone: "destructive" },
      ]}
    >
      {customers.map((customer) => (
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
          onClick={() => {}}
        />
      ))}
    </ResourceList>
  )
}

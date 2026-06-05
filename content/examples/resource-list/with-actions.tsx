"use client"

import { Pencil, Trash2 } from "lucide-react"

import { ResourceList, ResourceItem } from "@/components/resource-list"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

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
]

export default function Example() {
  return (
    <ResourceList className="mx-auto w-full max-w-md">
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
          actions={
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon-sm" aria-label="Edit">
                <Pencil />
              </Button>
              <Button variant="ghost" size="icon-sm" aria-label="Delete">
                <Trash2 />
              </Button>
            </div>
          }
        />
      ))}
    </ResourceList>
  )
}

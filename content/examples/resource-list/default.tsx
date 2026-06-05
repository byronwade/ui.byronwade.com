"use client"

import { ResourceList, ResourceItem } from "@/components/resource-list"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function Example() {
  return (
    <ResourceList className="mx-auto w-full max-w-md">
      <ResourceItem
        id="ariana"
        media={
          <Avatar>
            <AvatarFallback>AC</AvatarFallback>
          </Avatar>
        }
        title="Ariana Cole"
        subtitle="ariana@northwind.test"
        badges={[{ label: "VIP", variant: "success" }]}
        onClick={() => {}}
      />
      <ResourceItem
        id="devin"
        media={
          <Avatar>
            <AvatarFallback>DP</AvatarFallback>
          </Avatar>
        }
        title="Devin Park"
        subtitle="devin@northwind.test"
        badges={[{ label: "New" }]}
        onClick={() => {}}
      />
      <ResourceItem
        id="mara"
        media={
          <Avatar>
            <AvatarFallback>ML</AvatarFallback>
          </Avatar>
        }
        title="Mara Lindqvist"
        subtitle="mara@northwind.test"
        badges={[{ label: "Refunded", variant: "warning" }]}
        onClick={() => {}}
      />
    </ResourceList>
  )
}

"use client"

import * as React from "react"
import { Archive, Tag, Trash } from "@/lib/icons"

import { BulkActionBar } from "@/components/ui/bulk-action-bar"

export default function Example() {
  const [selected, setSelected] = React.useState(3)

  return (
    <BulkActionBar
      selectedCount={selected}
      totalCount={12}
      onClearSelection={() => setSelected(0)}
      actions={[
        { label: "Add tags", icon: Tag, promoted: true },
        { label: "Archive", icon: Archive },
        { label: "Delete", icon: Trash, tone: "destructive" },
      ]}
    />
  )
}

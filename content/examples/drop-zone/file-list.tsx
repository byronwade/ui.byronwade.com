"use client"

import { DropZone } from "@/components/ui/drop-zone"

export default function Example() {
  return (
    <DropZone
      variant="list"
      multiple
      label="Drag & drop documents here"
      className="max-w-md"
    />
  )
}

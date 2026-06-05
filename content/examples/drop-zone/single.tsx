"use client"

import { DropZone } from "@/components/ui/drop-zone"

export default function Example() {
  return (
    <DropZone
      accept="image/*"
      label="Drag & drop one image"
      className="max-w-md"
    />
  )
}

"use client"

import { DropZone } from "@/components/ui/drop-zone"

export default function Example() {
  return (
    <DropZone
      accept="image/*"
      multiple
      label="Drag & drop images here"
      className="max-w-md"
    />
  )
}

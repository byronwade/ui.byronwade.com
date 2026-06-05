"use client"

import { DropZone } from "@/components/ui/drop-zone"

export default function Example() {
  return (
    <div className="flex max-w-md flex-col gap-4">
      <DropZone size="sm" label="Small drop zone" />
      <DropZone size="default" label="Default drop zone" />
      <DropZone size="lg" label="Large drop zone" />
    </div>
  )
}

"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "@/lib/icons"

export default function Example() {
  return (
    <div className="flex flex-wrap items-center gap-3 p-6">
      <Button size="icon-sm" aria-label="Add">
        <Plus />
      </Button>
    </div>
  )
}

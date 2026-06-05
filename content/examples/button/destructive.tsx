"use client"

import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

export default function Example() {
  return (
    <div className="flex flex-wrap items-center gap-3 p-6">
      <Button variant="destructive">
        <Trash2 data-icon="inline-start" />
        Delete
      </Button>
    </div>
  )
}

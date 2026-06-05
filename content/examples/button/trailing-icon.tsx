"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function Example() {
  return (
    <div className="flex flex-wrap items-center gap-3 p-6">
      <Button variant="outline">
        Continue
        <ArrowRight data-icon="inline-end" />
      </Button>
    </div>
  )
}

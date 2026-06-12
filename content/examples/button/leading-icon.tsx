"use client"

import { Button } from "@/components/ui/button"
import { DownloadSimple } from "@/lib/icons"

export default function Example() {
  return (
    <div className="flex flex-wrap items-center gap-3 p-6">
      <Button>
        <DownloadSimple data-icon="inline-start" />
        Download
      </Button>
    </div>
  )
}

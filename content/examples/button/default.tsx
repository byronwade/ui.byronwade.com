"use client"

import { Button } from "@/components/ui/button"
import { DownloadSimple, Trash } from "@/lib/icons"

export default function Example() {
  return (
    <div className="flex flex-wrap items-center gap-3 p-6">
      <Button>Save changes</Button>
      <Button variant="outline">Cancel</Button>
      <Button variant="secondary">Export</Button>
      <Button variant="ghost">Learn more</Button>
      <Button variant="destructive">
        <Trash />
        Delete
      </Button>
      <Button variant="link">View docs</Button>
      <Button size="icon" aria-label="Download">
        <DownloadSimple />
      </Button>
      <Button size="sm" variant="outline" onClick={() => alert("Clicked!")}>
        Small
      </Button>
      <Button disabled>Disabled</Button>
    </div>
  )
}

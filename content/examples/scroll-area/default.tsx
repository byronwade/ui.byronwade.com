"use client"

import { ScrollArea } from "@/components/ui/scroll-area"

const tags = Array.from({ length: 24 }, (_, i) => `Tag ${i + 1}`)

export default function Example() {
  return (
    <ScrollArea className="h-48 w-56 rounded-xl edge">
      <div className="space-y-2 p-4">
        {tags.map((tag) => (
          <div key={tag} className="rounded-md edge px-3 py-2 text-sm">
            {tag}
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}

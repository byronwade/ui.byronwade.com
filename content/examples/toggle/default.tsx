"use client"

import { BoldIcon, ItalicIcon, UnderlineIcon } from "lucide-react"
import { Toggle } from "@/components/ui/toggle"

export default function Example() {
  return (
    <div className="flex items-center gap-1">
      <Toggle aria-label="Bold" defaultPressed>
        <BoldIcon />
      </Toggle>
      <Toggle aria-label="Italic">
        <ItalicIcon />
      </Toggle>
      <Toggle aria-label="Underline" variant="outline">
        <UnderlineIcon />
      </Toggle>
    </div>
  )
}

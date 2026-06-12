"use client"

import { TextB, TextItalic, TextUnderline } from "@/lib/icons"
import { Toggle } from "@/components/ui/toggle"

export default function Example() {
  return (
    <div className="flex items-center gap-1">
      <Toggle aria-label="Bold" defaultPressed>
        <TextB />
      </Toggle>
      <Toggle aria-label="Italic">
        <TextItalic />
      </Toggle>
      <Toggle aria-label="Underline" variant="outline">
        <TextUnderline />
      </Toggle>
    </div>
  )
}

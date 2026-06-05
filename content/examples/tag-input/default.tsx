"use client"

import * as React from "react"

import { TagInput } from "@/components/ui/tag-input"

export default function Example() {
  const [tags, setTags] = React.useState(["design", "system"])

  return (
    <div className="flex w-full max-w-sm items-center justify-center p-8">
      <TagInput value={tags} onChange={setTags} placeholder="Add a tag…" />
    </div>
  )
}

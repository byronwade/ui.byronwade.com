"use client"

import * as React from "react"

import { TagInput } from "@/components/ui/tag-input"

const FRAMEWORKS = [
  "Next.js",
  "Remix",
  "Astro",
  "SvelteKit",
  "Nuxt",
  "SolidStart",
]

export default function Example() {
  const [tags, setTags] = React.useState(["Next.js"])

  return (
    <div className="flex w-full max-w-sm items-center justify-center p-8">
      <TagInput
        value={tags}
        onChange={setTags}
        suggestions={FRAMEWORKS}
        placeholder="Search frameworks…"
      />
    </div>
  )
}

"use client"

import { Badge } from "@/components/ui/badge"
import { ShortsPlayer } from "@/components/shorts-player"

export default function Example() {
  return (
    <div className="flex justify-center">
      <ShortsPlayer
        variant="preview"
        density="compact"
        rail="hidden"
        width={240}
        posterSrc="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=540&h=960&fit=crop"
        progress={72}
        author={{ name: "Field Notes", handle: "@fieldnotes", verified: true }}
        status={<Badge variant="secondary">Preview</Badge>}
        caption="A compact Shorts preview without the engagement rail."
        captionMode="clamped"
        authorAction={<Badge variant="outline">Following</Badge>}
      />
    </div>
  )
}

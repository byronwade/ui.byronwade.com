"use client"

import { CircleNotch, Sparkle } from "@/lib/icons"
import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker"

export default function Example() {
  return (
    <div className="mx-auto w-full max-w-md space-y-4">
      <Marker>
        <MarkerIcon>
          <CircleNotch className="animate-spin" />
        </MarkerIcon>
        <MarkerContent className="shimmer">Generating response…</MarkerContent>
      </Marker>

      <Marker variant="separator">
        <MarkerContent>March 12, 2026</MarkerContent>
      </Marker>

      <Marker variant="border">
        <MarkerIcon>
          <Sparkle />
        </MarkerIcon>
        <MarkerContent>Tool call · search_docs completed</MarkerContent>
      </Marker>
    </div>
  )
}

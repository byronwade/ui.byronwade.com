"use client"

import { SkipForward } from "lucide-react"

import { Button } from "@/components/ui/button"
import { MiniPlayer } from "@/components/mini-player"

export default function Example() {
  return (
    <div className="w-[360px]">
      <MiniPlayer
        variant="dock"
        size="sm"
        state="collapsed"
        title="Token-driven video surfaces"
        subtitle="Queue item 2 of 6"
        posterSrc="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=640&q=80"
        progress={54}
        playbackLabel="dock preview"
        actions={
          <Button variant="ghost" size="icon-sm" aria-label="Skip">
            <SkipForward />
          </Button>
        }
      />
    </div>
  )
}

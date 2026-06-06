"use client"

import { ListMusic } from "lucide-react"

import { Button } from "@/components/ui/button"
import { MiniPlayer } from "@/components/mini-player"

export default function Example() {
  return (
    <div className="w-[520px]">
      <MiniPlayer
        variant="inline"
        size="lg"
        state="expanded"
        title="Building a design system from scratch"
        subtitle="Continue watching"
        queueLabel="Workshop playlist"
        metadata="byronwade · 42% watched · Up next: accessibility passes"
        posterSrc="https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=720&q=80"
        progress={42}
        actions={
          <Button variant="outline" size="sm">
            <ListMusic />
            Queue
          </Button>
        }
      />
    </div>
  )
}

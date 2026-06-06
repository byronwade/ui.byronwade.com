"use client"

import { MiniPlayer } from "@/components/mini-player"

export default function Example() {
  return (
    <div className="w-[320px]">
      <MiniPlayer
        title="Building a design system from scratch, tokens, primitives, and composites"
        subtitle="Continue watching · byronwade"
        posterSrc="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=640&q=80"
        progress={42}
        href="#"
        onClose={() => {}}
      />
    </div>
  )
}

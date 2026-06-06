"use client"

import { MiniPlayer } from "@/components/mini-player"

const SRC =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"

export default function Example() {
  return (
    <div className="w-[320px]">
      <MiniPlayer
        title="Building a design system from scratch, tokens, primitives, and composites"
        subtitle="Continue watching · byronwade"
        src={SRC}
        posterSrc="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=640&q=80"
        progress={42}
        href="#"
        onClose={() => {}}
      />
    </div>
  )
}

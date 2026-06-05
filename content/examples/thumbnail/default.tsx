"use client"

import { Thumbnail } from "@/components/ui/thumbnail"

const SRC =
  "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=640&q=80"

export default function Example() {
  return (
    <div className="flex w-[320px] flex-col gap-4 p-4">
      <Thumbnail
        src={SRC}
        alt="Building a synthesizer from scratch"
        duration="12:34"
        progress={42}
      />
      <Thumbnail alt="Untitled draft" duration="03:08" />
      <Thumbnail src={SRC} alt="Launch keynote" live />
    </div>
  )
}

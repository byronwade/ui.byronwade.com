"use client"

import { Lyrics } from "@/components/ui/lyrics"

const LINES = [
  { text: "We were the embers of a fading light" },
  { text: "Chasing the morning through the longest night" },
  { text: "Every horizon a line we'd cross" },
  { text: "Counting the cities in the afterglow" },
  { text: "Holding the silence we were scared to know" },
  { text: "Now I can hear it in the quiet" },
]

export default function Example() {
  return (
    <div className="w-full max-w-md p-8">
      <Lyrics lines={LINES} activeIndex={2} onLineClick={() => {}} />
    </div>
  )
}

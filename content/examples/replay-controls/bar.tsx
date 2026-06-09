"use client"

import { useState } from "react"

import { ReplayControls } from "@/components/replay-controls"

export default function Example() {
  const [playing, setPlaying] = useState(false)
  const [position, setPosition] = useState(48)

  return (
    <div className="flex h-10 w-full max-w-xl items-center rounded-lg edge bg-card/80 px-3">
      <ReplayControls
        variant="bar"
        showSlider={false}
        playing={playing}
        onPlayingChange={setPlaying}
        position={position}
        duration={71}
        onStepBack={() => setPosition((current) => Math.max(0, current - 1))}
        onStepForward={() =>
          setPosition((current) => Math.min(71, current + 1))
        }
      />
    </div>
  )
}

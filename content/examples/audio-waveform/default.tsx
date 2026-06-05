"use client"

import * as React from "react"

import { AudioWaveform } from "@/components/ui/audio-waveform"

const PEAKS = [
  0.2, 0.4, 0.7, 1, 0.8, 0.5, 0.3, 0.6, 0.9, 0.7, 0.4, 0.2, 0.5, 0.8, 1, 0.6,
  0.3, 0.5, 0.7, 0.4, 0.2, 0.6, 0.9, 0.5,
]

export default function Example() {
  const [progress, setProgress] = React.useState(0.4)
  return (
    <div className="w-full max-w-md p-8">
      <AudioWaveform peaks={PEAKS} progress={progress} onSeek={setProgress} />
    </div>
  )
}

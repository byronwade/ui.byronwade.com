"use client"

import * as React from "react"

import { PlaybackMenu } from "@/components/playback-menu"

export default function Example() {
  const [quality, setQuality] = React.useState("auto")
  const [speed, setSpeed] = React.useState("1")
  const [subtitles, setSubtitles] = React.useState("off")

  return (
    <div className="flex justify-center p-8">
      <PlaybackMenu
        settings={[
          {
            key: "quality",
            label: "Quality",
            value: quality,
            onValueChange: setQuality,
            options: [
              { label: "Auto", value: "auto" },
              { label: "1080p", value: "1080" },
              { label: "720p", value: "720" },
              { label: "480p", value: "480" },
            ],
          },
          {
            key: "speed",
            label: "Playback speed",
            value: speed,
            onValueChange: setSpeed,
            options: [
              { label: "0.5", value: "0.5" },
              { label: "Normal", value: "1" },
              { label: "1.5", value: "1.5" },
              { label: "2", value: "2" },
            ],
          },
          {
            key: "subtitles",
            label: "Subtitles",
            value: subtitles,
            onValueChange: setSubtitles,
            options: [
              { label: "Off", value: "off" },
              { label: "English", value: "en" },
            ],
          },
        ]}
      />
    </div>
  )
}

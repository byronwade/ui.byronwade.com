"use client"

import * as React from "react"

import {
  NowPlayingBar,
  NowPlayingBarControls,
  NowPlayingBarExtras,
  NowPlayingBarProgress,
  NowPlayingBarTrack,
} from "@/components/ui/now-playing-bar"

const COVER =
  "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&q=80"

export default function Example() {
  const [isPlaying, setIsPlaying] = React.useState(true)
  const [liked, setLiked] = React.useState(false)
  const [progress, setProgress] = React.useState(72)
  const [volume, setVolume] = React.useState(70)

  return (
    <div className="w-full max-w-3xl p-4">
      <NowPlayingBar className="rounded-xl edge">
        <NowPlayingBarTrack
          src={COVER}
          title="Lost in the Echo"
          artist="Aurora Skies"
          liked={liked}
          onLikeToggle={() => setLiked((value) => !value)}
        />
        <div className="flex flex-[2] flex-col items-center gap-1">
          <NowPlayingBarControls
            isPlaying={isPlaying}
            onPlayPause={() => setIsPlaying((value) => !value)}
          />
          <NowPlayingBarProgress
            progress={progress}
            duration={204}
            onSeek={setProgress}
          />
        </div>
        <NowPlayingBarExtras volume={volume} onVolumeChange={setVolume} />
      </NowPlayingBar>
    </div>
  )
}

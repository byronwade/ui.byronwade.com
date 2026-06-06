"use client"

import { MediaPlayer } from "@/components/ui/video-player"

const SRC =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"

export default function Example() {
  return (
    <div className="w-full max-w-4xl p-6">
      <MediaPlayer
        src={SRC}
        poster="https://placehold.co/1280x720/png"
        ambient
        resumeKey="bbb-demo"
        onNext={() => {}}
        chapters={[
          { startTime: 0, title: "Intro" },
          { startTime: 4, title: "The meadow" },
          { startTime: 8, title: "Finale" },
        ]}
        heatmap={[2, 4, 7, 9, 6, 3, 5, 8, 10, 7, 4, 2]}
        next={{
          title: "Up next: Sintel",
          thumbnail: "https://placehold.co/320x180/png",
        }}
        countdownSeconds={5}
      />
    </div>
  )
}

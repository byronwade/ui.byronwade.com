import { MediaPlayer } from "@/components/ui/video-player"

export default function Example() {
  return (
    <div className="w-full max-w-2xl p-8">
      <MediaPlayer
        src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
        title="Big Buck Bunny"
        chapters={[
          { startTime: 0, title: "Intro" },
          { startTime: 4, title: "The meadow" },
          { startTime: 8, title: "Finale" },
        ]}
        heatmap={[2, 4, 7, 9, 6, 3, 5, 8, 10, 7, 4, 2]}
      />
    </div>
  )
}

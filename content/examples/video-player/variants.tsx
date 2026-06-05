import {
  VideoPlayer,
  VideoPlayerContent,
  VideoPlayerControlBar,
  VideoPlayerMuteButton,
  VideoPlayerPlayButton,
  VideoPlayerPoster,
  VideoPlayerSeekBackwardButton,
  VideoPlayerSeekForwardButton,
  VideoPlayerTimeDisplay,
  VideoPlayerTimeRange,
  VideoPlayerVolumeRange,
} from "@/components/ui/video-player"

const SRC = "https://www.w3schools.com/html/mov_bbb.mp4"

const VARIANTS = ["default", "minimal", "theater"] as const

export default function Example() {
  return (
    <div className="flex w-full max-w-xl flex-col gap-8 p-6">
      {VARIANTS.map((variant) => (
        <div key={variant} className="flex flex-col gap-2">
          <span className="font-mono text-xs text-muted-foreground">
            {variant}
          </span>
          <VideoPlayer variant={variant}>
            <VideoPlayerContent slot="media" src={SRC} preload="metadata" />
            <VideoPlayerControlBar>
              <VideoPlayerPlayButton />
              <VideoPlayerSeekBackwardButton />
              <VideoPlayerSeekForwardButton />
              <VideoPlayerTimeRange />
              <VideoPlayerTimeDisplay showDuration />
              <VideoPlayerMuteButton />
              <VideoPlayerVolumeRange />
            </VideoPlayerControlBar>
          </VideoPlayer>
        </div>
      ))}

      <div className="flex flex-col gap-2">
        <span className="font-mono text-xs text-muted-foreground">poster</span>
        <VideoPlayer variant="poster">
          <VideoPlayerContent slot="media" src={SRC} preload="metadata" />
          <VideoPlayerPoster src="https://placehold.co/640x360/png" />
          <VideoPlayerControlBar>
            <VideoPlayerPlayButton />
            <VideoPlayerSeekBackwardButton />
            <VideoPlayerSeekForwardButton />
            <VideoPlayerTimeRange />
            <VideoPlayerTimeDisplay showDuration />
            <VideoPlayerMuteButton />
            <VideoPlayerVolumeRange />
          </VideoPlayerControlBar>
        </VideoPlayer>
      </div>
    </div>
  )
}

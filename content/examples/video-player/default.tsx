import {
  VideoPlayer,
  VideoPlayerContent,
  VideoPlayerControlBar,
  VideoPlayerMuteButton,
  VideoPlayerPlayButton,
  VideoPlayerSeekBackwardButton,
  VideoPlayerSeekForwardButton,
  VideoPlayerTimeDisplay,
  VideoPlayerTimeRange,
  VideoPlayerVolumeRange,
} from "@/components/ui/video-player"

export default function Example() {
  return (
    <div className="w-full max-w-xl p-8">
      <VideoPlayer variant="default">
        <VideoPlayerContent
          slot="media"
          src="https://www.w3schools.com/html/mov_bbb.mp4"
          preload="metadata"
        />
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
  )
}

import {
  AudioPlayer,
  AudioPlayerContent,
  AudioPlayerControlBar,
  AudioPlayerMuteButton,
  AudioPlayerPlayButton,
  AudioPlayerSeekBackwardButton,
  AudioPlayerSeekForwardButton,
  AudioPlayerTimeDisplay,
  AudioPlayerTimeRange,
  AudioPlayerVolumeRange,
} from "@/components/ui/audio-player"

export default function Example() {
  return (
    <div className="w-full max-w-xl p-8">
      <AudioPlayer variant="default">
        <AudioPlayerContent
          src="https://www.w3schools.com/html/horse.mp3"
          preload="metadata"
        />
        <AudioPlayerControlBar>
          <AudioPlayerPlayButton />
          <AudioPlayerSeekBackwardButton />
          <AudioPlayerSeekForwardButton />
          <AudioPlayerTimeRange />
          <AudioPlayerTimeDisplay showDuration />
          <AudioPlayerMuteButton />
          <AudioPlayerVolumeRange />
        </AudioPlayerControlBar>
      </AudioPlayer>
    </div>
  )
}

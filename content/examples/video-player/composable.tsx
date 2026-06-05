import {
  VideoPlayer,
  VideoPlayerCaptionsButton,
  VideoPlayerContent,
  VideoPlayerControlBar,
  VideoPlayerDurationDisplay,
  VideoPlayerFullscreenButton,
  VideoPlayerMuteButton,
  VideoPlayerPipButton,
  VideoPlayerPlayButton,
  VideoPlayerSeekBackwardButton,
  VideoPlayerSeekForwardButton,
  VideoPlayerSettingsMenu,
  VideoPlayerSettingsMenuButton,
  VideoPlayerSettingsMenuItem,
  VideoPlayerPlaybackRateMenu,
  VideoPlayerSpacer,
  VideoPlayerTimeDisplay,
  VideoPlayerTimeRange,
  VideoPlayerVolumeRange,
} from "@/components/ui/video-player"

const SRC =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"

export default function Example() {
  return (
    <div className="w-full max-w-2xl p-6">
      <VideoPlayer variant="youtube">
        <VideoPlayerContent slot="media" src={SRC} preload="metadata" />
        <VideoPlayerControlBar>
          <VideoPlayerPlayButton />
          <VideoPlayerSeekBackwardButton />
          <VideoPlayerSeekForwardButton />
          <VideoPlayerMuteButton />
          <VideoPlayerVolumeRange />
          <VideoPlayerTimeRange />
          <VideoPlayerTimeDisplay />
          <span className="px-1 text-sm text-muted-foreground">/</span>
          <VideoPlayerDurationDisplay />
          <VideoPlayerSpacer />
          <VideoPlayerCaptionsButton />
          <VideoPlayerSettingsMenuButton />
          <VideoPlayerPipButton />
          <VideoPlayerFullscreenButton />
        </VideoPlayerControlBar>
        <VideoPlayerSettingsMenu hidden anchor="auto">
          <VideoPlayerSettingsMenuItem>
            Speed
            <VideoPlayerPlaybackRateMenu slot="submenu" hidden>
              <div slot="header">Speed</div>
            </VideoPlayerPlaybackRateMenu>
          </VideoPlayerSettingsMenuItem>
        </VideoPlayerSettingsMenu>
      </VideoPlayer>
    </div>
  )
}

import { ChannelHeader } from "@/components/channel-header"
import { Comment } from "@/components/comment"
import { DescriptionBox } from "@/components/description-box"
import { VideoCard } from "@/components/video-card"
import { VideoShelf } from "@/components/video-shelf"

const RELATED = [
  "Token-only theming in production",
  "Composable video primitives",
  "Accessible media chrome patterns",
  "Building a registry-backed design system",
]

export default function Example() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-4">
      <VideoCard
        title="Building a YouTube-grade player on design tokens"
        thumbnailSrc="https://picsum.photos/seed/watch-page/1280/720"
        duration="18:42"
        views={284000}
        timestamp="2 days ago"
        channelName="byronwade/ui"
        verified
        className="w-full"
      />
      <ChannelHeader
        name="byronwade/ui"
        verified
        subscriberCount={128000}
        defaultSubscribed={false}
      />
      <DescriptionBox views={284000} timestamp="2 days ago">
        A walkthrough of the media player preset — settings menu, chapters,
        heatmap, ambient glow, and resume behavior — all on semantic tokens.
      </DescriptionBox>
      <Comment
        author="Maya Chen"
        text="The ambient layer mirroring video pixels instead of authored color is a great detail."
        likeCount={42}
        timestamp="1 day ago"
      />
      <VideoShelf title="Up next">
        {RELATED.map((title, i) => (
          <VideoCard
            key={title}
            title={title}
            thumbnailSrc={`https://picsum.photos/seed/watch-related-${i}/640/360`}
            duration="11:20"
            views={90000 + i * 12000}
            timestamp={`${i + 3} days ago`}
            channelName="byronwade/ui"
            verified
            className="w-[320px]"
          />
        ))}
      </VideoShelf>
    </div>
  )
}

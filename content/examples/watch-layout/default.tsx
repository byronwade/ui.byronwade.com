"use client"

import * as React from "react"

import { ChannelByline } from "@/components/channel-byline"
import { ChipBar } from "@/components/ui/chip-bar"
import { Comment } from "@/components/comment"
import { DescriptionBox } from "@/components/description-box"
import { EngagementBar } from "@/components/engagement-bar"
import { UpNextItem } from "@/components/up-next-item"
import { WatchLayout, WatchLayoutTitle } from "@/components/watch-layout"
import { WatchMetaBar } from "@/components/watch-meta-bar"
import { MediaPlayer } from "@/components/ui/video-player"

const SRC =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"

const PREVIEW =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"

const UP_NEXT = [
  {
    title: "Token-only theming in production",
    channel: "byronwade/ui",
    views: 284000,
    timestamp: "2 days ago",
    seed: "related-1",
  },
  {
    title: "Composable video primitives",
    channel: "byronwade/ui",
    views: 120000,
    timestamp: "1 week ago",
    seed: "related-2",
  },
  {
    title: "Accessible media chrome patterns",
    channel: "byronwade/ui",
    views: 88000,
    timestamp: "2 weeks ago",
    seed: "related-3",
  },
]

export default function Example() {
  const [liked, setLiked] = React.useState(false)
  const [disliked, setDisliked] = React.useState(false)
  const [saved, setSaved] = React.useState(false)
  const [subscribed, setSubscribed] = React.useState(true)
  const [filter, setFilter] = React.useState("all")

  return (
    <WatchLayout
      player={
        <MediaPlayer
          src={SRC}
          poster="https://picsum.photos/seed/watch-main/1280/720"
          resumeKey="watch-layout-demo"
          heatmap={[2, 5, 8, 10, 7, 4, 6, 9, 8, 5, 3, 2]}
          onNext={() => {}}
        />
      }
      title={
        <WatchLayoutTitle>
          Building a YouTube-grade player on design tokens
        </WatchLayoutTitle>
      }
      meta={
        <WatchMetaBar
          channel={
            <ChannelByline
              name="byronwade/ui"
              verified
              subscriberCount={128000}
              subscribed={subscribed}
              onSubscribedChange={setSubscribed}
            />
          }
          engagement={
            <EngagementBar
              liked={liked}
              onLikedChange={setLiked}
              disliked={disliked}
              onDislikedChange={setDisliked}
              likeCount={88000}
              onShare={() => {}}
              saved={saved}
              onSavedChange={setSaved}
              onClip={() => {}}
              onRemix={() => {}}
            />
          }
        />
      }
      description={
        <DescriptionBox
          views={284000}
          timestamp="2 days ago"
          tags={["design-system", "video", "tokens"]}
        >
          A walkthrough of the media player preset — settings menu, chapters,
          heatmap, theater mode, and resume behavior — all on semantic tokens
          with no raw color.
        </DescriptionBox>
      }
      below={
        <Comment
          author="Maya Chen"
          text="Theater mode narrowing the stage while keeping the sidebar fixed is a nice touch."
          likeCount={42}
          timestamp="1 day ago"
        />
      }
      sidebar={
        <>
          <ChipBar
            items={[
              { value: "all", label: "All" },
              { value: "channel", label: "From byronwade/ui" },
              { value: "design", label: "Design systems" },
              { value: "media", label: "Media" },
            ]}
            value={filter}
            onValueChange={setFilter}
          />
          <div className="flex flex-col gap-2">
            {UP_NEXT.map((item, index) => (
              <UpNextItem
                key={item.title}
                title={item.title}
                href="#"
                thumbnailSrc={`https://picsum.photos/seed/${item.seed}/640/360`}
                previewSrc={PREVIEW}
                duration="11:20"
                channelName={item.channel}
                verified
                views={item.views}
                timestamp={item.timestamp}
                active={index === 0}
              />
            ))}
          </div>
        </>
      }
    />
  )
}

import { TimelineRail } from "@/components/timeline-rail"
import { Cursor, DownloadSimple, Eye, ShareNetwork, Star } from "@/lib/icons"

export default function Example() {
  return (
    <div className="max-w-xs p-6">
      <TimelineRail
        groups={[
          {
            label: "Activity",
            items: [
              {
                glyph: <Eye className="size-4" />,
                title: "Page viewed",
                meta: "5m",
              },
              {
                glyph: <Cursor className="size-4" />,
                title: "Button clicked",
                meta: "3m",
              },
              {
                glyph: <Star className="size-4" />,
                title: "Item starred",
                meta: "2m",
              },
              {
                glyph: <DownloadSimple className="size-4" />,
                title: "File downloaded",
                meta: "1m",
              },
              {
                glyph: <ShareNetwork className="size-4" />,
                title: "Link shared",
                meta: "30s",
              },
            ],
          },
        ]}
      />
    </div>
  )
}

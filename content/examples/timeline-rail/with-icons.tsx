import { TimelineRail } from "@/components/timeline-rail";
import { Eye, MousePointer, Star, Download, Share2 } from "lucide-react";

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
                glyph: <MousePointer className="size-4" />,
                title: "Button clicked",
                meta: "3m",
              },
              {
                glyph: <Star className="size-4" />,
                title: "Item starred",
                meta: "2m",
              },
              {
                glyph: <Download className="size-4" />,
                title: "File downloaded",
                meta: "1m",
              },
              {
                glyph: <Share2 className="size-4" />,
                title: "Link shared",
                meta: "30s",
              },
            ],
          },
        ]}
      />
    </div>
  );
}

"use client"

import { ChapterList } from "@/components/chapter-list"

export default function Example() {
  return (
    <div className="w-[420px]">
      <ChapterList
        defaultActiveIndex={1}
        chapters={[
          {
            title: "Intro & what we're building",
            start: 0,
            thumbnailSrc:
              "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=240&q=80",
          },
          {
            title: "Setting up the design tokens",
            start: 95,
            thumbnailSrc:
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=240&q=80",
          },
          {
            title: "Authoring the first primitive",
            start: 312,
            thumbnailSrc:
              "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=240&q=80",
          },
          {
            title: "Composing a pattern from primitives",
            start: 728,
            thumbnailSrc:
              "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=240&q=80",
          },
          {
            title: "Wrap-up & next steps",
            start: 3725,
            thumbnailSrc:
              "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=240&q=80",
          },
        ]}
      />
    </div>
  )
}

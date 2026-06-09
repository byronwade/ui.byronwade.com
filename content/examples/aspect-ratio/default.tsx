"use client"

import { AspectRatio } from "@/components/ui/aspect-ratio"

export default function Example() {
  return (
    <div className="w-72">
      <AspectRatio
        ratio={16 / 9}
        className="overflow-hidden rounded-xl edge bg-muted"
      >
        <div className="flex size-full items-center justify-center text-sm text-muted-foreground">
          16:9
        </div>
      </AspectRatio>
    </div>
  )
}

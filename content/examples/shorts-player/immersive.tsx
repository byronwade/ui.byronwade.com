"use client"

import { SpeakerHigh } from "@/lib/icons"

import { Button } from "@/components/ui/button"
import { ShortsPlayer } from "@/components/shorts-player"

export default function Example() {
  return (
    <div className="flex justify-center">
      <ShortsPlayer
        variant="immersive"
        rail="left"
        width={360}
        posterSrc="https://images.unsplash.com/photo-1519681393784-d120267933ba?w=720&h=1280&fit=crop"
        author={{ name: "Night Lab", handle: "@nightlab" }}
        caption="An edge-to-edge Shorts treatment with actions on the left and expanded caption copy for demos."
        captionMode="expanded"
        topActions={
          <Button variant="ghost" size="icon-sm" aria-label="Audio">
            <SpeakerHigh />
          </Button>
        }
      />
    </div>
  )
}

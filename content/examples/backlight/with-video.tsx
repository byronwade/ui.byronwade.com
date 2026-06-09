import { Backlight } from "@/components/ui/backlight"

export default function Example() {
  return (
    <div className="flex items-center justify-center p-16">
      <Backlight blur={32}>
        {/* The glow is a saturated, blurred copy of the video's own frames, so it
            shifts colour in real time as the footage plays. */}
        <video
          className="w-80 rounded-3xl edge"
          src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          poster="https://images.unsplash.com/photo-1502790671504-542ad42d5189?w=640&q=80"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
        />
      </Backlight>
    </div>
  )
}

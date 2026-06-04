import { Backlight } from "@/components/ui/backlight";

export default function Example() {
  return (
    <div className="flex items-center justify-center p-12">
      <Backlight blur={28}>
        {/* The glow is a saturated, blurred copy of the video's own frames, so it
            shifts color in real time as the footage plays. */}
        <video
          className="w-72 rounded-2xl"
          src="https://www.w3schools.com/html/mov_bbb.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
        />
      </Backlight>
    </div>
  );
}

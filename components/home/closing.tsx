import { ArrowRight } from "lucide-react"
import { Stage } from "@/components/cinematic/stage"
import { BleedImage } from "@/components/cinematic/bleed-image"
import { Button } from "@/components/ui/button"
import { cinemaStills } from "@/lib/media"
import { designCn, typeClass } from "@/lib/design"

function Closing() {
  return (
    <Stage
      tone="theater"
      fullBleed
      className="relative justify-end px-5 py-24 md:px-8 md:py-32"
    >
      <BleedImage
        src={cinemaStills.closing.src}
        alt={cinemaStills.closing.alt}
      />
      <div className="relative z-10 mx-auto max-w-2xl text-center">
        <p className={designCn(typeClass("label"), "text-brand")}>Meridian</p>
        <h2
          className={designCn(
            typeClass("display"),
            "mt-5 text-[clamp(2.25rem,6vw,3.75rem)] text-dock-foreground",
          )}
        >
          Full bleed.
          <br />
          Soft structure.
        </h2>
        <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-dock-foreground/70">
          Warm neutrals. One deep accent. Typed so agents stay on-theme —
          creative where the story lives.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Button variant="theater" size="pill" asChild>
            <a href="/theme">
              Theme
              <ArrowRight data-icon="inline-end" />
            </a>
          </Button>
          <Button variant="theater-outline" size="pill" asChild>
            <a href="/for-agents">For agents</a>
          </Button>
        </div>
      </div>
    </Stage>
  )
}

export { Closing }

import { ArrowRight } from "lucide-react"
import { Stage } from "@/components/cinematic/stage"
import { MediaPlane } from "@/components/cinematic/media-plane"
import { Button } from "@/components/ui/button"
import { designCn, typeClass } from "@/lib/design"

function Closing() {
  return (
    <Stage tone="theater" className="relative px-5 py-28 md:px-8 md:py-36">
      <MediaPlane />
      <div className="relative z-10 mx-auto max-w-2xl text-center">
        <p className={designCn(typeClass("label"), "text-brand")}>Meridian</p>
        <h2
          className={designCn(
            typeClass("display"),
            "mt-5 text-[clamp(2.25rem,6vw,4rem)] text-dock-foreground",
          )}
        >
          Cinematic design.
          <br />
          Impossible to fake off-system.
        </h2>
        <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-dock-foreground/60">
          Fetch the contract. Import the grammar. Compose a whole. Creativity
          without drift.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Button variant="theater" size="pill" asChild>
            <a href="/design.md">
              design.md
              <ArrowRight data-icon="inline-end" />
            </a>
          </Button>
          <Button variant="theater-outline" size="pill" asChild>
            <a href="/theme">Theme grammar</a>
          </Button>
        </div>
      </div>
    </Stage>
  )
}

export { Closing }

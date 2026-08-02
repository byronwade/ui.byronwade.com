import { ArrowRight } from "lucide-react"
import { Stage } from "@/components/cinematic/stage"
import { MediaPlane } from "@/components/cinematic/media-plane"
import { Workbench } from "@/components/surfaces/workbench"
import { Button } from "@/components/ui/button"
import { designCn, typeClass } from "@/lib/design"

function Hero() {
  return (
    <Stage
      tone="theater"
      fullBleed
      className="justify-end pb-12 md:justify-center md:pb-0"
    >
      <MediaPlane />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl gap-10 px-5 pt-24 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] md:items-center md:gap-14 md:px-8 md:pt-28">
        <div>
          <p className={designCn(typeClass("label"), "text-brand")}>
            Meridian · cinematic design
          </p>
          <h1
            className={designCn(
              typeClass("display"),
              "mt-5 text-[clamp(2.75rem,8vw,5.25rem)] text-dock-foreground",
            )}
          >
            Typed for agents.
            <br />
            Staged like film.
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed tracking-tight text-dock-foreground/70 md:text-lg">
            A closed TypeScript grammar stops design drift. Creative freedom
            stays in the story, the sequence, and the product — never in rogue
            colors or shadows.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button variant="theater" size="pill" asChild>
              <a href="/theme">
                See the grammar
                <ArrowRight data-icon="inline-end" />
              </a>
            </Button>
            <Button variant="theater-outline" size="pill" asChild>
              <a href="/for-agents">For agents</a>
            </Button>
          </div>
        </div>

        <div className="relative hidden md:block" aria-hidden>
          <div className="absolute -inset-4 rounded-[1.5rem] bg-dock-foreground/[0.04]" />
          <Workbench className="pointer-events-none relative h-[24rem] shadow-none lg:h-[28rem]" />
        </div>
      </div>
    </Stage>
  )
}

export { Hero }

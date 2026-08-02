import { ArrowRight } from "lucide-react"
import { Stage } from "@/components/cinematic/stage"
import { BleedImage } from "@/components/cinematic/bleed-image"
import { Button } from "@/components/ui/button"
import { cinemaStills } from "@/lib/media"
import { designCn, typeClass } from "@/lib/design"

function Hero() {
  return (
    <Stage
      tone="theater"
      fullBleed
      className="justify-end pb-14 md:pb-20"
    >
      <BleedImage
        src={cinemaStills.hero.src}
        alt={cinemaStills.hero.alt}
        priority
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 md:px-8">
        <div className="max-w-xl">
          <p className={designCn(typeClass("label"), "text-brand")}>
            Meridian · cinematic design
          </p>
          <h1
            className={designCn(
              typeClass("display"),
              "mt-5 text-[clamp(2.75rem,8vw,5rem)] text-dock-foreground",
            )}
          >
            Soft neutrals.
            <br />
            One clear accent.
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed tracking-tight text-dock-foreground/75 md:text-lg">
            Full-bleed frames. Structured reading. Crisp chrome on warm stone —
            never pure white, never pure black, never bright noise.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button variant="theater" size="pill" asChild>
              <a href="#reading">
                Read the system
                <ArrowRight data-icon="inline-end" />
              </a>
            </Button>
            <Button variant="theater-outline" size="pill" asChild>
              <a href="/theme">Theme</a>
            </Button>
          </div>
        </div>
      </div>
    </Stage>
  )
}

export { Hero }

import { CinemaTile, CinemaLink } from "@/components/cinematic/tile"
import { cinemaStills } from "@/lib/media"

function Hero() {
  return (
    <CinemaTile
      tone="theater"
      align="center"
      image={{
        src: cinemaStills.hero.src,
        alt: cinemaStills.hero.alt,
        veil: "soft",
        priority: true,
        objectPosition: "center 40%",
      }}
    >
      <p className="text-[21px] font-medium tracking-tight text-dock-foreground">
        Meridian
      </p>
      <h1 className="mt-2 text-[clamp(2.75rem,7.5vw,5.5rem)] font-medium leading-[1.05] tracking-[-0.045em] text-dock-foreground">
        Designed to be seen.
      </h1>
      <p className="mx-auto mt-4 max-w-md text-[19px] leading-snug tracking-tight text-dock-foreground/70 md:text-[21px]">
        A cinematic theme for product UI — soft neutrals, one accent, full
        bleed.
      </p>
      <div className="mt-7 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
        <CinemaLink href="#craft" className="text-dock-foreground">
          Learn more
        </CinemaLink>
        <CinemaLink href="/theme" className="text-dock-foreground">
          View theme
        </CinemaLink>
      </div>
    </CinemaTile>
  )
}

export { Hero }

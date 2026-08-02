import { CinemaTile, CinemaLink } from "@/components/cinematic/tile"
import { cinemaStills } from "@/lib/media"

function TileCraft() {
  return (
    <CinemaTile
      id="craft"
      tone="paper"
      align="center"
      image={{
        src: cinemaStills.craft.src,
        alt: cinemaStills.craft.alt,
        veil: "top",
        objectPosition: "center 55%",
      }}
    >
      <p className="text-[21px] font-medium tracking-tight text-foreground">
        Neutrals
      </p>
      <h2 className="mt-2 text-[clamp(2.25rem,6vw,4.25rem)] font-medium leading-[1.06] tracking-[-0.04em] text-foreground">
        Warm. Quiet. Exact.
      </h2>
      <p className="mx-auto mt-4 max-w-sm text-[19px] leading-snug tracking-tight text-muted-foreground md:text-[21px]">
        Soft stone paper. Soft charcoal type. Never pure white. Never pure
        black.
      </p>
      <div className="mt-7 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
        <CinemaLink href="/theme">Explore knobs</CinemaLink>
        <CinemaLink href="#focus">Continue</CinemaLink>
      </div>
    </CinemaTile>
  )
}

export { TileCraft }

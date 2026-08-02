import { CinemaTile, CinemaLink } from "@/components/cinematic/tile"

/**
 * Type-only paper tile — Apple air. The space is the craft.
 */
function TileCraft() {
  return (
    <CinemaTile id="craft" tone="paper" align="center">
      <p className="text-[19px] font-medium tracking-tight text-brand md:text-[21px]">
        Neutrals
      </p>
      <h2 className="cinema-title mt-3 text-foreground">Warm. Quiet. Exact.</h2>
      <p className="cinema-lede mx-auto mt-5 max-w-sm text-muted-foreground">
        Soft stone paper. Soft charcoal type. Never pure white. Never pure
        black.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
        <CinemaLink href="/theme">Explore knobs</CinemaLink>
        <CinemaLink href="#product">Continue</CinemaLink>
      </div>
    </CinemaTile>
  )
}

export { TileCraft }

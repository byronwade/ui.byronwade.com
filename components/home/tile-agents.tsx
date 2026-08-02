import { CinemaTile, CinemaLink } from "@/components/cinematic/tile"

/**
 * Quiet parchment beat — type and air only, between product stages.
 */
function TileAgents() {
  return (
    <CinemaTile id="agents" tone="paper" align="center">
      <p className="text-[19px] font-medium tracking-tight text-brand md:text-[21px]">
        For agents
      </p>
      <h2 className="cinema-title mt-3 text-foreground">
        Typed so it stays true.
      </h2>
      <p className="cinema-lede mx-auto mt-5 max-w-md text-muted-foreground">
        A closed design grammar. Full-bleed laws. Creativity in the story —
        never in rogue color.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
        <CinemaLink href="/for-agents">Learn more</CinemaLink>
        <CinemaLink href="/design.md">design.md</CinemaLink>
      </div>
    </CinemaTile>
  )
}

export { TileAgents }

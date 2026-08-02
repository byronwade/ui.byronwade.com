import { CinemaTile, CinemaLink } from "@/components/cinematic/tile"

/**
 * Light canvas tile — Apple parchment rhythm between photograph tiles.
 * No image; the type and space are the subject.
 */
function TileAgents() {
  return (
    <CinemaTile id="agents" tone="paper" align="center">
      <p className="text-[21px] font-medium tracking-tight text-foreground">
        For agents
      </p>
      <h2 className="mt-2 text-[clamp(2.25rem,6vw,4.25rem)] font-medium leading-[1.06] tracking-[-0.04em] text-foreground">
        Typed so it stays true.
      </h2>
      <p className="mx-auto mt-4 max-w-md text-[19px] leading-snug tracking-tight text-muted-foreground md:text-[21px]">
        A closed design grammar. Full-bleed laws. Creativity in the story —
        never in rogue color.
      </p>
      <div className="mt-7 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
        <CinemaLink href="/for-agents">Learn more</CinemaLink>
        <CinemaLink href="/design.md">design.md</CinemaLink>
      </div>
    </CinemaTile>
  )
}

export { TileAgents }

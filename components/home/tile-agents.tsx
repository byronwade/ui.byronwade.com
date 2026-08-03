import { CinemaTile, CinemaLink } from "@/components/cinematic/tile"

/**
 * Paper beat — typed grammar. Human routes, not .md negotiation traps.
 */
function TileAgents() {
  return (
    <CinemaTile id="agents" tone="paper" align="center">
      <p className="font-mono text-[11px] tracking-[0.16em] text-brand uppercase">
        Grammar
      </p>
      <h2 className="cinema-title mt-3 text-foreground">
        Typed so it stays true.
      </h2>
      <p className="cinema-lede mx-auto mt-5 max-w-md text-muted-foreground">
        Closed design tokens. Full-bleed laws for media. Creativity in the
        story — never in rogue color.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
        <CinemaLink href="/skills" priority="primary">
          Browse skills
        </CinemaLink>
        <CinemaLink href="/design" priority="secondary">
          design.md
        </CinemaLink>
      </div>
    </CinemaTile>
  )
}

export { TileAgents }

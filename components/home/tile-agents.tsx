import { CinemaTile, CinemaLink } from "@/components/cinematic/tile"
import { defineCinemaFrame, text } from "@/lib/design"

const frame = defineCinemaFrame({
  tone: "paper",
  subject: "copy",
  ideas: 1,
  overlayStickers: false,
})

/**
 * Paper beat — typed grammar + research specs. Human routes, not .md traps.
 */
function TileAgents() {
  return (
    <CinemaTile id="agents" tone={frame.tone} align="center">
      <p className="font-mono text-[11px] tracking-[0.16em] text-brand uppercase">
        Grammar
      </p>
      <h2 className={`cinema-title mt-3 ${text("foreground")}`}>
        Typed so it stays true.
      </h2>
      <p className={`cinema-lede mx-auto mt-5 max-w-md ${text("muted")}`}>
        Closed tokens in lib/design. Research specs under /system. Creativity in
        the story — never in rogue color.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
        <CinemaLink href="/design" priority="primary">
          design.md
        </CinemaLink>
        <CinemaLink href="/for-agents" priority="secondary">
          Agents
        </CinemaLink>
      </div>
    </CinemaTile>
  )
}

export { TileAgents }

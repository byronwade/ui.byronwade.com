import { CinemaTile, CinemaLink } from "@/components/cinematic/tile"
import { defineCinemaFrame, text } from "@/lib/design"

const frame = defineCinemaFrame({
  tone: "paper",
  subject: "copy",
  ideas: 1,
  overlayStickers: false,
})

/**
 * Ledger beat — typed grammar. Left index, right contract.
 */
function TileAgents() {
  return (
    <CinemaTile id="agents" tone={frame.tone} layout="ledger" index="04">
      <p className="font-mono text-[11px] tracking-[0.16em] text-brand uppercase">
        Grammar
      </p>
      <h2 className={`cinema-title mt-4 ${text("foreground")}`}>
        Typed so
        <br />
        it stays true.
      </h2>
      <p className={`cinema-lede mt-6 max-w-md ${text("muted")}`}>
        Closed tokens in lib/design. Research specs under /system. Creativity in
        the story — never in rogue color.
      </p>
      <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3">
        <CinemaLink href="/meridian/design" priority="primary">
          design.md
        </CinemaLink>
        <CinemaLink href="/meridian/for-agents" priority="secondary">
          Agents
        </CinemaLink>
      </div>
    </CinemaTile>
  )
}

export { TileAgents }

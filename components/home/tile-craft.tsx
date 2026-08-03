import { CinemaTile, CinemaLink } from "@/components/cinematic/tile"
import { defineCinemaFrame, text } from "@/lib/design"

const frame = defineCinemaFrame({
  tone: "paper",
  subject: "copy",
  ideas: 1,
  overlayStickers: false,
})

/**
 * Ledger beat — mono index + statement. Neutrals only.
 */
function TileCraft() {
  return (
    <CinemaTile id="craft" tone={frame.tone} layout="ledger" index="01">
      <p className="font-mono text-[11px] tracking-[0.16em] text-brand uppercase">
        Neutrals
      </p>
      <h2 className={`cinema-title mt-4 ${text("foreground")}`}>
        Warm.
        <br />
        Quiet.
        <br />
        Exact.
      </h2>
      <p className={`cinema-lede mt-6 max-w-md ${text("muted")}`}>
        Soft stone paper. Soft charcoal type. Never pure white. Never pure
        black. Chrome stays out of the way.
      </p>
      <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3">
        <CinemaLink href="/theme" priority="primary">
          Theme knobs
        </CinemaLink>
        <CinemaLink href="/skills/meridian-theme" priority="secondary">
          meridian-theme
        </CinemaLink>
      </div>
    </CinemaTile>
  )
}

export { TileCraft }

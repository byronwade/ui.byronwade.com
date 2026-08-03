import { CinemaTile, CinemaLink } from "@/components/cinematic/tile"
import { defineCinemaFrame, text } from "@/lib/design"

const frame = defineCinemaFrame({
  tone: "paper",
  subject: "copy",
  ideas: 1,
  overlayStickers: false,
})

/**
 * Paper beat — neutrals only. One idea, one primary CTA.
 */
function TileCraft() {
  return (
    <CinemaTile id="craft" tone={frame.tone} align="center">
      <p className="font-mono text-[11px] tracking-[0.16em] text-brand uppercase">
        Neutrals
      </p>
      <h2 className={`cinema-title mt-3 ${text("foreground")}`}>
        Warm. Quiet. Exact.
      </h2>
      <p className={`cinema-lede mx-auto mt-5 max-w-sm ${text("muted")}`}>
        Soft stone paper. Soft charcoal type. Never pure white. Never pure
        black. Chrome stays out of the way.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
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

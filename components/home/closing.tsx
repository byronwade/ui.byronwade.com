import { CinemaTile, CinemaLink } from "@/components/cinematic/tile"
import { cinemaStills } from "@/lib/media"
import { defineCinemaFrame, text } from "@/lib/design"

const frame = defineCinemaFrame({
  tone: "theater",
  subject: "media",
  ideas: 1,
  overlayStickers: false,
  fullBleed: true,
})

/**
 * Closing — left-anchored on full-bleed still. One next step.
 */
function Closing() {
  return (
    <CinemaTile
      tone={frame.tone}
      layout="overlay"
      align="start"
      image={{
        src: cinemaStills.closing.src,
        alt: cinemaStills.closing.alt,
        veil: "bottom",
        objectPosition: "center 40%",
      }}
    >
      <p className="font-mono text-[11px] tracking-[0.16em] text-brand uppercase">
        Next
      </p>
      <h2 className={`cinema-display mt-3 ${text("dock")}`}>Meridian</h2>
      <p className={`cinema-lede mt-4 max-w-sm ${text("dock-muted")}`}>
        Ship application UI agents can keep honest.
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3">
        <CinemaLink href="/meridian/install" priority="primary">
          Install
        </CinemaLink>
        <CinemaLink href="/meridian/ui" priority="secondary">
          UI gallery
        </CinemaLink>
      </div>
    </CinemaTile>
  )
}

export { Closing }

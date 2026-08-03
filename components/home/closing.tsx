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
 * Closing — one next step, not a repeat of the hero CTAs.
 */
function Closing() {
  return (
    <CinemaTile
      tone={frame.tone}
      align="bottom"
      image={{
        src: cinemaStills.closing.src,
        alt: cinemaStills.closing.alt,
        veil: "bottom",
        objectPosition: "center 40%",
      }}
    >
      <h2 className={`cinema-display ${text("dock")}`}>Meridian</h2>
      <p className={`cinema-lede mx-auto mt-4 max-w-sm ${text("dock-muted")}`}>
        Ship application UI agents can keep honest.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
        <CinemaLink href="/skills" priority="primary">
          Install skills
        </CinemaLink>
        <CinemaLink href="/theme#contrast" priority="secondary">
          Contrast audit
        </CinemaLink>
      </div>
    </CinemaTile>
  )
}

export { Closing }

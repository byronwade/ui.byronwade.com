import { CinemaTile, CinemaLink } from "@/components/cinematic/tile"
import { cinemaStills } from "@/lib/media"

/**
 * Closing — one next step, not a repeat of the hero CTAs.
 */
function Closing() {
  return (
    <CinemaTile
      tone="theater"
      align="bottom"
      image={{
        src: cinemaStills.closing.src,
        alt: cinemaStills.closing.alt,
        veil: "bottom",
        objectPosition: "center 40%",
      }}
    >
      <h2 className="cinema-display text-dock-foreground">Meridian</h2>
      <p className="cinema-lede mx-auto mt-4 max-w-sm text-dock-muted">
        Ship application UI agents can keep honest.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
        <CinemaLink href="/skills" priority="primary">
          Install skills
        </CinemaLink>
        <CinemaLink href="/theme" priority="secondary">
          See the system
        </CinemaLink>
      </div>
    </CinemaTile>
  )
}

export { Closing }

import { CinemaTile, CinemaLink } from "@/components/cinematic/tile"
import { cinemaStills } from "@/lib/media"

/**
 * Closing atmosphere — brand returns as the display; media stays quiet.
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
      <p className="cinema-lede mx-auto mt-4 max-w-sm text-dock-foreground/70">
        The frame is the product.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
        <CinemaLink href="/theme">View theme</CinemaLink>
        <CinemaLink href="/surfaces">Surfaces</CinemaLink>
      </div>
    </CinemaTile>
  )
}

export { Closing }

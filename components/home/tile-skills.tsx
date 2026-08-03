import { CinemaTile, CinemaLink } from "@/components/cinematic/tile"
import { defineCinemaFrame, text } from "@/lib/design"

const frame = defineCinemaFrame({
  tone: "paper",
  subject: "copy",
  ideas: 1,
  overlayStickers: false,
})

/**
 * Paper beat — one idea: the five-skill loop exists.
 * Dense proof grids live on /skills — not inside this cinema frame.
 */
function TileSkills() {
  return (
    <CinemaTile id="skills" tone={frame.tone} align="center">
      <p className="font-mono text-[11px] tracking-[0.16em] text-brand uppercase">
        Skills
      </p>
      <h2 className={`cinema-title mt-3 ${text("foreground")}`}>
        Theme → surface → compose → cinema → a11y.
      </h2>
      <p className={`cinema-lede mx-auto mt-5 max-w-md ${text("muted")}`}>
        Every skill has a live proof on this site — not just an install card.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
        <CinemaLink href="/skills" priority="primary">
          Browse skills
        </CinemaLink>
        <CinemaLink href="/system" priority="secondary">
          System specs
        </CinemaLink>
      </div>
    </CinemaTile>
  )
}

export { TileSkills }

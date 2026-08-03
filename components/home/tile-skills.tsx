import { CinemaTile, CinemaLink } from "@/components/cinematic/tile"
import { SkillLoop } from "@/components/site/skill-loop"

/**
 * Paper beat — the full Meridian skill loop, each step proven on this site.
 */
function TileSkills() {
  return (
    <CinemaTile id="skills" tone="paper" align="center">
      <p className="font-mono text-[11px] tracking-[0.16em] text-brand uppercase">
        Skills
      </p>
      <h2 className="cinema-title mt-3 text-foreground">
        Theme → surface → compose → cinema → a11y.
      </h2>
      <p className="cinema-lede mx-auto mt-5 max-w-md text-muted-foreground">
        Every skill has a live proof on this site — not just an install card.
      </p>
      <div className="mx-auto mt-10 w-full max-w-5xl text-left">
        <SkillLoop dense />
      </div>
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

import { CinemaTile, CinemaLink } from "@/components/cinematic/tile"
import { defineCinemaFrame, text } from "@/lib/design"

const frame = defineCinemaFrame({
  tone: "paper",
  subject: "copy",
  ideas: 1,
  overlayStickers: false,
})

const steps = [
  "Theme",
  "Surface",
  "Compose",
  "Cinema",
  "A11y",
] as const

/**
 * Ledger beat — one idea: the five-skill loop as a single procession.
 * Dense cards live on /skills.
 */
function TileSkills() {
  return (
    <CinemaTile id="skills" tone={frame.tone} layout="ledger" index="03">
      <p className="font-mono text-[11px] tracking-[0.16em] text-brand uppercase">
        Skills
      </p>
      <h2 className={`cinema-title mt-4 ${text("foreground")}`}>
        One loop.
        <br />
        Five proofs.
      </h2>
      <ol className="mt-8 flex flex-wrap gap-x-6 gap-y-3 border-y border-border py-5">
        {steps.map((step, i) => (
          <li
            key={step}
            className="flex items-baseline gap-2 font-mono text-sm tracking-tight"
          >
            <span className={text("muted")}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className={text("foreground")}>{step}</span>
          </li>
        ))}
      </ol>
      <p className={`cinema-lede mt-6 max-w-md ${text("muted")}`}>
        Theme → surface → compose → cinema → a11y — each skill proven on this
        site.
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3">
        <CinemaLink href="/meridian/skills" priority="primary">
          Browse skills
        </CinemaLink>
        <CinemaLink href="/meridian/system" priority="secondary">
          System specs
        </CinemaLink>
      </div>
    </CinemaTile>
  )
}

export { TileSkills }

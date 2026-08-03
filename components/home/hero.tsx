import { CinemaTile, CinemaLink } from "@/components/cinematic/tile"
import { ProductFrame } from "@/components/cinematic/product-frame"
import { Workbench } from "@/components/surfaces/workbench"
import { defineCinemaFrame, proofs, text } from "@/lib/design"

/** Typed hero — rail composition: brand names the system; app owns the frame. */
const heroFrame = defineCinemaFrame({
  ...proofs.hero,
  tone: "theater",
  subject: "workbench",
})

/**
 * Asymmetric rail — Meridian as a left column signal, workbench edge-bleed right.
 * One idea: calm application chrome under agents.
 */
function Hero() {
  return (
    <CinemaTile
      tone={heroFrame.tone}
      layout="rail"
      subject={
        <ProductFrame
          atmosphere={false}
          className="md:translate-x-4 lg:translate-x-8"
        >
          <Workbench className="h-[min(52svh,28rem)] rounded-none border-0 md:h-[min(78svh,44rem)]" />
        </ProductFrame>
      }
    >
      <p className="font-mono text-[11px] tracking-[0.18em] text-brand uppercase">
        Cinematic theme
      </p>
      <h1 className={`cinema-display mt-4 ${text("dock")}`}>Meridian</h1>
      <p className={`cinema-lede mt-5 max-w-sm ${text("dock-muted")}`}>
        Click the workbench — select issues, ask the agent. Dense chrome, one
        accent, typed rules.
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3">
        <CinemaLink href="/meridian/surfaces#proofs" priority="primary">
          Open proofs
        </CinemaLink>
        <CinemaLink href="/meridian/skills" priority="secondary">
          Skills
        </CinemaLink>
      </div>
    </CinemaTile>
  )
}

export { Hero }

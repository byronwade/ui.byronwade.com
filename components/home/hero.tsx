import { CinemaTile, CinemaLink } from "@/components/cinematic/tile"
import { ProductFrame } from "@/components/cinematic/product-frame"
import { Workbench } from "@/components/surfaces/workbench"
import { defineCinemaFrame, proofs } from "@/lib/design"

/** Typed hero frame — product/workbench subject, one idea. */
const heroFrame = defineCinemaFrame(proofs.hero)

/**
 * App-first hero — brand names the system; the workbench is the proof.
 * Cursor-app density, not marketing-site spectacle.
 */
function Hero() {
  return (
    <CinemaTile
      tone={heroFrame.tone}
      layout="stack"
      subject={
        <ProductFrame className="translate-y-4 md:translate-y-8">
          <Workbench className="h-[22rem] rounded-none border-0 md:h-[min(50vh,36rem)]" />
        </ProductFrame>
      }
    >
      <h1 className="cinema-display text-foreground">Meridian</h1>
      <p className="cinema-lede mx-auto mt-4 max-w-md text-muted-foreground">
        Application UI that stays calm under agents — dense chrome, one accent,
        typed rules.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
        <CinemaLink href="/surfaces#proofs" priority="primary">
          Open proofs
        </CinemaLink>
        <CinemaLink href="/#skills" priority="secondary">
          Skill loop
        </CinemaLink>
      </div>
    </CinemaTile>
  )
}

export { Hero }

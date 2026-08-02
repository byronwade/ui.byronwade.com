import { CinemaTile, CinemaLink } from "@/components/cinematic/tile"
import { ProductFrame } from "@/components/cinematic/product-frame"
import { Workbench } from "@/components/surfaces/workbench"

/**
 * Apple product-page hero — brand is the display, product owns the frame.
 * Soft paper light. No stock photograph competing with the workbench.
 */
function Hero() {
  return (
    <CinemaTile
      tone="paper"
      layout="stack"
      subject={
        <ProductFrame className="translate-y-6 md:translate-y-10">
          <Workbench className="h-[22rem] rounded-none border-0 md:h-[min(48vh,34rem)]" />
        </ProductFrame>
      }
    >
      <h1 className="cinema-display text-foreground">Meridian</h1>
      <p className="cinema-lede mx-auto mt-4 max-w-md text-muted-foreground">
        Quiet product UI. Soft neutrals. One accent.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
        <CinemaLink href="/theme">View theme</CinemaLink>
        <CinemaLink href="/design">Design</CinemaLink>
      </div>
    </CinemaTile>
  )
}

export { Hero }

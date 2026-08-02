import { CinemaTile, CinemaLink } from "@/components/cinematic/tile"
import { ProductFrame } from "@/components/cinematic/product-frame"
import { Workbench } from "@/components/surfaces/workbench"

/**
 * Theater product stage — one accent leads; the workbench proves it.
 */
function TileFocus() {
  return (
    <CinemaTile
      id="product"
      tone="theater"
      layout="stack"
      subject={
        <ProductFrame className="translate-y-6 md:translate-y-10">
          <Workbench
            withAgent
            className="h-[22rem] rounded-none border-0 md:h-[min(48vh,34rem)]"
          />
        </ProductFrame>
      }
    >
      <p className="text-[19px] font-medium tracking-tight text-brand md:text-[21px]">
        Accent
      </p>
      <h2 className="cinema-title mt-3 text-dock-foreground">
        One color that leads.
      </h2>
      <p className="cinema-lede mx-auto mt-5 max-w-sm text-dock-muted">
        Deep ink-teal for action and selection. Everything else stays neutral.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
        <CinemaLink href="/theme">See the brand</CinemaLink>
        <CinemaLink href="/for-agents">For agents</CinemaLink>
      </div>
    </CinemaTile>
  )
}

export { TileFocus }

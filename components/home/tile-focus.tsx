import { CinemaTile, CinemaLink } from "@/components/cinematic/tile"
import { ProductFrame } from "@/components/cinematic/product-frame"
import { ComposerShell } from "@/components/surfaces/composer-shell"
import { defineCinemaFrame, text } from "@/lib/design"

const frame = defineCinemaFrame({
  tone: "theater",
  subject: "workbench",
  ideas: 1,
  overlayStickers: false,
  fullBleed: true,
})

/**
 * Theater beat — editor + object-bound agent (Cursor-app shape).
 * Distinct from the hero workbench index.
 */
function TileFocus() {
  return (
    <CinemaTile
      id="product"
      tone={frame.tone}
      layout="stack"
      subject={
        <ProductFrame atmosphere={false} className="translate-y-4 md:translate-y-8">
          <ComposerShell className="h-[22rem] rounded-none border-0 md:h-[min(50vh,36rem)]" />
        </ProductFrame>
      }
    >
      <p className="font-mono text-[11px] tracking-[0.16em] text-brand uppercase">
        Agent
      </p>
      <h2 className={`cinema-title mt-3 ${text("dock")}`}>
        Bound to the file.
      </h2>
      <p className={`cinema-lede mx-auto mt-5 max-w-sm ${text("dock-muted")}`}>
        Composer rides the selected object — provenance, activity, review —
        never a floating chatbot.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
        <CinemaLink href="/surfaces#proofs" priority="primary">
          Composer proof
        </CinemaLink>
        <CinemaLink href="/skills/meridian-compose" priority="secondary">
          meridian-compose
        </CinemaLink>
      </div>
    </CinemaTile>
  )
}

export { TileFocus }

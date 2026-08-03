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
 * Rail beat — object-bound composer owns the right edge.
 */
function TileFocus() {
  return (
    <CinemaTile
      id="product"
      tone={frame.tone}
      layout="rail"
      subject={
        <ProductFrame
          atmosphere={false}
          className="md:translate-x-4 lg:translate-x-8"
        >
          <ComposerShell className="h-[min(52svh,28rem)] rounded-none border-0 md:h-[min(78svh,44rem)]" />
        </ProductFrame>
      }
    >
      <p className="font-mono text-[11px] tracking-[0.16em] text-brand uppercase">
        02 · Agent
      </p>
      <h2 className={`cinema-title mt-4 ${text("dock")}`}>
        Bound to
        <br />
        the file.
      </h2>
      <p className={`cinema-lede mt-5 max-w-sm ${text("dock-muted")}`}>
        Composer rides the selected object — provenance, activity, review —
        never a floating chatbot.
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3">
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

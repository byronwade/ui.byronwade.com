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
 * Rail beat — object-bound composer flushes the right edge.
 */
function TileFocus() {
  return (
    <CinemaTile
      id="product"
      tone={frame.tone}
      layout="rail"
      subject={
        <ProductFrame atmosphere={false}>
          <ComposerShell className="h-full min-h-[min(58svh,34rem)] rounded-none border-0 md:h-full md:min-h-0" />
        </ProductFrame>
      }
    >
      <p className="font-mono text-[11px] tracking-[0.16em] text-brand uppercase">
        02 · Agent
      </p>
      <h2 className={`cinema-title mt-3 ${text("dock")}`}>
        Bound to
        <br />
        the file.
      </h2>
      <p className={`cinema-lede mt-4 max-w-sm ${text("dock-muted")}`}>
        Open files, ask the rail — composer rides the selected object, never a
        floating chatbot.
      </p>
      <div className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-3">
        <CinemaLink href="/meridian/surfaces#proofs" priority="primary">
          Composer proof
        </CinemaLink>
        <CinemaLink
          href="/meridian/skills/meridian-compose"
          priority="secondary"
        >
          meridian-compose
        </CinemaLink>
      </div>
    </CinemaTile>
  )
}

export { TileFocus }

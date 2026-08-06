import { type ReactNode } from "react"
import { bg, designCn, depthIntent } from "@/lib/design"

type ProductFrameProps = {
  children: ReactNode
  className?: string
  /** Soft falloff behind the window — keep subtle; app chrome is the subject. */
  atmosphere?: boolean
  /**
   * edge — bleeds toward the stage edge (rail layouts)
   * shell — fully rounded window (centered stacks)
   */
  frame?: "edge" | "shell"
}

/**
 * Stages the application as the subject — window chrome, not a marketing card.
 * Edge frames flush to the right of a rail; no inset margins.
 */
function ProductFrame({
  children,
  className,
  atmosphere = true,
  frame = "edge",
}: ProductFrameProps) {
  return (
    <div
      data-slot="product-frame"
      data-frame={frame}
      className={designCn("relative h-full w-full", className)}
    >
      {atmosphere ? (
        <div
          aria-hidden
          className="cinema-atmosphere pointer-events-none absolute inset-x-[-8%] bottom-[-16%] h-[110%] opacity-70"
        />
      ) : null}
      <div
        className={designCn(
          "relative h-full w-full",
          frame === "shell" && "mx-auto max-w-[76rem] px-3 md:px-6",
        )}
      >
        <div
          className={designCn(
            "h-full overflow-hidden edge",
            bg("card"),
            depthIntent("default"),
            frame === "shell" && "rounded-3xl",
            /* Mobile: top radii only; desktop: open right + bottom to own the stage edge */
            frame === "edge" &&
              "rounded-t-2xl md:rounded-tl-3xl md:rounded-tr-none md:rounded-br-none md:rounded-bl-none",
          )}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

export { ProductFrame }
export type { ProductFrameProps }

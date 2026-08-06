import type { ReactNode } from "react"
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
      className={designCn("relative w-full", className)}
    >
      {atmosphere ? (
        <div
          aria-hidden
          className="cinema-atmosphere pointer-events-none absolute inset-x-[-8%] bottom-[-16%] h-[110%] opacity-70"
        />
      ) : null}
      <div
        className={designCn(
          "relative w-full",
          frame === "shell" && "mx-auto max-w-[76rem] px-3 md:px-6",
        )}
      >
        <div
          className={designCn(
            "overflow-hidden edge",
            bg("card"),
            depthIntent("default"),
            frame === "shell" && "rounded-3xl",
            frame === "edge" &&
              "rounded-3xl md:rounded-l-3xl md:rounded-r-none max-md:mx-3",
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

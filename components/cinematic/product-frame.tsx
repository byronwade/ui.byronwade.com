import { type ReactNode } from "react"
import { bg, designCn, depthIntent, radiusIntent } from "@/lib/design"

type ProductFrameProps = {
  children: ReactNode
  className?: string
  /** Soft falloff behind the window — keep subtle; app chrome is the subject. */
  atmosphere?: boolean
}

/**
 * Stages the application as the subject — window chrome, not a marketing card.
 * Shell radius (rounded-3xl) + edge — never inset hero cards.
 */
function ProductFrame({
  children,
  className,
  atmosphere = true,
}: ProductFrameProps) {
  return (
    <div
      data-slot="product-frame"
      className={designCn("relative w-full", className)}
    >
      {atmosphere ? (
        <div
          aria-hidden
          className="cinema-atmosphere pointer-events-none absolute inset-x-[-8%] bottom-[-16%] h-[110%] opacity-70"
        />
      ) : null}
      <div className="relative mx-auto w-full max-w-[76rem] px-3 md:px-6">
        <div
          className={designCn(
            "overflow-hidden",
            radiusIntent("shell"),
            bg("card"),
            depthIntent("default"),
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

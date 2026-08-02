import { type ReactNode } from "react"
import { cn } from "@/lib/utils"

type ProductFrameProps = {
  children: ReactNode
  className?: string
  /** Soft luminous falloff behind the product — Apple product-page light. */
  atmosphere?: boolean
}

/**
 * Stages the product as the cinematic subject.
 * Soft atmosphere + raised shell — never an inset marketing card collage.
 */
function ProductFrame({
  children,
  className,
  atmosphere = true,
}: ProductFrameProps) {
  return (
    <div
      data-slot="product-frame"
      className={cn("relative w-full", className)}
    >
      {atmosphere ? (
        <div
          aria-hidden
          className="cinema-atmosphere pointer-events-none absolute inset-x-[-10%] bottom-[-20%] h-[120%]"
        />
      ) : null}
      <div className="relative mx-auto w-full max-w-[72rem] px-4 md:px-8">
        <div className="depth-raised overflow-hidden rounded-2xl bg-card md:rounded-3xl">
          {children}
        </div>
      </div>
    </div>
  )
}

export { ProductFrame }
export type { ProductFrameProps }

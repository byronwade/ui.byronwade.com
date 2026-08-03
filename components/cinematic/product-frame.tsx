import { type ReactNode } from "react"
import { cn } from "@/lib/utils"

type ProductFrameProps = {
  children: ReactNode
  className?: string
  /** Soft falloff behind the window — keep subtle; app chrome is the subject. */
  atmosphere?: boolean
}

/**
 * Stages the application as the subject — window chrome, not a marketing card.
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
          className="cinema-atmosphere pointer-events-none absolute inset-x-[-8%] bottom-[-16%] h-[110%] opacity-70"
        />
      ) : null}
      <div className="relative mx-auto w-full max-w-[76rem] px-3 md:px-6">
        <div className="overflow-hidden rounded-2xl bg-card edge">
          {children}
        </div>
      </div>
    </div>
  )
}

export { ProductFrame }
export type { ProductFrameProps }

/**
 * Adapted for byronwade/ui from kibo-ui (with an Untitled-UI-style display in mind).
 * Original code, concept, and design © kibo-ui — https://www.kibo-ui.com
 * Reworked to the byronwade/ui design system: the card body uses `bg-foreground/90`
 * and text uses `text-background` (so it re-skins and stays legible in both
 * themes instead of hardcoded white), the mag stripe is tokenized, editorial
 * weight, and `data-slot` hooks. The gold chip stays — it's a physical-chip
 * illustration, not UI chrome.
 */
"use client"

import {
  type ComponentProps,
  createContext,
  type HTMLAttributes,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react"
import { PaymentIcon } from "react-svg-credit-card-payment-icons"

import { cn } from "@/lib/utils"

const useSupportsHover = () => {
  const [supportsHover, setSupportsHover] = useState(false)
  useEffect(() => {
    const mql = window.matchMedia("(hover: hover)")
    const handler = (e: MediaQueryListEvent) => setSupportsHover(e.matches)
    setSupportsHover(mql.matches)
    mql.addEventListener("change", handler)
    return () => mql.removeEventListener("change", handler)
  }, [])
  return supportsHover
}

export type CreditCardProps = HTMLAttributes<HTMLDivElement>

export const CreditCard = ({ className, ...props }: CreditCardProps) => (
  <div
    data-slot="credit-card"
    className={cn(
      "group/credit-card aspect-[8560/5398] w-full max-w-96 text-background perspective-distant @container",
      className,
    )}
    {...props}
  />
)

const CreditCardFlipContext = createContext(false)

export type CreditCardFlipperProps = HTMLAttributes<HTMLDivElement>

export const CreditCardFlipper = ({
  className,
  children,
  ...props
}: CreditCardFlipperProps & { children?: ReactNode }) => {
  const supportsHover = useSupportsHover()
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <CreditCardFlipContext.Provider value={true}>
      <button
        type="button"
        aria-label="Flip credit card"
        className={cn(
          "h-full w-full rounded-lg transition duration-700 ease-in-out transform-3d @xs:rounded-2xl",
          supportsHover &&
            "group-hover/credit-card:-rotate-y-180 group-hover/credit-card:shadow-lg",
          !supportsHover && isFlipped && "-rotate-y-180 shadow-lg",
          className,
        )}
        onClick={() => !supportsHover && setIsFlipped((p) => !p)}
        {...(props as HTMLAttributes<HTMLButtonElement>)}
      >
        {children}
      </button>
    </CreditCardFlipContext.Provider>
  )
}

export type CreditCardNameProps = HTMLAttributes<HTMLParagraphElement>

export const CreditCardName = ({
  className,
  style,
  ...props
}: CreditCardNameProps) => (
  <p
    data-slot="credit-card-name"
    className={cn("font-medium uppercase", className)}
    style={{ lineHeight: "100%", ...style }}
    {...props}
  />
)

export type CreditCardChipProps = HTMLAttributes<SVGSVGElement>

export const CreditCardChip = ({
  className,
  children,
  ...props
}: CreditCardChipProps) =>
  children ? (
    <div
      data-slot="credit-card-chip"
      className={cn(
        "absolute top-1/2 left-0 w-1/6 shrink-0 -translate-y-1/2 rounded-[18%]",
        className,
      )}
    >
      {children}
    </div>
  ) : (
    <svg
      data-slot="credit-card-chip"
      className={cn(
        "absolute top-1/2 left-0 w-1/6 shrink-0 -translate-y-1/2 rounded-[18%]",
        className,
      )}
      viewBox="0 0 110 92"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>Chip</title>
      <path
        d="M1 13A12 12 0 0 1 13 1h84a12 12 0 0 1 12 12v66a12 12 0 0 1-12 12H13A12 12 0 0 1 1 79V13Z"
        fill="url(#credit-card-chip-gradient)"
      />
      <path
        d="M108 71.5H83.65L70.53 60.87A21.41 21.41 0 0 1 56 67.47V90h41a11 11 0 0 0 11-11v-7.5ZM76.48 47a21.38 21.38 0 0 1-4.63 12.36l12.5 10.14H108V47H76.48ZM2 69.5h24.14l12.02-10.12A21.38 21.38 0 0 1 33.52 47H2v22.5Zm53-43c-5.85 0-11.1 2.57-14.68 6.66A19.4 19.4 0 0 0 35.5 46a19.4 19.4 0 0 0 4.82 12.84A19.43 19.43 0 0 0 55 65.5c5.85 0 11.1-2.57 14.68-6.66A19.4 19.4 0 0 0 74.5 46a19.4 19.4 0 0 0-4.82-12.84A19.43 19.43 0 0 0 55 26.5Zm16.85 6.14A21.38 21.38 0 0 1 76.48 45H108V22.5H84.35l-12.5 10.14ZM2 45h31.52a21.38 21.38 0 0 1 4.64-12.38L26.14 22.5H2V45Zm0 34a11 11 0 0 0 11 11h41V67.47a21.41 21.41 0 0 1-14.52-6.59L27.14 71.26l-.27.24H2V79Zm106-66A11 11 0 0 0 97 2H56v22.52c5.7.27 10.83 2.74 14.53 6.61L83.65 20.5H108V13ZM2 20.5h24.87l.27.24 12.34 10.38A21.41 21.41 0 0 1 54 24.52V2H13A11 11 0 0 0 2 13v7.5ZM110 79a13 13 0 0 1-13 13H13A13 13 0 0 1 0 79V13A13 13 0 0 1 13 0h84a13 13 0 0 1 13 13v66Z"
        fill="#000"
      />
      <defs>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id="credit-card-chip-gradient"
          x1="1"
          x2="112.7"
          y1="46"
          y2="78.12"
        >
          <stop stopColor="#EDE5A6" />
          <stop offset="1" stopColor="#CFA255" />
        </linearGradient>
      </defs>
    </svg>
  )

export type CreditCardLogoProps = HTMLAttributes<HTMLDivElement>

export const CreditCardLogo = ({
  className,
  ...props
}: CreditCardLogoProps) => (
  <div
    data-slot="credit-card-logo"
    className={cn("absolute top-0 right-0 size-1/6", className)}
    {...props}
  />
)

export type CreditCardFrontProps = HTMLAttributes<HTMLDivElement> & {
  safeArea?: number
}

export const CreditCardFront = ({
  className,
  safeArea = 20,
  children,
  ...props
}: CreditCardFrontProps) => (
  <div
    data-slot="credit-card-front"
    className={cn(
      "absolute inset-0 flex overflow-hidden rounded-lg bg-foreground/90 backface-hidden @xs:rounded-2xl",
      className,
    )}
    {...props}
  >
    <div className="relative flex-1" style={{ margin: `${safeArea}px` }}>
      {children}
    </div>
  </div>
)

export type CreditCardServiceProviderProps = ComponentProps<typeof PaymentIcon>

export const CreditCardServiceProvider = ({
  className,
  children,
  type = "Visa",
  ...props
}: CreditCardServiceProviderProps) => {
  if (children) {
    return (
      <div
        data-slot="credit-card-service-provider"
        className={cn(
          "absolute right-0 bottom-0 max-h-1/3 max-w-1/3",
          className,
        )}
      >
        {children}
      </div>
    )
  }
  return (
    <PaymentIcon
      data-slot="credit-card-service-provider"
      className={cn("absolute right-0 bottom-0 max-h-1/3 max-w-1/3", className)}
      type={type}
      {...props}
    />
  )
}

export type CreditCardMagStripeProps = HTMLAttributes<HTMLDivElement>

type CreditCardBackContextValue = { safeArea: number }
const CreditCardBackContext = createContext<CreditCardBackContextValue>({
  safeArea: 20,
})

export const CreditCardMagStripe = ({
  className,
  ...props
}: CreditCardMagStripeProps) => {
  const context = useContext(CreditCardBackContext)
  return (
    <div
      data-slot="credit-card-mag-stripe"
      className={cn(
        "absolute top-[3%] left-1/2 h-1/4 -translate-x-1/2 bg-foreground",
        className,
      )}
      style={{ width: `calc(100% + 2 * ${context.safeArea}px)` }}
      {...props}
    />
  )
}

export type CreditCardBackProps = HTMLAttributes<HTMLDivElement> & {
  safeArea?: number
}

export const CreditCardBack = ({
  safeArea = 16,
  children,
  className,
  ...props
}: CreditCardBackProps) => {
  const isInsideFlipper = useContext(CreditCardFlipContext)
  return (
    <CreditCardBackContext.Provider value={{ safeArea }}>
      <div
        data-slot="credit-card-back"
        className={cn(
          "absolute inset-0 flex overflow-hidden rounded-lg bg-foreground/90 backface-hidden @xs:rounded-2xl",
          isInsideFlipper && "rotate-y-180",
          className,
        )}
        {...props}
      >
        <div className="relative flex-1" style={{ margin: `${safeArea}px` }}>
          {children}
        </div>
      </div>
    </CreditCardBackContext.Provider>
  )
}

export type CreditCardNumberProps = HTMLAttributes<HTMLParagraphElement>

export const CreditCardNumber = ({
  className,
  children,
  style,
  ...props
}: CreditCardNumberProps) => (
  <p
    data-slot="credit-card-number"
    className={cn("font-mono @xs:text-2xl", className)}
    style={{ lineHeight: "100%", ...style }}
    {...props}
  >
    {children}
  </p>
)

export type CreditCardExpiryProps = HTMLAttributes<HTMLParagraphElement>

export const CreditCardExpiry = ({
  className,
  style,
  ...props
}: CreditCardExpiryProps) => (
  <p
    data-slot="credit-card-expiry"
    className={cn("font-mono", className)}
    style={{ lineHeight: "100%", ...style }}
    {...props}
  />
)

export type CreditCardCvvProps = HTMLAttributes<HTMLParagraphElement>

export const CreditCardCvv = ({
  className,
  style,
  ...props
}: CreditCardCvvProps) => (
  <p
    data-slot="credit-card-cvv"
    className={cn("font-mono", className)}
    style={{ lineHeight: "100%", ...style }}
    {...props}
  />
)

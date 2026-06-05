/**
 * Adapted for byronwade/ui from kibo-ui.
 * Original code, concept, and design © kibo-ui — https://www.kibo-ui.com
 * Reworked to the byronwade/ui design system: the QR already resolves its
 * colors from the `--foreground` / `--background` tokens (so it re-skins with
 * the theme); added a credit header + `data-slot`. (kibo's async server-render
 * variant is omitted; this client one is token-aware.)
 */
"use client"

import { formatHex, oklch } from "culori"
import QR from "qrcode"
import { type HTMLAttributes, useEffect, useState } from "react"

import { cn } from "@/lib/utils"

export type QRCodeProps = HTMLAttributes<HTMLDivElement> & {
  data: string
  /** Override the dark module color (defaults to the --foreground token). */
  foreground?: string
  /** Override the light/background color (defaults to the --background token). */
  background?: string
  /** Error-correction level. */
  robustness?: "L" | "M" | "Q" | "H"
}

const oklchRegex = /oklch\(([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)\)/

const getOklch = (color: string, fallback: [number, number, number]) => {
  const match = color.match(oklchRegex)
  if (!match) return { l: fallback[0], c: fallback[1], h: fallback[2] }
  return {
    l: Number.parseFloat(match[1]),
    c: Number.parseFloat(match[2]),
    h: Number.parseFloat(match[3]),
  }
}

export const QRCode = ({
  data,
  foreground,
  background,
  robustness = "M",
  className,
  ...props
}: QRCodeProps) => {
  const [svg, setSVG] = useState<string | null>(null)

  useEffect(() => {
    const generateQR = async () => {
      try {
        const styles = getComputedStyle(document.documentElement)
        const foregroundColor =
          foreground ?? styles.getPropertyValue("--foreground")
        const backgroundColor =
          background ?? styles.getPropertyValue("--background")

        const fg = getOklch(foregroundColor, [0.21, 0.006, 285.885])
        const bg = getOklch(backgroundColor, [0.985, 0, 0])

        const next = await QR.toString(data, {
          type: "svg",
          color: {
            dark: formatHex(oklch({ mode: "oklch", ...fg })) ?? "#000000",
            light: formatHex(oklch({ mode: "oklch", ...bg })) ?? "#ffffff",
          },
          width: 200,
          errorCorrectionLevel: robustness,
          margin: 0,
        })
        setSVG(next)
      } catch (err) {
        console.error(err)
      }
    }
    generateQR()
  }, [data, foreground, background, robustness])

  if (!svg) {
    return null
  }

  return (
    <div
      data-slot="qr-code"
      className={cn("size-full [&_svg]:size-full", className)}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: svg }}
      {...props}
    />
  )
}

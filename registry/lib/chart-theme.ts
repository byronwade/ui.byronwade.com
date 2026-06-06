/**
 * Maps byronwade/ui foundation tokens to TradingView Lightweight Charts options.
 * Reads computed CSS variable values from a live DOM node so dark mode and
 * `--brand` overrides flow through without hardcoded hex in components.
 */

import {
  ColorType,
  type ChartOptions,
  type DeepPartial,
  type UTCTimestamp,
} from "lightweight-charts"

import type { Candle } from "@/lib/market"

type LightweightChartTheme = {
  upColor: string
  downColor: string
  lineColor: string
  areaTopColor: string
  areaBottomColor: string
  volumeUpColor: string
  volumeDownColor: string
  chartOptions: DeepPartial<ChartOptions>
}

/** Resolve a foundation `--token` to an rgb/rgba string canvas APIs accept. */
function hexToRgb(hex: string): string {
  let h = hex.slice(1)
  if (h.length === 3) {
    h = h
      .split("")
      .map((char) => char + char)
      .join("")
  }
  if (h.length === 8) h = h.slice(0, 6)
  const r = Number.parseInt(h.slice(0, 2), 16)
  const g = Number.parseInt(h.slice(2, 4), 16)
  const b = Number.parseInt(h.slice(4, 6), 16)
  return `rgb(${r}, ${g}, ${b})`
}

function clampByte(value: number): number {
  return Math.max(0, Math.min(255, Math.round(value)))
}

function linearToSrgb(channel: number): number {
  const abs = Math.abs(channel)
  const linear =
    abs <= 0.0031308
      ? 12.92 * channel
      : Math.sign(channel) * (1.055 * abs ** (1 / 2.4) - 0.055)
  return clampByte(linear * 255)
}

/** CSS Lab (D65) → sRGB when canvas sampling is unavailable. */
function labStringToRgb(input: string): string | null {
  const match = input.match(
    /^lab\(\s*([\d.]+)(%?)\s+([-\d.]+)\s+([-\d.]+)(?:\s*\/\s*([\d.]+%?))?\s*\)$/i,
  )
  if (!match) return null

  let l = Number.parseFloat(match[1])
  if (match[2] === "%") l = (l / 100) * 100
  const a = Number.parseFloat(match[3])
  const b = Number.parseFloat(match[4])

  const fy = (l + 16) / 116
  const fx = a / 500 + fy
  const fz = fy - b / 200
  const cube = (t: number) =>
    t ** 3 > 0.0088564516790356 ? t ** 3 : (t - 16 / 116) / 7.787037037037037

  const x = 0.95047 * cube(fx)
  const y = 1 * cube(fy)
  const z = 1.08883 * cube(fz)

  const r = linearToSrgb(x * 3.2404542 + y * -1.5371385 + z * -0.4985314)
  const g = linearToSrgb(x * -0.969266 + y * 1.8760108 + z * 0.041556)
  const bl = linearToSrgb(x * 0.0556434 + y * -0.2040259 + z * 1.0572252)

  return `rgb(${r}, ${g}, ${bl})`
}

function oklabToLinearSrgb(l: number, a: number, b: number) {
  const l_ = l + 0.3963377774 * a + 0.2158037573 * b
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b
  const s_ = l - 0.0894841775 * a - 1.291485548 * b
  const l3 = l_ ** 3
  const m3 = m_ ** 3
  const s3 = s_ ** 3
  return {
    r: 4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3,
    g: -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3,
    b: -0.0041960863 * l3 - 0.7034186147 * m3 + 1.707614701 * s3,
  }
}

/** CSS OKLCH → sRGB when canvas sampling is unavailable. */
function oklchStringToRgb(input: string): string | null {
  const match = input.match(
    /^oklch\(\s*([\d.]+)(%?)\s+([\d.]+)\s+([\d.]+)(?:deg|rad|turn)?(?:\s*\/\s*([\d.]+%?))?\s*\)$/i,
  )
  if (!match) return null

  let l = Number.parseFloat(match[1])
  if (match[2] === "%") l /= 100
  const c = Number.parseFloat(match[3])
  const h = (Number.parseFloat(match[4]) * Math.PI) / 180
  const a = c * Math.cos(h)
  const b = c * Math.sin(h)
  const { r, g, b: blue } = oklabToLinearSrgb(l, a, b)

  return `rgb(${linearToSrgb(r)}, ${linearToSrgb(g)}, ${linearToSrgb(blue)})`
}

function parseModernCssColor(input: string): string | null {
  if (/^lab\(/i.test(input)) return labStringToRgb(input)
  if (/^oklch\(/i.test(input)) return oklchStringToRgb(input)
  if (/^#([0-9a-f]{3,8})$/i.test(input)) return hexToRgb(input)
  return null
}

/**
 * Browsers may serialize computed colors as lab()/oklch(); LW Charts expects
 * rgb/rgba. Sample a 1×1 canvas pixel so conversion does not rely on fillStyle
 * readback (which can still return lab() in modern engines).
 */
function normalizeCssColor(color: string): string {
  const trimmed = color.trim()
  if (!trimmed || trimmed === "transparent") return "transparent"
  if (/^rgba?\(/i.test(trimmed)) return trimmed

  if (typeof document !== "undefined") {
    try {
      const canvas = document.createElement("canvas")
      canvas.width = 1
      canvas.height = 1
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.clearRect(0, 0, 1, 1)
        ctx.fillStyle = trimmed
        ctx.fillRect(0, 0, 1, 1)
        const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data
        if (a === 0) return "transparent"
        if (a < 255) {
          return `rgba(${r}, ${g}, ${b}, ${Math.round((a / 255) * 1000) / 1000})`
        }
        return `rgb(${r}, ${g}, ${b})`
      }
    } catch {
      // fall through to math parsers
    }
  }

  return parseModernCssColor(trimmed) ?? trimmed
}

function toChartColor(color: string): string {
  const normalized = normalizeCssColor(color)
  if (/^(lab|oklch|color)\(/i.test(normalized)) {
    return parseModernCssColor(normalized) ?? "rgb(128, 128, 128)"
  }
  if (
    normalized !== "transparent" &&
    !/^rgba?\(/i.test(normalized) &&
    !/^#[0-9a-f]{3,8}$/i.test(normalized)
  ) {
    return "rgb(128, 128, 128)"
  }
  return normalized
}

function resolveCssToken(root: HTMLElement, token: string): string {
  const probe = document.createElement("span")
  probe.style.position = "absolute"
  probe.style.pointerEvents = "none"
  probe.style.opacity = "0"
  probe.style.backgroundColor = `var(--${token})`
  root.appendChild(probe)
  const color = getComputedStyle(probe).backgroundColor
  probe.remove()
  return color || "transparent"
}

function withAlpha(color: string, alpha: number): string {
  const rgb = toChartColor(color)
  const match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
  if (!match) return rgb
  return `rgba(${match[1]}, ${match[2]}, ${match[3]}, ${alpha})`
}

function buildLightweightChartTheme(root: HTMLElement): LightweightChartTheme {
  const background = toChartColor(resolveCssToken(root, "background"))
  const muted = toChartColor(resolveCssToken(root, "muted-foreground"))
  const border = toChartColor(resolveCssToken(root, "border"))
  const success = toChartColor(resolveCssToken(root, "success"))
  const destructive = toChartColor(resolveCssToken(root, "destructive"))
  const brand = toChartColor(resolveCssToken(root, "brand"))

  return {
    upColor: success,
    downColor: destructive,
    lineColor: brand,
    areaTopColor: withAlpha(brand, 0.35),
    areaBottomColor: withAlpha(brand, 0.04),
    volumeUpColor: withAlpha(success, 0.35),
    volumeDownColor: withAlpha(destructive, 0.35),
    chartOptions: {
      layout: {
        background: { type: ColorType.Solid, color: background },
        textColor: muted,
        attributionLogo: false,
      },
      grid: {
        vertLines: { color: withAlpha(border, 0.45) },
        horzLines: { color: withAlpha(border, 0.45) },
      },
      rightPriceScale: {
        borderColor: border,
      },
      timeScale: {
        borderColor: border,
        fixLeftEdge: true,
        fixRightEdge: true,
      },
      crosshair: {
        vertLine: {
          color: withAlpha(muted, 0.55),
          labelBackgroundColor: border,
        },
        horzLine: {
          color: withAlpha(muted, 0.55),
          labelBackgroundColor: border,
        },
      },
    },
  }
}

/** Convert market candles (ms timestamps) to Lightweight Charts UTCTimestamp bars. */
function candlesToBarData(candles: Candle[]) {
  return candles.map((candle) => ({
    time: Math.floor(candle.time / 1000) as UTCTimestamp,
    open: candle.open,
    high: candle.high,
    low: candle.low,
    close: candle.close,
  }))
}

function candlesToLineData(candles: Candle[]) {
  return candles.map((candle) => ({
    time: Math.floor(candle.time / 1000) as UTCTimestamp,
    value: candle.close,
  }))
}

function seriesToLineData(values: number[], baseTime = 1_700_000_000_000) {
  const step = 60_000
  return values.map((value, index) => ({
    time: Math.floor((baseTime + index * step) / 1000) as UTCTimestamp,
    value,
  }))
}

function candlesToVolumeData(
  candles: Candle[],
  theme: Pick<LightweightChartTheme, "volumeUpColor" | "volumeDownColor">,
) {
  return candles.map((candle) => ({
    time: Math.floor(candle.time / 1000) as UTCTimestamp,
    value: candle.volume,
    color:
      candle.close >= candle.open ? theme.volumeUpColor : theme.volumeDownColor,
  }))
}

export {
  buildLightweightChartTheme,
  candlesToBarData,
  candlesToLineData,
  candlesToVolumeData,
  seriesToLineData,
  withAlpha,
}
export type { LightweightChartTheme }

"use client"

import type { ComponentPropsWithoutRef } from "react"
import { useEffect, useId, useRef } from "react"
import {
  AreaSeries,
  CandlestickSeries,
  ColorType,
  CrosshairMode,
  HistogramSeries,
  LineSeries,
  createChart,
  type IChartApi,
  type ISeriesApi,
} from "lightweight-charts"

import {
  buildLightweightChartTheme,
  candlesToBarData,
  candlesToLineData,
  candlesToVolumeData,
  seriesToLineData,
} from "@/lib/chart-theme"
import { makeCandles, type Candle } from "@/lib/market"
import { cn } from "@/lib/utils"

type LightweightChartType = "candles" | "line" | "area"

type LightweightChartProps = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  data?: Candle[]
  /** Close-only series for line/area when `data` is omitted. */
  series?: number[]
  chartType?: LightweightChartType
  showVolume?: boolean
  /** Size to the parent box (Lightweight Charts `autoSize`). */
  fill?: boolean
  width?: number
  height?: number
  className?: string
  "aria-label"?: string
}

function applySeriesData(
  chartType: LightweightChartType,
  data: Candle[],
  series: number[] | undefined,
  showVolume: boolean,
  theme: ReturnType<typeof buildLightweightChartTheme>,
  mainSeries: ISeriesApi<"Candlestick" | "Line" | "Area"> | null,
  volumeSeries: ISeriesApi<"Histogram"> | null,
) {
  if (!mainSeries) return

  if (chartType === "candles") {
    mainSeries.setData(candlesToBarData(data))
    volumeSeries?.setData(showVolume ? candlesToVolumeData(data, theme) : [])
  } else {
    const lineData = data.length
      ? candlesToLineData(data)
      : seriesToLineData(series ?? [])
    mainSeries.setData(lineData)
  }
}

const LightweightChart = ({
  data = makeCandles(48, { seed: 7 }),
  series,
  chartType = "candles",
  showVolume = true,
  fill = false,
  width = 480,
  height = 280,
  className,
  "aria-label": ariaLabel = "Market chart",
  ...props
}: LightweightChartProps) => {
  const titleId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const mainSeriesRef = useRef<ISeriesApi<
    "Candlestick" | "Line" | "Area"
  > | null>(null)
  const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    let chart: IChartApi | null = null
    let cancelled = false

    const mountChart = () => {
      if (cancelled || !root || chartRef.current) return

      if (fill) {
        const { width: boxWidth, height: boxHeight } =
          root.getBoundingClientRect()
        if (boxWidth === 0 || boxHeight === 0) return
      }

      const theme = buildLightweightChartTheme(root)
      chart = createChart(root, {
        ...theme.chartOptions,
        width: fill ? undefined : width,
        height: fill ? undefined : height,
        autoSize: fill,
        crosshair: {
          ...theme.chartOptions.crosshair,
          mode: CrosshairMode.Normal,
        },
      })

      chartRef.current = chart

      if (chartType === "candles") {
        mainSeriesRef.current = chart.addSeries(CandlestickSeries, {
          upColor: theme.upColor,
          downColor: theme.downColor,
          borderVisible: false,
          wickUpColor: theme.upColor,
          wickDownColor: theme.downColor,
        })

        if (showVolume) {
          volumeSeriesRef.current = chart.addSeries(HistogramSeries, {
            priceFormat: { type: "volume" },
            priceScaleId: "",
          })
          chart.priceScale("").applyOptions({
            scaleMargins: { top: 0.82, bottom: 0 },
          })
        } else {
          volumeSeriesRef.current = null
        }
      } else if (chartType === "area") {
        volumeSeriesRef.current = null
        mainSeriesRef.current = chart.addSeries(AreaSeries, {
          lineColor: theme.lineColor,
          topColor: theme.areaTopColor,
          bottomColor: theme.areaBottomColor,
          lineWidth: 2,
        })
      } else {
        volumeSeriesRef.current = null
        mainSeriesRef.current = chart.addSeries(LineSeries, {
          color: theme.lineColor,
          lineWidth: 2,
        })
      }

      const themeAfterCreate = buildLightweightChartTheme(root)
      applySeriesData(
        chartType,
        data,
        series,
        showVolume,
        themeAfterCreate,
        mainSeriesRef.current,
        volumeSeriesRef.current,
      )
      chart.timeScale().fitContent()
    }

    mountChart()

    let resizeObserver: ResizeObserver | undefined
    if (fill && !chartRef.current) {
      resizeObserver = new ResizeObserver(() => {
        mountChart()
        if (chartRef.current) resizeObserver?.disconnect()
      })
      resizeObserver.observe(root)
    }

    return () => {
      cancelled = true
      resizeObserver?.disconnect()
      chart?.remove()
      chartRef.current = null
      mainSeriesRef.current = null
      volumeSeriesRef.current = null
    }
  }, [chartType, fill, height, showVolume, width])

  useEffect(() => {
    const root = rootRef.current
    const chart = chartRef.current
    const mainSeries = mainSeriesRef.current
    if (!root || !chart || !mainSeries) return

    const theme = buildLightweightChartTheme(root)
    chart.applyOptions(theme.chartOptions)

    if (chartType === "candles") {
      mainSeries.applyOptions({
        upColor: theme.upColor,
        downColor: theme.downColor,
        wickUpColor: theme.upColor,
        wickDownColor: theme.downColor,
      })
    } else if (chartType === "area") {
      mainSeries.applyOptions({
        lineColor: theme.lineColor,
        topColor: theme.areaTopColor,
        bottomColor: theme.areaBottomColor,
      })
    } else {
      mainSeries.applyOptions({ color: theme.lineColor })
    }

    applySeriesData(
      chartType,
      data,
      series,
      showVolume,
      theme,
      mainSeries,
      volumeSeriesRef.current,
    )
    chart.timeScale().fitContent()
  }, [chartType, data, series, showVolume])

  useEffect(() => {
    const root = rootRef.current
    const chart = chartRef.current
    if (!root || !chart) return

    const observer = new MutationObserver(() => {
      const theme = buildLightweightChartTheme(root)
      chart.applyOptions(theme.chartOptions)
      if (chartType === "candles" && mainSeriesRef.current) {
        mainSeriesRef.current.applyOptions({
          upColor: theme.upColor,
          downColor: theme.downColor,
          wickUpColor: theme.upColor,
          wickDownColor: theme.downColor,
        })
        volumeSeriesRef.current?.setData(
          showVolume ? candlesToVolumeData(data, theme) : [],
        )
      } else if (mainSeriesRef.current) {
        if (chartType === "area") {
          mainSeriesRef.current.applyOptions({
            lineColor: theme.lineColor,
            topColor: theme.areaTopColor,
            bottomColor: theme.areaBottomColor,
          })
        } else {
          mainSeriesRef.current.applyOptions({ color: theme.lineColor })
        }
      }
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style"],
    })

    return () => observer.disconnect()
  }, [chartType, data, showVolume])

  return (
    <div
      ref={rootRef}
      data-slot="lightweight-chart"
      role="img"
      aria-label={ariaLabel}
      aria-labelledby={titleId}
      className={cn(
        "relative min-w-0 overflow-hidden",
        fill ? "h-full min-h-60 w-full" : "w-full",
        !fill && "aspect-[12/7]",
        className,
      )}
      {...props}
    >
      <span id={titleId} className="sr-only">
        {ariaLabel}
      </span>
    </div>
  )
}

export { LightweightChart }
export type { LightweightChartProps, LightweightChartType }

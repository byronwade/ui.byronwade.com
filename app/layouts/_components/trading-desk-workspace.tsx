"use client"

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
} from "react"
import {
  Activity,
  BarChart3,
  Bell,
  Camera,
  Crosshair,
  Eye,
  Expand,
  LayoutList,
  Lock,
  Magnet,
  Minus as MinusIcon,
  Pause,
  PenLine as PenLineIcon,
  Play,
  Plus,
  Ruler,
  Save,
  Settings2,
  Square as SquareIcon,
  Type as TypeIcon,
  Trash2,
} from "lucide-react"

import { AlertCreateForm } from "@/components/alert-create-form"
import { ChartToolbar, type ChartType } from "@/components/chart-toolbar"
import { CompareSymbols } from "@/components/compare-symbols"
import { DrawingToolbar, type DrawingTool } from "@/components/drawing-toolbar"
import {
  DEFAULT_INDICATORS,
  IndicatorLegend,
  type ChartIndicator,
} from "@/components/indicator-legend"
import { MarketDepth } from "@/components/market-depth"
import { OrderEntry } from "@/components/order-entry"
import { ReplayControls, type ReplaySpeed } from "@/components/replay-controls"
import { SessionStatsBar } from "@/components/session-stats-bar"
import { SymbolSearch } from "@/components/symbol-search"
import { TimeAndSales } from "@/components/time-and-sales"
import { Watchlist } from "@/components/watchlist"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LightweightChart } from "@/components/ui/lightweight-chart"
import { Separator } from "@/components/ui/separator"
import { SegmentedControl } from "@/components/ui/segmented-control"
import { Sparkline } from "@/components/ui/sparkline"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  RelativeTime,
  RelativeTimeZone,
  RelativeTimeZoneDisplay,
  RelativeTimeZoneLabel,
} from "@/components/ui/relative-time"
import {
  formatPrice,
  makeCandles,
  makeOrderBook,
  makeQuote,
  makeQuotes,
  makeSeries,
  makeTimeAndSalesRows,
  type Candle,
  type Quote,
} from "@/lib/market"
import { cn } from "@/lib/utils"

const FULL_BARS = 72
const MIN_VISIBLE = 12
const REPLAY_MAX = FULL_BARS - 1

const WATCHLIST_SYMBOLS = [
  "AAPL",
  "MSFT",
  "NVDA",
  "TSLA",
  "GOOGL",
  "AMZN",
  "META",
  "NFLX",
] as const

const INTERVALS = [
  "1m",
  "5m",
  "15m",
  "30m",
  "45m",
  "1h",
  "2h",
  "3h",
  "4h",
  "6h",
  "12h",
  "D",
  "W",
] as const
const RANGES = ["1D", "5D", "1M", "3M", "6M", "YTD", "1Y", "5Y", "All"] as const

const REPLAY_SPEED_MS: Record<ReplaySpeed, number> = {
  "0.5x": 650,
  "1x": 380,
  "2x": 190,
  "4x": 95,
}

const RANGE_OPTIONS = RANGES.map((value) => ({ label: value, value }))

const TRADING_DRAWING_TOOLS: DrawingTool[] = [
  { id: "trendline", label: "Trend line", icon: Ruler },
  { id: "hline", label: "Horizontal line", icon: MinusIcon },
  { id: "rectangle", label: "Rectangle", icon: SquareIcon },
  { id: "fib", label: "Fibonacci", icon: BarChart3 },
  { id: "text", label: "Text note", icon: TypeIcon },
  { id: "brush", label: "Brush", icon: PenLineIcon },
]

const RIGHT_PANELS = [
  { id: "watchlist" as const, label: "Watchlist", icon: LayoutList },
  { id: "depth" as const, label: "Depth", icon: BarChart3 },
  { id: "tape" as const, label: "Time & sales", icon: Activity },
  { id: "indicators" as const, label: "Indicators", icon: Settings2 },
] as const

const RANGE_BAR_COUNTS: Record<string, number> = {
  "1D": 24,
  "5D": 32,
  "1M": 40,
  "3M": 48,
  "6M": 56,
  YTD: 52,
  "1Y": 64,
  "5Y": FULL_BARS,
  All: FULL_BARS,
}

type RightPanel = "watchlist" | "depth" | "tape" | "indicators" | null

function intervalSeed(interval: string): number {
  let hash = 0
  for (let i = 0; i < interval.length; i += 1) {
    hash += interval.charCodeAt(i)
  }
  return hash
}

function candlesForRange(candles: Candle[], range: string) {
  const count = RANGE_BAR_COUNTS[range] ?? FULL_BARS
  return candles.slice(-count)
}

function seedFromSymbol(symbol: string): number {
  let hash = 2166136261
  for (let i = 0; i < symbol.length; i += 1) {
    hash ^= symbol.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0 || 1
}

function quoteForSymbol(symbol: string): Quote {
  const quote = makeQuote({ seed: seedFromSymbol(symbol) })
  return { ...quote, symbol, name: `${symbol} Inc.` }
}

function clampReplay(value: number, max: number) {
  return Math.min(max, Math.max(MIN_VISIBLE - 1, value))
}

type TradingDeskWorkspaceProps = {
  fullPage?: boolean
  className?: string
}

function TradingDeskWorkspace({
  fullPage = false,
  className,
}: TradingDeskWorkspaceProps) {
  const watchlistItems = useMemo(
    () => WATCHLIST_SYMBOLS.map((symbol) => quoteForSymbol(symbol)),
    [],
  )
  const searchPool = useMemo(() => makeQuotes(12, { seed: 21 }), [])

  const [activeSymbol, setActiveSymbol] = useState("AAPL")
  const [interval, setInterval] = useState<string>("4h")
  const [chartType, setChartType] = useState<ChartType>("candles")
  const [range, setRange] = useState<string>("1D")
  const [indicators, setIndicators] =
    useState<ChartIndicator[]>(DEFAULT_INDICATORS)
  const [drawingTool, setDrawingTool] = useState("cursor")
  const [replayPosition, setReplayPosition] = useState(REPLAY_MAX)
  const [replayPlaying, setReplayPlaying] = useState(false)
  const [replaySpeed, setReplaySpeed] = useState<ReplaySpeed>("1x")
  const [rightPanel, setRightPanel] = useState<RightPanel>(null)
  const [currency, setCurrency] = useState("USDT")
  const [published, setPublished] = useState(false)
  const [symbolOpen, setSymbolOpen] = useState(false)
  const [alertOpen, setAlertOpen] = useState(false)
  const [tradeOpen, setTradeOpen] = useState(false)
  const [compareSymbols, setCompareSymbols] = useState(() =>
    WATCHLIST_SYMBOLS.slice(0, 3).map((symbol) => quoteForSymbol(symbol)),
  )

  const activeQuote = useMemo(
    () => quoteForSymbol(activeSymbol),
    [activeSymbol],
  )

  const candleSeries = useMemo(
    () =>
      makeCandles(FULL_BARS, {
        seed: seedFromSymbol(activeSymbol) + intervalSeed(interval),
      }),
    [activeSymbol, interval],
  )

  const rangedCandles = useMemo(
    () => candlesForRange(candleSeries, range),
    [candleSeries, range],
  )

  const replayMax = rangedCandles.length - 1

  const activeCandles = useMemo(
    () =>
      rangedCandles.slice(
        0,
        Math.min(replayPosition + 1, rangedCandles.length),
      ),
    [rangedCandles, replayPosition],
  )

  const lastCandle = activeCandles[activeCandles.length - 1]

  const orderBook = useMemo(
    () => makeOrderBook({ seed: seedFromSymbol(activeSymbol) }),
    [activeSymbol],
  )

  const timeAndSalesRows = useMemo(
    () => makeTimeAndSalesRows(14, { seed: seedFromSymbol(activeSymbol) + 7 }),
    [activeSymbol],
  )

  const visibleIndicators = indicators.filter((item) => item.visible)

  const bid = orderBook.bids[0]?.price ?? activeQuote.price - 0.02
  const ask = orderBook.asks[0]?.price ?? activeQuote.price + 0.02
  const spread = ask - bid

  useEffect(() => {
    setReplayPosition(replayMax)
    setReplayPlaying(false)
  }, [activeSymbol, interval, range, replayMax])

  useEffect(() => {
    if (!replayPlaying) return
    const timer = window.setInterval(() => {
      setReplayPosition((current) => {
        if (current >= replayMax) {
          setReplayPlaying(false)
          return current
        }
        return current + 1
      })
    }, REPLAY_SPEED_MS[replaySpeed])
    return () => window.clearInterval(timer)
  }, [replayPlaying, replaySpeed, replayMax])

  const togglePanel = (panel: Exclude<RightPanel, null>) => {
    setRightPanel((current) => (current === panel ? null : panel))
  }

  const renderRightPanel = () => {
    if (!rightPanel) return null

    switch (rightPanel) {
      case "watchlist":
        return (
          <Watchlist
            items={watchlistItems}
            selectedSymbol={activeSymbol}
            onSelect={(symbol) => setActiveSymbol(symbol)}
            dense
            columns={["price", "change"]}
          />
        )
      case "depth":
        return (
          <MarketDepth
            bids={orderBook.bids}
            asks={orderBook.asks}
            className="p-2"
          />
        )
      case "tape":
        return <TimeAndSales rows={timeAndSalesRows} density="compact" />
      case "indicators":
        return (
          <IndicatorLegend
            indicators={indicators}
            className="max-w-none rounded-none border-0"
            onToggleVisibility={(id, visible) =>
              setIndicators((current) =>
                current.map((item) =>
                  item.id === id ? { ...item, visible } : item,
                ),
              )
            }
            onRemove={(id) =>
              setIndicators((current) =>
                current.filter((item) => item.id !== id),
              )
            }
          />
        )
      default:
        return null
    }
  }

  const handleReplayPlay = useCallback(() => {
    setReplayPosition((current) => {
      if (current >= replayMax) return MIN_VISIBLE - 1
      return current
    })
    setReplayPlaying((current) => !current)
  }, [replayMax])

  return (
    <div
      data-slot="trading-desk"
      className={cn(
        "flex min-h-0 flex-col overflow-hidden bg-background text-foreground",
        fullPage
          ? "h-dvh"
          : "h-[min(720px,85vh)] w-full rounded-xl border border-border",
        className,
      )}
    >
      <header
        data-slot="trading-desk-header"
        className="shrink-0 border-b border-border bg-card/90 shadow-sm"
      >
        <ChartToolbar
          data-slot="trading-desk-topbar"
          symbol={activeSymbol}
          interval={interval}
          intervals={[...INTERVALS]}
          onIntervalChange={setInterval}
          chartType={chartType}
          onChartTypeChange={setChartType}
          onSymbolClick={() => setSymbolOpen(true)}
          onIndicatorsClick={() => togglePanel("indicators")}
          density="compact"
          className="h-auto flex-nowrap overflow-x-auto border-0 bg-transparent px-1.5 py-1 [&>*]:shrink-0 [&_[data-slot=chart-toolbar-intervals]]:flex-none"
          symbolAddon={
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="size-7"
              aria-label="Add symbol"
              onClick={() => setSymbolOpen(true)}
            >
              <Plus className="size-3.5" />
            </Button>
          }
          actions={
            <>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 gap-1.5 px-2 text-xs"
                onClick={() => setAlertOpen(true)}
              >
                <Bell className="size-3.5" />
                Alert
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className={cn(
                  "h-7 gap-1.5 px-2 text-xs",
                  replayPlaying && "bg-muted text-foreground",
                )}
                onClick={handleReplayPlay}
              >
                {replayPlaying ? (
                  <Pause className="size-3.5" />
                ) : (
                  <Play className="size-3.5" />
                )}
                Replay
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="size-7"
                aria-label="Save chart layout"
                onClick={() => setPublished((current) => !current)}
              >
                <Save className="size-3.5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="size-7"
                aria-label="Open watchlist snapshot"
                onClick={() => togglePanel("watchlist")}
              >
                <Camera className="size-3.5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="size-7"
                aria-label="Expand chart"
                onClick={() => setRightPanel(null)}
              >
                <Expand className="size-3.5" />
              </Button>
              <span className="flex-1" />
              <Badge variant="secondary" className="font-mono text-[10px]">
                {published ? "Published" : "Unnamed"}
              </Badge>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mr-1 h-7 text-xs"
                onClick={() => setTradeOpen(true)}
              >
                Trade
              </Button>
            </>
          }
        />
      </header>

      <div className="flex min-h-0 flex-1">
        <aside
          data-slot="trading-desk-left-rail"
          className="flex w-12 shrink-0 flex-col items-center border-r border-border bg-card"
        >
          <div className="flex h-10 w-full items-center justify-center border-b border-border">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="size-8 rounded-sm bg-muted text-foreground"
              aria-label="Crosshair"
              onClick={() => setDrawingTool("cursor")}
            >
              <Crosshair className="size-4" />
            </Button>
          </div>

          <DrawingToolbar
            tools={TRADING_DRAWING_TOOLS}
            orientation="vertical"
            activeTool={drawingTool}
            onToolChange={setDrawingTool}
            className="w-full flex-1 items-center gap-0 rounded-none border-0 bg-transparent px-1 py-2 [&_[data-slot=drawing-toolbar-item]]:size-9 [&_[data-slot=drawing-toolbar-item]]:rounded-sm [&_[data-slot=drawing-toolbar-item]]:border-0 [&_[data-slot=drawing-toolbar-item]]:p-0 [&_[data-state=on]]:bg-brand/10 [&_[data-state=on]]:text-brand"
          />

          <div className="flex w-full flex-col items-center gap-1 border-t border-border p-1">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="size-8 rounded-sm"
              aria-label="Magnet mode"
            >
              <Magnet className="size-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="size-8 rounded-sm"
              aria-label="Lock drawings"
            >
              <Lock className="size-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="size-8 rounded-sm"
              aria-label="Hide drawings"
            >
              <Eye className="size-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="size-8 rounded-sm text-muted-foreground hover:text-destructive"
              aria-label="Clear drawings"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </aside>

        <div className="dark flex min-w-0 flex-1 flex-col bg-background text-foreground">
          <div className="relative min-h-80 flex-1 bg-background">
            <div
              data-slot="trading-desk-chart-status"
              className="absolute left-2 right-2 top-2 z-10 flex flex-wrap items-start justify-between gap-2 text-[11px] text-muted-foreground"
            >
              <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 rounded-md border border-border bg-card/90 px-2 py-1 shadow-sm backdrop-blur-sm">
                {lastCandle ? (
                  <SessionStatsBar
                    candle={lastCandle}
                    symbol={activeSymbol}
                    className="min-w-fit shrink-0 gap-x-3 rounded-none border-0 bg-transparent px-0 py-0 text-[11px]"
                  />
                ) : null}
                <Separator
                  orientation="vertical"
                  className="hidden h-4 sm:block"
                />
                <Badge variant="secondary" className="font-mono text-[10px]">
                  SMART route
                </Badge>
                <span className="font-mono tabular-nums">
                  Spread {spread.toFixed(2)}
                </span>
                <span className="hidden font-mono tabular-nums sm:inline">
                  Bid {formatPrice(bid)}
                </span>
                <span className="hidden font-mono tabular-nums sm:inline">
                  Ask {formatPrice(ask)}
                </span>
                <span className="hidden font-mono tabular-nums md:inline">
                  Depth{" "}
                  {(orderBook.bids.length + orderBook.asks.length).toString()}{" "}
                  lvls
                </span>
              </div>

              <div className="flex items-center gap-2 rounded-md border border-border bg-card/90 p-1 shadow-sm backdrop-blur-sm">
                <SegmentedControl
                  value={currency}
                  onValueChange={setCurrency}
                  options={[
                    { label: "USDT", value: "USDT" },
                    { label: "USD", value: "USD" },
                    { label: "BTC", value: "BTC" },
                  ]}
                  className="rounded-sm border-0 bg-muted/40 p-0 [&_button]:h-6 [&_button]:rounded-sm [&_button]:px-2 [&_button]:font-mono [&_button]:text-[10px]"
                />
                <span className="flex items-center gap-1.5 px-1 font-mono text-foreground tabular-nums">
                  <span className="size-1.5 rounded-full bg-success" />
                  12ms
                </span>
              </div>
            </div>

            <div
              data-slot="trading-desk-oco"
              className="absolute left-2 top-36 z-10 flex flex-col overflow-hidden rounded-md border border-border bg-card/95 font-mono text-xs shadow-sm backdrop-blur-sm sm:top-14"
            >
              <Button
                type="button"
                variant="ghost"
                className="h-auto flex-col items-start rounded-none px-2.5 py-1 hover:bg-destructive/10"
              >
                <span className="text-[10px] uppercase tracking-wide text-destructive">
                  Sell
                </span>
                <span className="tabular-nums text-foreground">
                  {formatPrice(bid)}
                </span>
              </Button>
              <Separator />
              <Button
                type="button"
                variant="ghost"
                className="h-auto flex-col items-start rounded-none px-2.5 py-1 hover:bg-brand/10"
              >
                <span className="text-[10px] uppercase tracking-wide text-brand">
                  Buy
                </span>
                <span className="tabular-nums text-foreground">
                  {formatPrice(ask)}
                </span>
              </Button>
            </div>

            <CompareSymbols
              symbols={compareSymbols}
              activeSymbol={activeSymbol}
              onSelect={setActiveSymbol}
              onRemove={(symbol) =>
                setCompareSymbols((current) =>
                  current.filter((item) => item.symbol !== symbol),
                )
              }
              onAdd={() => setSymbolOpen(true)}
              className="absolute bottom-2 left-2 z-10 hidden max-w-[34rem] gap-1 rounded-md border-border bg-card/90 px-2 py-1 shadow-sm backdrop-blur-sm xl:flex [&_[data-slot=compare-symbols-add]]:h-6 [&_[data-slot=compare-symbols-add]]:px-2 [&_[data-slot=compare-symbols-add]]:text-[11px] [&_[data-slot=compare-symbols-chip]]:py-0.5 [&_[data-slot=compare-symbols-label]]:text-[11px]"
            />

            <div className="absolute inset-0 flex min-h-0 flex-col">
              <LightweightChart
                data={activeCandles}
                chartType={chartType}
                showVolume={chartType === "candles"}
                fill
                aria-label={`${activeSymbol} ${chartType} chart`}
              />
            </div>
          </div>

          {visibleIndicators.length > 0 ? (
            <div
              data-slot="trading-desk-indicator-panes"
              className="shrink-0 border-t border-border bg-background/80"
            >
              {visibleIndicators.slice(0, 2).map((indicator, index) => (
                <div
                  key={indicator.id}
                  className="border-b border-border/60 px-2 py-1 last:border-b-0"
                >
                  <div className="mb-0.5 flex items-center gap-2 text-[10px] text-muted-foreground">
                    <span
                      className={cn(
                        "size-1.5 rounded-full",
                        indicator.tone === "chart-2"
                          ? "bg-chart-2"
                          : indicator.tone === "chart-3"
                            ? "bg-chart-3"
                            : indicator.tone === "chart-4"
                              ? "bg-chart-4"
                              : "bg-chart-1",
                      )}
                    />
                    {indicator.name}
                  </div>
                  <Sparkline
                    data={makeSeries(48, {
                      seed: seedFromSymbol(activeSymbol) + index + 40,
                    })}
                    variant="line"
                    fill
                    className="h-12 opacity-90"
                    aria-label={`${indicator.name} pane`}
                  />
                </div>
              ))}
            </div>
          ) : null}

          <footer
            data-slot="trading-desk-footer"
            className="flex h-9 shrink-0 items-center gap-1 overflow-x-auto border-t border-border bg-card/80 px-1.5 text-xs [&>*]:shrink-0"
          >
            <SegmentedControl
              options={RANGE_OPTIONS}
              value={range}
              onValueChange={setRange}
              className="max-w-[min(100%,420px)] shrink-0 overflow-x-auto rounded-none border-0 bg-transparent p-0 [&_button]:h-7 [&_button]:rounded-sm [&_button]:px-2 [&_button]:font-mono [&_button]:text-[11px]"
            />

            <Separator orientation="vertical" className="h-4" />

            <ReplayControls
              variant="bar"
              showSlider={false}
              playing={replayPlaying}
              onPlayingChange={setReplayPlaying}
              position={replayPosition}
              duration={replayMax}
              speed={replaySpeed}
              onSpeedChange={setReplaySpeed}
              className="rounded-none border-0 bg-transparent px-0.5 py-0 [&_[data-slot=replay-controls-meta]]:font-mono [&_[data-slot=replay-controls-meta]]:text-[11px] [&_button]:rounded-sm"
              onStepBack={() => {
                setReplayPlaying(false)
                setReplayPosition((current) =>
                  clampReplay(current - 1, replayMax),
                )
              }}
              onStepForward={() => {
                setReplayPlaying(false)
                setReplayPosition((current) =>
                  clampReplay(current + 1, replayMax),
                )
              }}
            />

            <span className="flex-1" />

            <RelativeTime size="sm" className="inline-grid gap-0">
              <RelativeTimeZone
                zone="UTC"
                className="gap-1 font-mono tabular-nums"
              >
                <RelativeTimeZoneLabel className="h-auto px-1 py-0 text-[10px]">
                  UTC
                </RelativeTimeZoneLabel>
                <RelativeTimeZoneDisplay className="pl-0 text-muted-foreground" />
              </RelativeTimeZone>
            </RelativeTime>
          </footer>
        </div>

        <SidebarProvider
          contained
          className="h-full w-auto shrink-0"
          style={
            {
              "--sidebar-width": rightPanel ? "15rem" : "2.75rem",
              "--sidebar-width-icon": "2.75rem",
            } as CSSProperties
          }
        >
          <Sidebar
            side="right"
            collapsible="none"
            data-slot="trading-desk-sidebar"
            className="border-sidebar-border"
          >
            <div className="flex h-full min-h-0 flex-row-reverse">
              <SidebarFooter className="w-11 shrink-0 border-l border-sidebar-border p-1">
                <SidebarMenu className="items-center gap-0.5">
                  {RIGHT_PANELS.map(({ id, label, icon: Icon }) => (
                    <SidebarMenuItem key={id}>
                      <SidebarMenuButton
                        type="button"
                        size="sm"
                        tooltip={label}
                        isActive={rightPanel === id}
                        onClick={() => togglePanel(id)}
                        className="size-8 justify-center p-0"
                      >
                        <Icon />
                        <span className="sr-only">{label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarFooter>

              {rightPanel ? (
                <div
                  data-slot="trading-desk-panel"
                  data-panel={rightPanel}
                  className="flex min-w-0 flex-1 flex-col overflow-hidden"
                >
                  <SidebarHeader className="border-b border-sidebar-border px-3 py-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-xs font-medium capitalize text-sidebar-foreground">
                          {rightPanel}
                        </p>
                        <p className="font-mono text-[10px] text-sidebar-foreground/60">
                          {activeSymbol} {interval}
                        </p>
                      </div>
                      <Badge
                        variant="secondary"
                        className="font-mono text-[10px]"
                      >
                        live
                      </Badge>
                    </div>
                  </SidebarHeader>
                  <SidebarContent className="min-h-0 flex-1 overflow-auto p-0">
                    {renderRightPanel()}
                  </SidebarContent>
                </div>
              ) : null}
            </div>
          </Sidebar>
        </SidebarProvider>
      </div>

      <Dialog open={symbolOpen} onOpenChange={setSymbolOpen}>
        <DialogContent className="max-w-md gap-0 p-0">
          <DialogHeader className="border-b border-border px-4 py-3">
            <DialogTitle>Symbol search</DialogTitle>
          </DialogHeader>
          <SymbolSearch
            symbols={searchPool}
            onSelect={(symbol) => {
              setActiveSymbol(symbol)
              setCompareSymbols((current) => {
                if (current.some((item) => item.symbol === symbol))
                  return current
                if (current.length >= 5) return current
                return [...current, quoteForSymbol(symbol)]
              })
              setSymbolOpen(false)
            }}
            className="max-w-none rounded-none border-0"
          />
        </DialogContent>
      </Dialog>

      <AlertCreateForm
        symbol={activeSymbol}
        defaultTarget={activeQuote.price}
        open={alertOpen}
        onOpenChange={setAlertOpen}
        showTrigger={false}
      />

      <Dialog open={tradeOpen} onOpenChange={setTradeOpen}>
        <DialogContent className="max-w-sm gap-0 p-0">
          <DialogHeader className="border-b border-border px-4 py-3">
            <DialogTitle>Order ticket</DialogTitle>
          </DialogHeader>
          <OrderEntry
            symbol={activeSymbol}
            lastPrice={activeQuote.price}
            className="rounded-none border-0 p-4"
            onSubmit={() => setTradeOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export { TradingDeskWorkspace, seedFromSymbol, quoteForSymbol }
export type { TradingDeskWorkspaceProps }

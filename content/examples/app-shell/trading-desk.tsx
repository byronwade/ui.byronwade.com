import { AppShell } from "@/components/app-shell"
import { ChartPanel } from "@/components/chart-panel"
import { OrderEntry } from "@/components/order-entry"
import { PortfolioSummary } from "@/components/portfolio-summary"
import { QuoteHeader } from "@/components/quote-header"
import { SessionStatsBar } from "@/components/session-stats-bar"
import { TickerTape } from "@/components/ticker-tape"
import { Watchlist } from "@/components/watchlist"
import { makeCandles, makeQuote, makeQuotes, makeSeries } from "@/lib/market"

const quote = makeQuote({ seed: 8 })
const candle = makeCandles(1, { seed: 8 })[0]
const tape = makeQuotes(8, { seed: 3 })

export default function Example() {
  return (
    <div className="h-[640px] overflow-hidden rounded-xl border border-border">
      <AppShell
        variant="three-column"
        header={<TickerTape items={tape} speed="default" />}
        sidebar={<Watchlist className="h-full" />}
        panel={<OrderEntry symbol={quote.symbol} />}
        aside={<PortfolioSummary />}
        toolbar={<SessionStatsBar candle={candle} symbol={quote.symbol} />}
      >
        <div className="flex h-full min-h-0 flex-col gap-4 p-4">
          <QuoteHeader quote={quote} spark={makeSeries(36, { seed: 8 })} />
          <ChartPanel symbol={quote.symbol} className="min-h-0 flex-1" />
        </div>
      </AppShell>
    </div>
  )
}

"use client"

import type { ComponentPropsWithoutRef } from "react"
import { useState } from "react"

import { MetricStat } from "@/components/metric-stat"
import { QuoteHeader } from "@/components/quote-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { makeSymbolStats, type SymbolStatRow, type SymbolStats } from "@/lib/market"
import { cn } from "@/lib/utils"

const DEFAULT_STATS = makeSymbolStats({ seed: 12 })

type SymbolDetailsTab = "overview" | "financials" | "statistics"

type SymbolDetailsProps = Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  stats?: SymbolStats
  defaultTab?: SymbolDetailsTab
}

function StatGrid({ rows }: { rows: SymbolStatRow[] }) {
  return (
    <div
      data-slot="symbol-details-grid"
      className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      {rows.map((row) => (
        <MetricStat
          key={row.label}
          label={row.label}
          value={<span className="font-mono text-base">{row.value}</span>}
        />
      ))}
    </div>
  )
}

function SymbolDetails({
  stats = DEFAULT_STATS,
  defaultTab = "overview",
  className,
  ...props
}: SymbolDetailsProps) {
  const [tab, setTab] = useState<SymbolDetailsTab>(defaultTab)

  return (
    <div
      data-slot="symbol-details"
      className={cn("flex w-full flex-col gap-6", className)}
      {...props}
    >
      <QuoteHeader quote={stats.quote} size="default" />
      <div
        data-slot="symbol-details-meta"
        className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground"
      >
        <span>
          <span className="text-foreground">{stats.exchange}</span>
        </span>
        <span>{stats.sector}</span>
        <span>{stats.industry}</span>
      </div>
      <Tabs
        value={tab}
        onValueChange={(value) => setTab(value as SymbolDetailsTab)}
        data-slot="symbol-details-tabs"
      >
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="financials">Financials</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-4">
          <StatGrid rows={stats.overview} />
        </TabsContent>
        <TabsContent value="financials" className="mt-4">
          <StatGrid rows={stats.financials} />
        </TabsContent>
        <TabsContent value="statistics" className="mt-4">
          <StatGrid rows={stats.statistics} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export { SymbolDetails }
export type { SymbolDetailsProps, SymbolDetailsTab }

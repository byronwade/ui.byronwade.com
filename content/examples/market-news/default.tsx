"use client"

import { MarketNews } from "@/components/market-news"
import { DemoErrorState } from "@/app/(docs)/_components/demo-state-bits"
import { useDemoState } from "@/lib/demo-viewport"
import { makeNewsItems } from "@/lib/market"

const newsItems = makeNewsItems(6, { seed: 18 })

export default function Example() {
  const state = useDemoState() ?? "default"
  const isLoading = state === "loading"
  const isEmpty = state === "empty"
  const isError = state === "error"

  if (isError) {
    return (
      <div className="flex justify-center p-8">
        <div className="w-full max-w-2xl">
          <DemoErrorState>Couldn't load news</DemoErrorState>
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-center p-8">
      <MarketNews
        items={isEmpty ? [] : newsItems}
        loading={isLoading}
        empty="No market headlines available."
      />
    </div>
  )
}

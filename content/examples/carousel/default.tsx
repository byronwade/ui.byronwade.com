"use client"

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DemoEmptyState,
  DemoErrorState,
} from "@/app/(docs)/_components/demo-state-bits"
import { useDemoState } from "@/lib/demo-viewport"

const slides = [
  { id: 1, label: "1" },
  { id: 2, label: "2" },
  { id: 3, label: "3" },
  { id: 4, label: "4" },
  { id: 5, label: "5" },
]

function CarouselSkeleton() {
  return (
    <div className="mx-auto w-full max-w-xs">
      <Skeleton className="aspect-square w-full rounded-xl" />
    </div>
  )
}

export default function Example() {
  const state = useDemoState() ?? "default"
  const isLoading = state === "loading"
  const isEmpty = state === "empty"
  const isError = state === "error"

  if (isLoading) {
    return <CarouselSkeleton />
  }

  if (isEmpty) {
    return (
      <div className="mx-auto flex w-full max-w-xs flex-col justify-center">
        <DemoEmptyState>No items</DemoEmptyState>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="mx-auto flex w-full max-w-xs flex-col justify-center">
        <DemoErrorState>Couldn't load items</DemoErrorState>
      </div>
    )
  }

  return (
    <Carousel className="mx-auto w-full max-w-xs">
      <CarouselContent>
        {slides.map((slide) => (
          <CarouselItem key={slide.id}>
            <Card>
              <CardContent className="flex aspect-square items-center justify-center p-6">
                <span className="text-4xl font-medium">{slide.label}</span>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}

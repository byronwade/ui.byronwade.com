"use client"

import { useState } from "react"
import { Rating, RatingButton, RatingBadge } from "@/components/ui/rating"

export default function Example() {
  const [value, setValue] = useState(3)
  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <Rating value={value} onValueChange={setValue}>
        {Array.from({ length: 5 }).map((_, i) => (
          <RatingButton key={i} />
        ))}
      </Rating>
      <div className="flex items-center gap-3">
        <RatingBadge value={4.8} count={1240} />
        <RatingBadge value={3.5} max={5} />
        <Rating value={4} readOnly>
          {Array.from({ length: 5 }).map((_, i) => (
            <RatingButton key={i} size={14} />
          ))}
        </Rating>
      </div>
    </div>
  )
}

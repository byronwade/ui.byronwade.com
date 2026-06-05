import { Rating, RatingButton, RatingBadge } from "@/components/ui/rating"

export default function Example() {
  return (
    <div className="flex flex-col items-center gap-4 p-8">
      {/* Read-only averages render an exact partial fill. */}
      <Rating allowHalf value={3.7} readOnly>
        {Array.from({ length: 5 }).map((_, i) => (
          <RatingButton key={i} />
        ))}
      </Rating>
      <RatingBadge value={3.7} count={2048} />
    </div>
  )
}

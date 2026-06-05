import { Rating, RatingButton } from "@/components/ui/rating"

export default function Example() {
  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <Rating value={4} readOnly>
        {Array.from({ length: 5 }).map((_, i) => (
          <RatingButton key={i} />
        ))}
      </Rating>
    </div>
  )
}

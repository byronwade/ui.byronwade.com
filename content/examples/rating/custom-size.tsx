import { Rating, RatingButton } from "@/components/ui/rating"

export default function Example() {
  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <Rating value={3} readOnly>
        {Array.from({ length: 5 }).map((_, i) => (
          <RatingButton key={i} size={28} />
        ))}
      </Rating>
    </div>
  )
}

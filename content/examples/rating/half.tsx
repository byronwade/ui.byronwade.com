import { Rating, RatingButton } from "@/components/ui/rating"

export default function Example() {
  return (
    <div className="flex flex-col items-center gap-4 p-8">
      {/* Uncontrolled + allowHalf: click a star's left/right half, or arrow-key
          by 0.5. The component manages its own value. */}
      <Rating allowHalf defaultValue={3.5}>
        {Array.from({ length: 5 }).map((_, i) => (
          <RatingButton key={i} size={28} />
        ))}
      </Rating>
    </div>
  )
}

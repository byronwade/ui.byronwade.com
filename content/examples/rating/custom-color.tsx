import { Rating, RatingButton } from "@/components/ui/rating"

export default function Example() {
  return (
    <div className="flex flex-col items-center gap-4 p-8">
      {/* Tone follows whatever text-* token you set — here the warning token. */}
      <Rating value={4} readOnly className="text-warning">
        {Array.from({ length: 5 }).map((_, i) => (
          <RatingButton key={i} />
        ))}
      </Rating>
    </div>
  )
}

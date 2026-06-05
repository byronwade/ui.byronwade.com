import { Rating, RatingButton } from "@/components/ui/rating"
import { Button } from "@/components/ui/button"

export default function Example() {
  return (
    <form className="flex flex-col items-center gap-4 p-8">
      {/* `name` renders a hidden input, so the score posts with the form. */}
      <Rating name="score" defaultValue={4}>
        {Array.from({ length: 5 }).map((_, i) => (
          <RatingButton key={i} />
        ))}
      </Rating>
      <Button type="submit" size="sm">
        Submit rating
      </Button>
    </form>
  )
}

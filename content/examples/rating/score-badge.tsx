import { RatingBadge } from "@/components/ui/rating"

export default function Example() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 p-8">
      <RatingBadge value={4.8} count={1240} />
      <RatingBadge value={3.5} max={5} />
      <RatingBadge value={5} />
    </div>
  )
}

import { AlbumCover } from "@/components/ui/album-cover"

const COVER =
  "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80"

export default function Example() {
  return (
    <div className="flex flex-wrap items-end gap-6 p-8">
      {/* Idle vs. active, the playing cover shows the equalizer overlay. */}
      <AlbumCover src={COVER} alt="Idle mix" size="lg" />
      <AlbumCover src={COVER} alt="Now playing" size="lg" playing />
    </div>
  )
}

import { AlbumCover } from "@/components/ui/album-cover"

const COVER =
  "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80"

export default function Example() {
  return (
    <div className="grid grid-cols-2 gap-6 p-8">
      <AlbumCover
        src={COVER}
        alt="Midnight Sessions"
        size="lg"
        onPlay={() => {}}
      />
      <AlbumCover
        src={COVER}
        alt="Now Playing Mix"
        size="lg"
        playing
        onPlay={() => {}}
      />
      <AlbumCover src={COVER} alt="Daily Drive" size="lg" rounded="lg" shadow />
      <AlbumCover src={COVER} alt="Focus" size="lg" rounded="full" />
    </div>
  )
}

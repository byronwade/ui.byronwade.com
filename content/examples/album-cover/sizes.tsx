import { AlbumCover } from "@/components/ui/album-cover"

const COVER =
  "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80"

export default function Example() {
  return (
    <div className="flex flex-wrap items-end gap-6 p-8">
      <AlbumCover src={COVER} alt="Small" size="sm" />
      <AlbumCover src={COVER} alt="Medium" size="md" />
      <AlbumCover src={COVER} alt="Large" size="lg" />
      <AlbumCover src={COVER} alt="Extra large" size="xl" />
    </div>
  )
}

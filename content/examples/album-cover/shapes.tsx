import { AlbumCover } from "@/components/ui/album-cover"

const COVER =
  "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80"

export default function Example() {
  return (
    <div className="flex flex-wrap items-end gap-6 p-8">
      <AlbumCover src={COVER} alt="Rounded md" size="md" rounded="md" />
      <AlbumCover src={COVER} alt="Rounded lg" size="md" rounded="lg" />
      <AlbumCover src={COVER} alt="Circular" size="md" rounded="full" />
      <AlbumCover src={COVER} alt="Elevated" size="md" rounded="lg" shadow />
    </div>
  )
}

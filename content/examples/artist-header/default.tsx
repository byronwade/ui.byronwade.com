import { ArtistHeader } from "@/components/artist-header"

const IMAGE =
  "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80"

export default function Example() {
  return (
    <div className="w-full max-w-2xl p-8">
      <ArtistHeader
        name="Aurora Skies"
        image={IMAGE}
        verified
        monthlyListeners={2841093}
        onPlay={() => {}}
        onFollowToggle={() => {}}
      />
    </div>
  )
}

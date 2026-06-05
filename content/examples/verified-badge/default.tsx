import { VerifiedBadge } from "@/components/ui/verified-badge"

export default function Example() {
  return (
    <div className="flex w-72 flex-col gap-4 p-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Lo-Fi Channel</span>
        <VerifiedBadge size="sm" />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-base font-medium">Lo-Fi Channel</span>
        <VerifiedBadge size="md" />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Aurora</span>
        <VerifiedBadge size="sm" variant="artist" title="Verified artist" />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-base font-medium">Aurora</span>
        <VerifiedBadge size="md" variant="artist" title="Verified artist" />
      </div>
    </div>
  )
}

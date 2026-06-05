import {
  RelativeTime,
  RelativeTimeZone,
  RelativeTimeZoneDisplay,
  RelativeTimeZoneLabel,
} from "@/components/ui/relative-time"

const sizes = ["sm", "default", "lg"] as const

export default function Example() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-6 p-6">
      {sizes.map((size) => (
        <RelativeTime key={size} size={size}>
          <RelativeTimeZone zone="America/New_York">
            <RelativeTimeZoneLabel>NYC</RelativeTimeZoneLabel>
            <RelativeTimeZoneDisplay />
          </RelativeTimeZone>
        </RelativeTime>
      ))}
    </div>
  )
}

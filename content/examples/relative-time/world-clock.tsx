import {
  RelativeTime,
  RelativeTimeZone,
  RelativeTimeZoneDate,
  RelativeTimeZoneDisplay,
  RelativeTimeZoneLabel,
} from "@/components/ui/relative-time"

const zones = [
  { zone: "America/Los_Angeles", label: "SFO" },
  { zone: "America/New_York", label: "NYC" },
  { zone: "Europe/London", label: "LON" },
  { zone: "Asia/Tokyo", label: "TYO" },
]

export default function Example() {
  return (
    <div className="w-full max-w-sm p-6">
      {/* 24-hour time + a short date line per zone. */}
      <RelativeTime
        timeFormatOptions={{
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }}
        dateFormatOptions={{ month: "short", day: "numeric", weekday: "short" }}
      >
        {zones.map(({ zone, label }) => (
          <RelativeTimeZone key={zone} zone={zone}>
            <RelativeTimeZoneLabel>{label}</RelativeTimeZoneLabel>
            <RelativeTimeZoneDisplay />
            <RelativeTimeZoneDate className="text-xs text-muted-foreground" />
          </RelativeTimeZone>
        ))}
      </RelativeTime>
    </div>
  )
}

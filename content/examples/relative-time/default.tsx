import {
  RelativeTime,
  RelativeTimeZone,
  RelativeTimeZoneDisplay,
  RelativeTimeZoneLabel,
} from "@/components/ui/relative-time";

export default function Example() {
  return (
    <div className="w-full max-w-xs p-6">
      <RelativeTime>
        {["America/New_York", "Europe/London", "Asia/Tokyo"].map((zone) => (
          <RelativeTimeZone key={zone} zone={zone}>
            <RelativeTimeZoneLabel>{zone.split("/")[1]}</RelativeTimeZoneLabel>
            <RelativeTimeZoneDisplay />
          </RelativeTimeZone>
        ))}
      </RelativeTime>
    </div>
  );
}

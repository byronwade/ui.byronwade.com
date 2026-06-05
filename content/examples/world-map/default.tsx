import { WorldMap } from "@/components/ui/world-map"

export default function Example() {
  return (
    <div className="w-full p-6">
      <WorldMap
        dots={[
          {
            start: { lat: 37.7749, lng: -122.4194, label: "San Francisco" },
            end: { lat: 51.5074, lng: -0.1278, label: "London" },
          },
          {
            start: { lat: 51.5074, lng: -0.1278, label: "London" },
            end: { lat: 35.6762, lng: 139.6503, label: "Tokyo" },
          },
          {
            start: { lat: 37.7749, lng: -122.4194, label: "San Francisco" },
            end: { lat: -33.8688, lng: 151.2093, label: "Sydney" },
          },
        ]}
      />
    </div>
  )
}

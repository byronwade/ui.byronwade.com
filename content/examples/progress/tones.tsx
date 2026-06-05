import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress"

const rows: { tone: "default" | "brand" | "success" | "warning" | "destructive"; label: string; value: number }[] = [
  { tone: "default", label: "Default", value: 40 },
  { tone: "brand", label: "Brand", value: 60 },
  { tone: "success", label: "Complete", value: 100 },
  { tone: "warning", label: "Storage", value: 82 },
  { tone: "destructive", label: "Over limit", value: 96 },
]

// The indicator color is token-driven via `tone` — green/amber/red track
// state without leaving the design system.
export default function Example() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-5 p-6">
      {rows.map((row) => (
        <Progress key={row.tone} value={row.value} tone={row.tone}>
          <ProgressLabel>{row.label}</ProgressLabel>
          <ProgressValue />
        </Progress>
      ))}
    </div>
  )
}

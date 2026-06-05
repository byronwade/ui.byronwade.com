import { VerificationProgress } from "@/components/verification-progress"

export default function Example() {
  return (
    <div className="max-w-xl">
      <VerificationProgress
        steps={[
          { tone: "success", label: "Success", count: 1 },
          { tone: "warning", label: "Warning", count: 2 },
          { tone: "danger", label: "Danger", count: 3 },
          { tone: "info", label: "Info", count: 4 },
          { tone: "neutral", label: "Neutral", count: 5 },
        ]}
      />
    </div>
  )
}

import { VerificationProgress } from "@/components/verification-progress"

export default function Example() {
  return (
    <div className="max-w-xs">
      <VerificationProgress
        steps={[
          {
            tone: "success",
            label: "Submitted",
            description: "Application sent",
          },
          { tone: "neutral", label: "Under review" },
        ]}
      />
    </div>
  )
}

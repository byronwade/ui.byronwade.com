import { VerificationProgress } from "@/components/verification-progress"

export default function Example() {
  return (
    <div className="max-w-2xl">
      <VerificationProgress
        steps={[
          { tone: "success", label: "Account", count: 1 },
          { tone: "success", label: "Profile", count: 2 },
          { tone: "success", label: "Identity", count: 3 },
          { tone: "warning", label: "Payment", count: 4 },
          { tone: "info", label: "Review", count: 5 },
          { tone: "neutral", label: "Live", count: 6 },
        ]}
      />
    </div>
  )
}

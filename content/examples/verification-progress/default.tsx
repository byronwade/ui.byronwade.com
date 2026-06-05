"use client"

import { VerificationProgress } from "@/components/verification-progress"

export default function Example() {
  return (
    <VerificationProgress
      steps={[
        { tone: "success", label: "Profile", description: "Complete" },
        { tone: "warning", label: "Documents", count: 2 },
        { tone: "neutral", label: "Review" },
      ]}
    />
  )
}

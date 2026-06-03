import { VerificationProgress } from "@/components/verification-progress";

export default function Example() {
  return (
    <div className="max-w-md">
      <VerificationProgress
        steps={[
          { tone: "success", label: "Verified", count: 55 },
          { tone: "warning", label: "Action needed", count: 12 },
          { tone: "neutral", label: "Pending", count: 8 },
        ]}
      />
    </div>
  );
}

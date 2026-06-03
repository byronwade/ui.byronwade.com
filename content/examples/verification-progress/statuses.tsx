import { VerificationProgress } from "@/components/verification-progress";

export default function Example() {
  return (
    <div className="max-w-xl">
      <VerificationProgress
        steps={[
          {
            tone: "success",
            label: "Brand registered",
            description: "Approved by carrier",
          },
          {
            tone: "success",
            label: "Number verified",
            description: "Caller ID confirmed",
          },
          {
            tone: "warning",
            label: "SMS pending",
            description: "Awaiting review",
          },
          {
            tone: "neutral",
            label: "A2P 10DLC",
            description: "Not started",
          },
        ]}
      />
    </div>
  );
}

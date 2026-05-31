import { Alert, AlertTitle, AlertDescription, AlertAction } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"

export default function Example() {
  return (
    <div className="flex flex-col gap-4 p-6 max-w-lg">
      <Alert>
        <InfoIcon />
        <AlertTitle>Heads up</AlertTitle>
        <AlertDescription>
          Your free trial ends in 3 days. Upgrade to keep access to all features.
        </AlertDescription>
      </Alert>

      <Alert variant="destructive">
        <AlertTitle>Payment failed</AlertTitle>
        <AlertDescription>
          We could not process your card. Please update your billing details.
        </AlertDescription>
        <AlertAction>
          <button className="text-xs underline">Update</button>
        </AlertAction>
      </Alert>
    </div>
  )
}

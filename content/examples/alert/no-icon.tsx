import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

export default function Example() {
  return (
    <div className="flex flex-col gap-4 p-6 max-w-lg">
      {/* Title only, no icon, no description */}
      <Alert>
        <AlertTitle>Maintenance window tonight from 11 PM – 1 AM UTC.</AlertTitle>
      </Alert>

      {/* Title + description, no icon */}
      <Alert>
        <AlertTitle>Your plan renews on June 30</AlertTitle>
        <AlertDescription>
          Review your usage and adjust your plan before the billing date to avoid unexpected charges.
        </AlertDescription>
      </Alert>

      {/* Destructive, no icon */}
      <Alert variant="destructive">
        <AlertTitle>Account suspended</AlertTitle>
        <AlertDescription>
          Your account has been suspended due to a policy violation. Contact support to appeal.
        </AlertDescription>
      </Alert>

      {/* Description only, no title, no icon */}
      <Alert>
        <AlertDescription>
          A new privacy policy is in effect as of May 1. By continuing you agree to the updated terms.
        </AlertDescription>
      </Alert>
    </div>
  )
}

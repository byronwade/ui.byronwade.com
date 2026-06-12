import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, Info, Warning, XCircle } from "@/lib/icons"

export default function Example() {
  return (
    <div className="flex max-w-lg flex-col gap-4 p-6">
      <Alert variant="default">
        <Info />
        <AlertTitle>Default</AlertTitle>
        <AlertDescription>
          Neutral, informational messages on the card surface.
        </AlertDescription>
      </Alert>

      <Alert variant="success">
        <CheckCircle />
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>
          Your changes have been saved successfully.
        </AlertDescription>
      </Alert>

      <Alert variant="warning">
        <Warning />
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>
          Storage is almost full. Free up space to avoid disruptions.
        </AlertDescription>
      </Alert>

      <Alert variant="destructive">
        <XCircle />
        <AlertTitle>Destructive</AlertTitle>
        <AlertDescription>
          Something went wrong. This action cannot be undone.
        </AlertDescription>
      </Alert>
    </div>
  )
}

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import {
  CheckCircle2Icon,
  InfoIcon,
  TriangleAlertIcon,
  XCircleIcon,
} from "lucide-react"

export default function Example() {
  return (
    <div className="flex max-w-lg flex-col gap-4 p-6">
      <Alert variant="default">
        <InfoIcon />
        <AlertTitle>Default</AlertTitle>
        <AlertDescription>
          Neutral, informational messages on the card surface.
        </AlertDescription>
      </Alert>

      <Alert variant="success">
        <CheckCircle2Icon />
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>
          Your changes have been saved successfully.
        </AlertDescription>
      </Alert>

      <Alert variant="warning">
        <TriangleAlertIcon />
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>
          Storage is almost full. Free up space to avoid disruptions.
        </AlertDescription>
      </Alert>

      <Alert variant="destructive">
        <XCircleIcon />
        <AlertTitle>Destructive</AlertTitle>
        <AlertDescription>
          Something went wrong. This action cannot be undone.
        </AlertDescription>
      </Alert>
    </div>
  )
}

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2Icon, InfoIcon, TriangleAlertIcon, XCircleIcon } from "lucide-react"

export default function Example() {
  return (
    <div className="flex flex-col gap-4 p-6 max-w-lg">
      {/* default variant */}
      <Alert variant="default">
        <InfoIcon />
        <AlertTitle>Default</AlertTitle>
        <AlertDescription>
          This is the default alert style. Use it for neutral, informational messages.
        </AlertDescription>
      </Alert>

      {/* destructive variant */}
      <Alert variant="destructive">
        <XCircleIcon />
        <AlertTitle>Destructive</AlertTitle>
        <AlertDescription>
          Something went wrong. This action cannot be undone.
        </AlertDescription>
      </Alert>

      {/* success-like — default variant with a green icon (no built-in success variant) */}
      <Alert variant="default">
        <CheckCircle2Icon className="text-green-600 dark:text-green-400" />
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>
          Your changes have been saved successfully.
        </AlertDescription>
      </Alert>

      {/* warning-like — default variant with an amber icon */}
      <Alert variant="default">
        <TriangleAlertIcon className="text-amber-500" />
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>
          Storage is almost full. Free up space to avoid disruptions.
        </AlertDescription>
      </Alert>
    </div>
  )
}

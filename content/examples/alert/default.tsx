import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"

export default function Example() {
  return (
    <div className="flex flex-col gap-4 p-6 max-w-lg">
      <Alert>
        <InfoIcon />
        <AlertTitle>New update available</AlertTitle>
        <AlertDescription>
          Version 2.4.0 is ready to install. Restart the application to apply
          changes.
        </AlertDescription>
      </Alert>
    </div>
  )
}

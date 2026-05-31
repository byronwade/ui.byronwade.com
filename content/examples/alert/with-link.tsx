import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { BookOpenIcon, ExternalLinkIcon, InfoIcon } from "lucide-react"

export default function Example() {
  return (
    <div className="flex flex-col gap-4 p-6 max-w-lg">
      {/* Inline link in description — styled automatically by the component */}
      <Alert>
        <InfoIcon />
        <AlertTitle>Cookie preferences updated</AlertTitle>
        <AlertDescription>
          Your settings have been saved. Read our{" "}
          <a href="#">Privacy Policy</a> to learn how we use your data.
        </AlertDescription>
      </Alert>

      {/* Multiple inline links */}
      <Alert>
        <BookOpenIcon />
        <AlertTitle>Setup required</AlertTitle>
        <AlertDescription>
          Before you start, review the{" "}
          <a href="#">quick-start guide</a> and configure your{" "}
          <a href="#">environment variables</a>.
        </AlertDescription>
      </Alert>

      {/* Destructive with a link */}
      <Alert variant="destructive">
        <ExternalLinkIcon />
        <AlertTitle>Credentials expired</AlertTitle>
        <AlertDescription>
          Your access token has expired. <a href="#">Renew your credentials</a> to
          restore access.
        </AlertDescription>
      </Alert>
    </div>
  )
}

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import {
  BellIcon,
  CloudUploadIcon,
  KeyRoundIcon,
  LockIcon,
  MailIcon,
  ShieldCheckIcon,
} from "lucide-react"

export default function Example() {
  return (
    <div className="flex flex-col gap-4 p-6 max-w-lg">
      <Alert>
        <MailIcon />
        <AlertTitle>Verify your email</AlertTitle>
        <AlertDescription>
          We sent a confirmation link to <strong>user@example.com</strong>.
          Check your inbox.
        </AlertDescription>
      </Alert>

      <Alert>
        <BellIcon />
        <AlertTitle>Notifications paused</AlertTitle>
        <AlertDescription>
          You won&apos;t receive any alerts until you re-enable notifications in
          settings.
        </AlertDescription>
      </Alert>

      <Alert>
        <ShieldCheckIcon />
        <AlertTitle>Two-factor authentication enabled</AlertTitle>
        <AlertDescription>
          Your account is now protected by an additional verification step.
        </AlertDescription>
      </Alert>

      <Alert>
        <KeyRoundIcon />
        <AlertTitle>API key generated</AlertTitle>
        <AlertDescription>
          Copy and store your key now, it won&apos;t be shown again.
        </AlertDescription>
      </Alert>

      <Alert>
        <CloudUploadIcon />
        <AlertTitle>Backup in progress</AlertTitle>
        <AlertDescription>
          Your files are being uploaded. This may take a few minutes.
        </AlertDescription>
      </Alert>

      <Alert>
        <LockIcon />
        <AlertTitle>Session locked</AlertTitle>
        <AlertDescription>Re-enter your password to continue.</AlertDescription>
      </Alert>
    </div>
  )
}

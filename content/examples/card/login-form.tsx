import { ShieldWarning } from "@/lib/icons"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardPanel,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function Example() {
  return (
    <div className="flex min-h-[420px] items-center justify-center bg-background p-8">
      <Card className="w-full max-w-xs">
        <CardHeader className="border-b">
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>Enter email and password to login</CardDescription>
        </CardHeader>
        <CardPanel>
          <form className="flex w-full flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="login-email">Email</Label>
              <Input
                id="login-email"
                type="email"
                placeholder="Enter your email"
                className="w-full"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="login-password">Password</Label>
              <Input
                id="login-password"
                type="password"
                placeholder="Enter your password"
                className="w-full"
              />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </CardPanel>
        <CardFooter className="border-t">
          <div className="flex gap-1.5 text-xs text-muted-foreground">
            <ShieldWarning className="size-3 h-lh shrink-0" />
            <p>The information you enter is encrypted and stored securely.</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

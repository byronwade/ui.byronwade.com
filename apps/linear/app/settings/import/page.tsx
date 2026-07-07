"use client"

import * as React from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { ChevronLeft, CheckCircle2 } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { SettingsShell } from "@/components/linear/settings-shell"

const STEPS = [
  "Select workspace",
  "Select teams",
  "Map users",
  "Confirm",
]

export default function ImportWizardPage() {
  const { setTheme } = useTheme()
  const [step] = React.useState(0)

  React.useEffect(() => {
    setTheme("light")
  }, [setTheme])

  return (
    <SettingsShell title="Linear to Linear import" activeId="import-export">
      <div className="space-y-6">
        <Button
          variant="ghost"
          size="sm"
          className="-ml-2 text-muted-foreground"
          render={<Link href="/settings" />}
        >
          <ChevronLeft className="size-4" />
          Exit
        </Button>

        <Card className="shadow-none">
          <CardHeader className="border-b border-border pb-6">
            <ol className="flex items-center gap-2">
              {STEPS.map((label, index) => (
                <li key={label} className="flex flex-1 flex-col items-center gap-2">
                  <span
                    className={`flex size-5 items-center justify-center rounded-full border ${
                      index < step
                        ? "border-primary bg-primary text-primary-foreground"
                        : index === step
                          ? "border-primary bg-background"
                          : "border-border bg-background"
                    }`}
                  >
                    {index < step ? (
                      <CheckCircle2 className="size-3.5" />
                    ) : index === step ? (
                      <span className="size-1.5 rounded-full bg-primary" />
                    ) : null}
                  </span>
                  <span className="hidden text-center text-[10px] text-muted-foreground sm:block">
                    {label}
                  </span>
                </li>
              ))}
            </ol>
          </CardHeader>

          <CardContent className="space-y-4 py-6">
            <CardTitle className="text-base font-medium">
              Select Linear workspace to import
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Choose the workspace you want to migrate data from.
            </p>

            <RadioGroup defaultValue="demo" className="gap-0 rounded-lg border border-border">
              <Label
                htmlFor="ws-demo"
                className="flex cursor-pointer items-center gap-3 border-b border-border px-4 py-3 last:border-b-0 hover:bg-muted/30"
              >
                <RadioGroupItem value="demo" id="ws-demo" />
                <Avatar className="size-6">
                  <AvatarFallback className="bg-foreground text-[10px] text-background">
                    SL
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">SL Mobbin</span>
              </Label>
            </RadioGroup>
          </CardContent>

          <CardFooter className="justify-between border-t border-border bg-muted/20">
            <Button variant="outline" render={<Link href="/settings" />}>
              Back
            </Button>
            <Button>Next</Button>
          </CardFooter>
        </Card>
      </div>
    </SettingsShell>
  )
}

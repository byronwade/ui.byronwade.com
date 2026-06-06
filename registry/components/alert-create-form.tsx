"use client"

import type { ComponentPropsWithoutRef, FormEvent } from "react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MoneyInput } from "@/components/ui/money-input"
import { SegmentedControl } from "@/components/ui/segmented-control"
import { Switch } from "@/components/ui/switch"
import { makeQuote, type Alert } from "@/lib/market"
import { cn } from "@/lib/utils"

const DEFAULT_QUOTE = makeQuote({ seed: 17 })

type AlertCreatePayload = Pick<Alert, "symbol" | "condition" | "target"> & {
  notify: boolean
}

type AlertCreateFormProps = Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  symbol?: string
  defaultTarget?: number
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onSubmit?: (alert: AlertCreatePayload) => void
}

function AlertCreateForm({
  symbol = DEFAULT_QUOTE.symbol,
  defaultTarget = DEFAULT_QUOTE.price,
  open: openProp,
  onOpenChange,
  onSubmit,
  className,
  ...props
}: AlertCreateFormProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [condition, setCondition] = useState<Alert["condition"]>("above")
  const [target, setTarget] = useState<number | null>(defaultTarget)
  const [notify, setNotify] = useState(true)

  const open = openProp ?? internalOpen
  const setOpen = onOpenChange ?? setInternalOpen

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    onSubmit?.({
      symbol,
      condition,
      target: target ?? defaultTarget,
      notify,
    })
    setOpen(false)
  }

  return (
    <div data-slot="alert-create-form" className={cn(className)} {...props}>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger render={<Button variant="outline" />}>Create alert</DialogTrigger>
        <DialogContent showCloseButton className="sm:max-w-md">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Create price alert</DialogTitle>
              <DialogDescription>
                Notify when {symbol} crosses your target price.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="alert-symbol">Symbol</Label>
                <Input
                  id="alert-symbol"
                  data-slot="alert-create-symbol"
                  value={symbol}
                  readOnly
                  className="font-mono"
                />
              </div>
              <div className="grid gap-2">
                <Label>Condition</Label>
                <SegmentedControl
                  data-slot="alert-create-condition"
                  options={[
                    { label: "Above", value: "above" },
                    { label: "Below", value: "below" },
                  ]}
                  value={condition}
                  onValueChange={(value) =>
                    setCondition(value as Alert["condition"])
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="alert-target">Target price</Label>
                <MoneyInput
                  id="alert-target"
                  data-slot="alert-create-target"
                  value={target}
                  onValueChange={setTarget}
                  currency="USD"
                />
              </div>
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="alert-notify">Push notification</Label>
                <Switch
                  id="alert-notify"
                  data-slot="alert-create-notify"
                  checked={notify}
                  onCheckedChange={setNotify}
                />
              </div>
            </div>
            <DialogFooter showCloseButton>
              <Button type="submit">Save alert</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export { AlertCreateForm }
export type { AlertCreateFormProps, AlertCreatePayload }

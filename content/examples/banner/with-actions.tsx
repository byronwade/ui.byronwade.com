"use client"

import { Banner } from "@/components/banner"
import { Button } from "@/components/ui/button"

export default function Example() {
  return (
    <Banner
      tone="warning"
      title="Your trial ends in 3 days"
      actions={
        <>
          <Button size="sm" onClick={() => console.log("upgrade")}>
            Choose a plan
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => console.log("remind")}
          >
            Remind me later
          </Button>
        </>
      }
    >
      Pick a plan now to keep your store online after the trial.
    </Banner>
  )
}

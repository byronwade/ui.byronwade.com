import * as React from "react"

import { isDemoMobile, useDemoViewport } from "@/lib/demo-viewport"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const demoViewport = useDemoViewport()
  const demoMobile = isDemoMobile(demoViewport)
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  if (demoMobile != null) return demoMobile
  return !!isMobile
}

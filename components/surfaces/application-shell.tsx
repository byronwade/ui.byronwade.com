/**
 * Canonical application whole — re-exports Workbench.
 * Do not maintain a twin shell; compose via `@/lib/design` proofs.
 */
import { Workbench, type WorkbenchProps } from "@/components/surfaces/workbench"

function ApplicationShell(props: WorkbenchProps) {
  return <Workbench withAgent={false} {...props} />
}

export { ApplicationShell }

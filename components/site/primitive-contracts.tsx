import Link from "next/link"

import { primitiveContracts, primitiveIds } from "@/lib/design"
import { cn } from "@/lib/utils"

/**
 * Closed per-primitive contracts — DX surface for agents.
 * No twin kits; compose shadcn under these rules.
 */
function PrimitiveContractsPanel({ className }: { className?: string }) {
  return (
    <section
      data-slot="primitive-contracts"
      id="primitives"
      className={cn("space-y-4", className)}
    >
      <div>
        <p className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
          DX · closed atoms
        </p>
        <h2 className="mt-1 text-xl font-medium tracking-[-0.03em] md:text-2xl">
          Primitive contracts
        </h2>
        <p className="mt-2 max-w-prose text-sm text-muted-foreground">
          Required states + ARIA for shipped shadcn atoms. Prefer a rule over a
          new component — see{" "}
          <Link href="/system/dx" className="text-brand underline-offset-4 hover:underline">
            dx.md
          </Link>
          .
        </p>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2">
        {primitiveIds.map((id) => {
          const c = primitiveContracts[id]
          return (
            <li
              key={id}
              className="rounded-2xl bg-card p-4 edge"
              data-primitive={id}
            >
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="font-medium tracking-tight">{id}</h3>
                <code className="font-mono text-[10px] text-muted-foreground">
                  {c.dataSlot}
                </code>
              </div>
              <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                {c.path}
              </p>
              <p className="mt-3 font-mono text-[10px] tracking-[0.1em] text-muted-foreground uppercase">
                States
              </p>
              <p className="mt-1 text-[12px] tracking-tight">
                {c.states.join(" · ")}
              </p>
              <p className="mt-3 font-mono text-[10px] tracking-[0.1em] text-muted-foreground uppercase">
                Must
              </p>
              <ul className="mt-1 list-disc space-y-0.5 pl-4 text-[12px] text-muted-foreground">
                {c.must.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export { PrimitiveContractsPanel }

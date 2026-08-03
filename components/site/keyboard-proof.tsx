/**
 * Focus + keyboard parity proof — UX pillar (NN/g #3/#7, Fluent focus ≠ fill).
 */
"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { interactionClasses, radiusIntent } from "@/lib/design"
import { cn } from "@/lib/utils"

const checklist = [
  {
    id: "tab",
    label: "Tab reaches every control",
    hint: "Move focus with Tab / Shift+Tab",
  },
  {
    id: "ring",
    label: "Focus shows ring, not fill alone",
    hint: "focus-visible:ring-ring on Button + Input",
  },
  {
    id: "row",
    label: "Rows activate with Enter / Space",
    hint: "Select the demo row below by keyboard",
  },
  {
    id: "escape",
    label: "Escape clears the field",
    hint: "Type in the input, then press Escape",
  },
] as const

type CheckId = (typeof checklist)[number]["id"]

function KeyboardProof({ className }: { className?: string }) {
  const [done, setDone] = useState<Partial<Record<CheckId, boolean>>>({})
  const [selected, setSelected] = useState(false)
  const [value, setValue] = useState("")

  function mark(id: CheckId) {
    setDone((prev) => ({ ...prev, [id]: true }))
  }

  const complete = checklist.filter((c) => done[c.id]).length

  return (
    <div
      data-slot="keyboard-proof"
      className={cn(
        "space-y-4 rounded-2xl bg-card p-4 edge sm:p-5",
        className,
      )}
    >
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
            Keyboard parity
          </p>
          <h3 className="mt-1 text-base font-medium tracking-tight">
            Focus & shortcuts
          </h3>
        </div>
        <p className="font-mono text-[11px] text-muted-foreground">
          {complete}/{checklist.length}
        </p>
      </div>

      <ul className="space-y-1.5">
        {checklist.map((item) => (
          <li
            key={item.id}
            className={cn(
              "flex items-start gap-2 rounded-lg px-2.5 py-2 text-sm",
              done[item.id] ? "bg-brand/10" : "bg-muted/20",
            )}
          >
            <span
              className={cn(
                "mt-0.5 size-2 shrink-0 rounded-full",
                done[item.id] ? "bg-brand" : "bg-muted-foreground/40",
              )}
              aria-hidden
            />
            <div>
              <p className="font-medium tracking-tight">{item.label}</p>
              <p className="text-[12px] text-muted-foreground">{item.hint}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap items-center gap-2 border-t border-border pt-4">
        <Button
          type="button"
          size="sm"
          variant="outline"
          className={radiusIntent("control")}
          onFocus={() => {
            mark("tab")
            mark("ring")
          }}
        >
          Focus me
        </Button>
        <button
          type="button"
          data-state={selected ? "selected" : undefined}
          tabIndex={0}
          aria-selected={selected}
          onClick={() => {
            setSelected(true)
            mark("row")
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              setSelected(true)
              mark("row")
            }
          }}
          onFocus={() => mark("tab")}
          className={cn(
            interactionClasses.row,
            "h-8 rounded-lg px-3 text-[12px]",
            radiusIntent("control"),
            selected && "bg-brand/10",
          )}
        >
          Demo row · Enter / Space
        </button>
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => {
            mark("tab")
            mark("ring")
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setValue("")
              mark("escape")
            }
          }}
          placeholder="Type, then Escape"
          aria-label="Escape clears this field"
          className={cn(
            "h-8 max-w-[14rem] text-[12px]",
            radiusIntent("control"),
          )}
        />
      </div>
    </div>
  )
}

export { KeyboardProof }

import { House, ListTodo, Plus, User } from "@/lib/icons"
import { Surface } from "@/components/surfaces/surface"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { bg, designCn, depthIntent, radiusIntent } from "@/lib/design"
import { cn } from "@/lib/utils"

const items = [
  { id: "ISS-1842", title: "Brand wash on selected rows", meta: "2h" },
  { id: "ISS-1839", title: "Help drawer reading-ui", meta: "48m" },
  { id: "ISS-1831", title: "Activity timeline chips", meta: "—" },
]

function MobileFrame({ className }: { className?: string }) {
  return (
    <div
      className={designCn(
        "mx-auto w-full max-w-[22rem] p-2",
        radiusIntent("shell"),
        bg("dock"),
        depthIntent("overlay"),
        className,
      )}
    >
      <Surface
        id="mobile"
        className={designCn(
          "flex h-[32rem] flex-col overflow-hidden pt-[env(safe-area-inset-top,0.75rem)]",
          radiusIntent("panel"),
          bg("background"),
        )}
      >
        <header className="flex items-center justify-between px-4 py-3">
          <div>
            <p className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
              Issues
            </p>
            <p className="text-lg font-medium tracking-tight">Inbox</p>
          </div>
          <Badge variant="secondary" className="font-mono">
            3
          </Badge>
        </header>

        <ul className="min-h-0 flex-1 overflow-hidden px-2">
          {items.map((item, index) => (
            <li key={item.id}>
              {index > 0 ? <Separator /> : null}
              <button
                type="button"
                className={cn(
                  "flex h-(--row-h-touch) w-full items-center gap-3 px-3 text-left transition-colors hover:bg-muted/40 active:bg-brand/10",
                  radiusIntent("control"),
                )}
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate tracking-tight">{item.title}</p>
                  <p className="font-mono text-xs text-muted-foreground">
                    {item.id}
                  </p>
                </div>
                <span className="font-mono text-xs text-muted-foreground">
                  {item.meta}
                </span>
              </button>
            </li>
          ))}
        </ul>

        <div className="border-t border-border px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
          <nav className="grid grid-cols-4 gap-1">
            {(
              [
                [House, "Home", false],
                [ListTodo, "Issues", true],
                [Plus, "New", false],
                [User, "You", false],
              ] as const
            ).map(([Icon, label, active]) => (
              <Button
                key={label}
                variant="ghost"
                size="icon-touch"
                className={cn(
                  "mx-auto flex-col gap-0.5",
                  radiusIntent("control"),
                  active && "bg-brand/10 text-foreground",
                )}
                aria-label={label}
              >
                <Icon className="size-5" />
              </Button>
            ))}
          </nav>
          <p className="mt-1 text-center font-mono text-[10px] text-muted-foreground">
            mobile · touch 44
          </p>
        </div>
      </Surface>
    </div>
  )
}

export { MobileFrame }

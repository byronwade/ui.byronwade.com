import { Stage } from "@/components/cinematic/stage"
import { Workbench } from "@/components/surfaces/workbench"
import { proofs } from "@/lib/design"
import { designCn, typeClass } from "@/lib/design"

function WorkbenchSection() {
  const agent = proofs.workbench.agent

  return (
    <Stage
      id="workbench"
      tone="paper"
      className="px-5 py-20 md:px-8 md:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <div className="max-w-xl">
          <p className={designCn(typeClass("label"), "text-muted-foreground")}>
            Canonical whole
          </p>
          <h2
            className={designCn(
              typeClass("title"),
              "mt-3 text-3xl md:text-4xl",
            )}
          >
            Cinema laws applied to a product frame.
          </h2>
          <p className="mt-4 text-sm leading-relaxed tracking-tight text-muted-foreground md:text-base">
            Quiet chrome. Mono data. Selected{" "}
            <span className="font-mono text-foreground">
              {proofs.workbench.selected}
            </span>
            . Agent bound to{" "}
            <span className="font-mono text-foreground">
              {agent?.boundTo}
            </span>{" "}
            — typed recipe in{" "}
            <span className="font-mono text-foreground">lib/design</span>.
          </p>
        </div>

        <div className="mt-10 overscroll-none">
          <Workbench className="pointer-events-none" />
        </div>
      </div>
    </Stage>
  )
}

export { WorkbenchSection }

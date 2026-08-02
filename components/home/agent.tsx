import { Stage } from "@/components/cinematic/stage";
import { Reveal } from "@/components/cinematic/reveal";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const events = [
  {
    provenance: "user",
    label: "You",
    body: "Tighten the selected state on issue rows — brand wash, not a border.",
  },
  {
    provenance: "assistant",
    label: "Assistant",
    body: "Updating `IssueRow` selected styles to `bg-brand/10` and verifying contrast in both themes.",
  },
  {
    provenance: "tool",
    label: "edit · IssueRow.tsx",
    body: "Replaced border-brand selected treatment with brand/10 fill.",
    activity: "edit" as const,
  },
];

function Agent() {
  return (
    <Stage
      id="agent"
      tone="paper"
      className="flex flex-col justify-center px-5 py-24 md:px-8 md:py-32"
    >
      <div className="mx-auto grid w-full max-w-6xl gap-14 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-20">
        <Reveal>
          <p className="font-mono text-xs tracking-[0.18em] text-muted-foreground uppercase">
            Object-bound AI
          </p>
          <h2 className="mt-4 max-w-[14ch] text-3xl font-medium tracking-[-0.035em] text-foreground md:text-5xl">
            Agents attach to work — never float.
          </h2>
          <p className="reading-muted mt-5 max-w-md text-base leading-relaxed tracking-tight">
            Provenance on every Card. Activity badges encode thinking, search,
            read, edit.
          </p>
        </Reveal>

        <Reveal className="space-y-3">
          {events.map((event) => (
            <Card
              key={event.label + event.body}
              data-provenance={event.provenance}
              size="sm"
            >
              <CardHeader className="pb-0">
                <div className="flex items-center gap-2">
                  <CardTitle className="font-mono text-xs font-normal text-muted-foreground">
                    {event.label}
                  </CardTitle>
                  {"activity" in event && event.activity ? (
                    <Badge className="border-transparent bg-activity-edit font-mono text-[10px] text-foreground">
                      {event.activity}
                    </Badge>
                  ) : null}
                </div>
                <CardDescription className="sr-only">
                  {event.provenance}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed tracking-tight text-foreground">
                  {event.body}
                </p>
              </CardContent>
            </Card>
          ))}
        </Reveal>
      </div>
    </Stage>
  );
}

export { Agent };

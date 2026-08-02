import { Stage } from "@/components/cinematic/stage";
import { Reveal } from "@/components/cinematic/reveal";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const principles = [
  {
    source: "Polaris",
    take: "Soft elevation. Dense resource lists. Calm neutrals that survive an eight-hour admin shift.",
  },
  {
    source: "Vercel",
    take: "Typographic authority. Mono for data. Sparse craft that trusts negative space.",
  },
  {
    source: "Linear",
    take: "Row density. Selected states. Keyboard-first scanning without visual noise.",
  },
  {
    source: "Cursor",
    take: "Object-bound AI. Activity semantics. Panels that name what the agent is doing.",
  },
  {
    source: "OpenAI",
    take: "Conversational provenance. Approachable message rhythm without chatbot cliché.",
  },
  {
    source: "Cinema",
    take: "Full-bleed frames and theater stages — styled, not animated. shadcn underneath.",
  },
  {
    source: "Surfaces",
    take: "Application, Marketing, Mobile Native, Desktop Native — one kit, remapped density.",
  },
];

function Principles() {
  return (
    <Stage
      id="system"
      tone="paper"
      className="flex flex-col justify-center px-5 py-24 md:px-8 md:py-32"
    >
      <div className="mx-auto w-full max-w-6xl">
        <Reveal>
          <p className="font-mono text-xs tracking-[0.18em] text-muted-foreground uppercase">
            The merge
          </p>
          <h2 className="mt-4 max-w-[18ch] text-3xl font-medium tracking-[-0.035em] text-foreground md:text-5xl">
            Five systems. Plus cinema. On shadcn.
          </h2>
          <p className="reading-muted mt-5 max-w-xl text-base leading-relaxed tracking-tight">
            Operational craft staged like film — implemented with the shadcn
            component set as the foundation.
          </p>
        </Reveal>

        <Reveal className="mt-14">
          <Card className="py-0">
            <CardHeader className="border-b py-5">
              <CardTitle>Influences</CardTitle>
              <CardDescription>What we take — and compose</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ul>
                {principles.map((item, index) => (
                  <li key={item.source}>
                    {index > 0 ? <Separator /> : null}
                    <div className="grid gap-2 px-5 py-5 transition-colors hover:bg-muted/30 md:grid-cols-[8rem_1fr] md:gap-8 md:px-6">
                      <span className="font-mono text-xs tracking-tight text-brand">
                        {item.source}
                      </span>
                      <p className="text-sm leading-relaxed tracking-tight text-foreground md:text-base">
                        {item.take}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </Reveal>
      </div>
    </Stage>
  );
}

export { Principles };

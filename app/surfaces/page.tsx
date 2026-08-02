import type { Metadata } from "next";
import { ApplicationShell } from "@/components/surfaces/application-shell";
import { MarketingFrame } from "@/components/surfaces/marketing-frame";
import { MobileFrame } from "@/components/surfaces/mobile-frame";
import { DesktopFrame } from "@/components/surfaces/desktop-frame";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { surfaces } from "@/lib/surfaces";

export const metadata: Metadata = {
  title: "Surfaces",
  description:
    "Meridian across Web Application, Web Marketing, Mobile Native, and Desktop Native.",
};

const demos = {
  application: ApplicationShell,
  marketing: MarketingFrame,
  mobile: MobileFrame,
  desktop: DesktopFrame,
} as const;

export default function SurfacesPage() {
  return (
    <main className="px-5 pt-20 pb-24 md:px-8 md:pt-24 md:pb-32">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-xs tracking-[0.18em] text-muted-foreground uppercase">
          Surfaces
        </p>
        <h1 className="mt-4 max-w-[16ch] text-3xl font-medium tracking-[-0.035em] md:text-5xl">
          One system. Four lanes.
        </h1>
        <p className="reading-muted mt-5 max-w-2xl text-base leading-relaxed tracking-tight">
          Web Application, Web Marketing, Mobile Native, and Desktop Native share
          the same tokens, primitives, and laws — density and chrome change, the
          philosophy does not.
        </p>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {surfaces.map((surface) => (
            <a
              key={surface.id}
              href={`#${surface.id}`}
              className="rounded-2xl bg-card p-4 transition-colors edge hover:bg-muted/30"
            >
              <Badge variant="secondary" className="font-mono text-[10px]">
                {surface.platform}
              </Badge>
              <p className="mt-3 text-sm font-medium tracking-tight">
                {surface.label}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {surface.density}
              </p>
            </a>
          ))}
        </div>

        <Separator className="my-16" />

        <div className="space-y-20">
          {surfaces.map((surface) => {
            const Demo = demos[surface.id];
            return (
              <section
                key={surface.id}
                id={surface.id}
                className="scroll-mt-24"
              >
                <div className="mb-6 max-w-xl">
                  <Badge variant="outline" className="font-mono text-[10px]">
                    {surface.platform}
                  </Badge>
                  <h2 className="mt-3 text-2xl font-medium tracking-[-0.03em] md:text-3xl">
                    {surface.label}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {surface.summary}
                  </p>
                </div>
                <Demo />
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}

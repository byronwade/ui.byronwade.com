import { components } from "@/content/components";
import { examples } from "@/content/examples/registry";

// Component previews for the catalog gallery cards (scaled inside a lazy iframe).
// Mirrors app/preview/[slug] (archetypes/templates) but renders a component's
// DEFAULT example, centered in a fixed-aspect canvas. flex + justify-center
// centers fixed-size demos while full-bleed demos (w-full) still fill — and the
// card scales this whole canvas to fit, so nothing is top-anchored.
export const dynamicParams = false;

export function generateStaticParams() {
  return components.map((c) => ({ slug: c.slug }));
}

export default async function ComponentPreview({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const demos = examples[slug] ?? [];
  const demo = demos.find((d) => d.file.endsWith("/default.tsx")) ?? demos[0];
  const Component = demo?.Component;

  return (
    <div className="flex min-h-dvh items-center justify-center overflow-hidden bg-background p-6">
      {Component ? (
        <Component />
      ) : (
        <span className="font-mono text-sm text-muted-foreground">{slug}</span>
      )}
    </div>
  );
}

import { components } from "@/content/components";
import { examples } from "@/content/examples/registry";
import { PreviewFit } from "@/app/preview/components/[slug]/preview-fit";

// Component previews for the catalog gallery cards (scaled inside a lazy iframe).
// Mirrors app/preview/[slug] (archetypes/templates) but renders a component's
// DEFAULT example at the iframe's fixed canvas width; PreviewFit reports the
// content height so the card can scale tall components down to fit.
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
    <PreviewFit>
      {Component ? (
        <Component />
      ) : (
        <span className="font-mono text-sm text-muted-foreground">{slug}</span>
      )}
    </PreviewFit>
  );
}

import { readFileSync } from "node:fs";
import { join } from "node:path";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { bySlug, components } from "@/content/components";
import { examples } from "@/content/examples/registry";
import { ExampleTabs } from "@/app/(docs)/_components/example-tabs";
import { InstallCommand } from "@/app/(docs)/_components/install-command";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function generateStaticParams() {
  // `foundation` has a bespoke static route (./foundation/page.tsx) that takes
  // precedence; exclude it here so it isn't also prerendered by this template.
  return components.filter((c) => c.slug !== "foundation").map((c) => ({ slug: c.slug }));
}

/* Shared section label — the mono eyebrow used across the docs specimen pages. */
function Label({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
      {children}
    </h2>
  );
}

export default async function ComponentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = bySlug(slug);
  if (!doc) notFound();

  const demos = examples[slug] ?? [];
  const rendered = demos.map((d) => ({
    name: d.name,
    Component: d.Component,
    code: readFileSync(join(process.cwd(), "content/examples", d.file), "utf8").trimEnd(),
  }));

  const deps = [...(doc.registryDeps ?? []), ...(doc.npmDeps ?? [])];

  return (
    <article className="mx-auto max-w-4xl space-y-12">
      {/* ── Header — matches the specimen pages: mono eyebrow + regular name ── */}
      <header>
        <Link
          href="/docs#catalog"
          className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3" />
          Catalog
        </Link>
        <p className="mt-6 font-mono text-xs uppercase tracking-[0.2em] text-brand">
          {doc.category}
        </p>
        <h1 className="mt-3 text-[clamp(2rem,5vw,3rem)] font-normal tracking-tight text-foreground text-balance">
          {doc.name}
        </h1>
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted-foreground text-pretty">
          {doc.description}
        </p>
        {deps.length > 0 ? (
          <div className="mt-5 flex flex-wrap gap-2">
            {deps.map((d) => (
              <span
                key={d}
                className="rounded-full edge bg-card px-2.5 py-1 font-mono text-[11px] text-muted-foreground"
              >
                {d}
              </span>
            ))}
          </div>
        ) : null}
      </header>

      {rendered.length > 0 && (
        <section className="space-y-6">
          <Label>{rendered.length > 1 ? "Examples" : "Example"}</Label>
          <div className="space-y-8">
            {rendered.map(({ name, Component, code }) => (
              <ExampleTabs key={name} title={name} preview={<Component />} code={code} />
            ))}
          </div>
        </section>
      )}

      {doc.slug !== "foundation" && (
        <section className="space-y-3">
          <Label>Installation</Label>
          <InstallCommand slug={doc.slug} />
        </section>
      )}

      {doc.props && doc.props.length > 0 && (
        <section className="space-y-3">
          <Label>Props</Label>
          <div className="overflow-hidden rounded-xl edge">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="pl-4 text-muted-foreground">Prop</TableHead>
                  <TableHead className="text-muted-foreground">Type</TableHead>
                  <TableHead className="text-muted-foreground">Default</TableHead>
                  <TableHead className="pr-4 text-muted-foreground">Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {doc.props.map((p) => (
                  <TableRow key={p.name}>
                    <TableCell className="pl-4 font-mono text-xs">{p.name}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{p.type}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{p.default ?? "—"}</TableCell>
                    <TableCell className="pr-4 whitespace-normal text-muted-foreground">{p.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>
      )}

      {/* ── Footer nav ── */}
      <div className="flex flex-wrap gap-x-6 gap-y-3 border-t border-border pt-8 text-sm">
        <Link
          href="/docs#catalog"
          className="inline-flex items-center gap-1.5 text-brand underline-offset-4 hover:underline"
        >
          Browse all components
          <ArrowRight className="size-3.5" />
        </Link>
        <Link
          href="/docs/installation"
          className="inline-flex items-center gap-1.5 text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          Installation
        </Link>
      </div>
    </article>
  );
}

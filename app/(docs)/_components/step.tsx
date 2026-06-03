/** Numbered step used across the installation / AI setup guides. */
export function Step({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex gap-4">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-background font-mono text-sm font-medium text-foreground">
        {n}
      </span>
      <div className="min-w-0 flex-1 space-y-3">
        <h3 className="text-base font-semibold leading-snug tracking-tight">{title}</h3>
        {children}
      </div>
    </section>
  );
}

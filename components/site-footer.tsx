function SiteFooter() {
  return (
    <footer
      data-slot="site-footer"
      className="border-t border-border px-5 py-10 md:px-8"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-xs tracking-tight text-muted-foreground">
          Meridian · ui.byronwade.com
        </p>
        <p className="text-sm tracking-tight text-muted-foreground">
          Operational editorial for application UI.
        </p>
      </div>
    </footer>
  );
}

export { SiteFooter };

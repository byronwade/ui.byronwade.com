import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Templates — byronwade/ui",
  description:
    "Ready-to-ship starter screens — pricing, dashboard, and settings — composed entirely from the byronwade/ui design system.",
};

export default function TemplatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Shares the global floating chrome (launcher + breadcrumb + nav dock) from the
  // root layout — same shell as /layouts. `pt-16` clears the centered top dock; the
  // inspector gets a full-height flex shell so its preview iframe can fill the view.
  return (
    <div className="flex h-dvh flex-col bg-background text-foreground">
      <main className="min-h-0 flex-1 overflow-auto pt-16">{children}</main>
    </div>
  );
}

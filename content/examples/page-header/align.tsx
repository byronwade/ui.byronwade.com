import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";

export default function Example() {
  return (
    <div className="p-8 space-y-12">
      {/* Left-aligned (default) */}
      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
          align="start" (default)
        </p>
        <PageHeader
          title="Documents"
          description="Browse and manage your files."
        >
          <Button size="sm" variant="outline">Import</Button>
          <Button size="sm">Upload</Button>
        </PageHeader>
      </div>

      {/* Centered */}
      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
          align="center"
        </p>
        <PageHeader
          title="Get Started"
          description="Follow these steps to set up your workspace."
          align="center"
        >
          <Button size="sm" variant="outline">View Docs</Button>
          <Button size="sm">Continue</Button>
        </PageHeader>
      </div>
    </div>
  );
}

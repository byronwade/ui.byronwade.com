import { DetailHeader } from "@/components/detail-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

/**
 * Title-only header — no meta grid. Useful for pages where context is
 * already provided by a parent layout (e.g. a settings panel or modal title).
 */
export default function Example() {
  return (
    <div className="max-w-4xl space-y-8 p-8">
      {/* With badge + actions but no meta */}
      <DetailHeader
        title="API Keys"
        badge={<Badge variant="secondary">3 active</Badge>}
        actions={
          <Button size="sm">Create key</Button>
        }
      />

      {/* Minimal: title only */}
      <DetailHeader title="Audit Log" />

      {/* Title + actions, no badge, no meta */}
      <DetailHeader
        title="Webhooks"
        actions={
          <>
            <Button variant="outline" size="sm">Documentation</Button>
            <Button size="sm">Add endpoint</Button>
          </>
        }
      />
    </div>
  );
}

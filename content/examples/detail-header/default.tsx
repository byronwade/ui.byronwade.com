import { DetailHeader } from "@/components/detail-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Example() {
  return (
    <div className="max-w-4xl p-8">
      <DetailHeader
        title="my-project.acme.com"
        badge={<Badge variant="secondary">Active</Badge>}
        actions={
          <>
            <Button variant="outline" size="sm">Edit</Button>
            <Button size="sm">Deploy</Button>
          </>
        }
        meta={[
          { label: "Region", value: "us-east-1" },
          { label: "Created", value: "May 31, 2026" },
          { label: "Owner", value: "alice@acme.com" },
          { label: "Plan", value: "Pro" },
        ]}
      />
    </div>
  );
}

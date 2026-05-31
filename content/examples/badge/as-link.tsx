import { Badge } from "@/components/ui/badge";

export default function Example() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <p className="text-sm text-muted-foreground mb-1">
        Render as an anchor using the <code>render</code> prop.
      </p>

      {/* Polymorphic render as <a> */}
      <div className="flex flex-wrap gap-2">
        <Badge render={<a href="#" />}>Documentation</Badge>
        <Badge variant="secondary" render={<a href="#" />}>
          Changelog
        </Badge>
        <Badge variant="outline" render={<a href="#" />}>
          GitHub
        </Badge>
        <Badge variant="link" render={<a href="#" />}>
          View source
        </Badge>
      </div>

      {/* Inline prose usage */}
      <p className="text-sm">
        This feature is available in{" "}
        <Badge variant="success" render={<a href="#" />}>
          v2.4
        </Badge>{" "}
        and later. Check the{" "}
        <Badge variant="outline" render={<a href="#" />}>
          migration guide
        </Badge>{" "}
        for details.
      </p>
    </div>
  );
}

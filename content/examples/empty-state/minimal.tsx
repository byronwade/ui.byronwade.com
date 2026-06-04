import { EmptyState } from "@/components/empty-state";

export default function Example() {
  return (
    <div className="flex items-center justify-center min-h-0 bg-background p-8">
      <div className="w-full max-w-md">
        <EmptyState title="No results found" />
      </div>
    </div>
  );
}

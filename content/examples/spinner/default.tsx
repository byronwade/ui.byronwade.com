import { Spinner } from "@/components/ui/spinner"

export default function Example() {
  return (
    <div className="flex flex-wrap items-center gap-6 p-6">
      <Spinner size="sm" />
      <Spinner />
      <Spinner size="lg" />
      <Spinner className="text-brand" />
      <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
        <Spinner size="sm" />
        Loading…
      </span>
    </div>
  )
}

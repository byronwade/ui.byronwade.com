import { AppShell } from "@/components/app-shell"

/** Neutral skeleton block, stands in for a real component in the slot. */
function Box({ className }: { className?: string }) {
  return <div className={`rounded-md bg-muted ${className ?? ""}`} />
}

export default function Example() {
  return (
    <div className="h-[560px] overflow-hidden rounded-xl edge">
      <AppShell
        variant="dashboard"
        header={
          <>
            <Box className="size-7" />
            <Box className="h-5 w-28" />
            <div className="flex-1" />
            <Box className="h-7 w-40" />
            <Box className="h-7 w-7 rounded-full" />
            <Box className="size-8 rounded-full" />
          </>
        }
        sidebar={
          <div className="space-y-1.5 p-3">
            <Box className="mb-3 h-6 w-24" />
            {Array.from({ length: 7 }).map((_, i) => (
              <Box key={i} className="h-8 w-full" />
            ))}
          </div>
        }
        footer={<Box className="h-4 w-48" />}
      >
        <div className="space-y-6 p-6">
          <Box className="h-8 w-52" />
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Box key={i} className="h-24" />
            ))}
          </div>
          <Box className="h-64 w-full" />
        </div>
      </AppShell>
    </div>
  )
}

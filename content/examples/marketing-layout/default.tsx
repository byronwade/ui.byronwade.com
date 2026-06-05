import { MarketingLayout } from "@/components/marketing-layout"

/** Neutral skeleton block — stands in for a real component in the slot. */
function Box({ className }: { className?: string }) {
  return <div className={`rounded-md bg-muted ${className ?? ""}`} />
}

export default function Example() {
  return (
    <div className="h-[560px] overflow-auto rounded-xl border border-border">
      <MarketingLayout
        variant="landing"
        nav={
          <>
            <Box className="h-6 w-28" />
            <div className="hidden gap-2 md:flex">
              {Array.from({ length: 4 }).map((_, i) => (
                <Box key={i} className="h-6 w-16" />
              ))}
            </div>
            <Box className="h-8 w-24" />
          </>
        }
        hero={
          <div className="mx-auto max-w-2xl space-y-5">
            <Box className="mx-auto h-6 w-32" />
            <Box className="mx-auto h-12 w-full" />
            <Box className="mx-auto h-12 w-3/4" />
            <Box className="mx-auto h-5 w-2/3" />
            <div className="flex justify-center gap-3 pt-2">
              <Box className="h-10 w-32" />
              <Box className="h-10 w-32" />
            </div>
          </div>
        }
        footer={
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Box className="h-5 w-20" />
                <Box className="h-4 w-16" />
                <Box className="h-4 w-16" />
              </div>
            ))}
          </div>
        }
      >
        <div className="space-y-3 text-center">
          <Box className="mx-auto h-7 w-48" />
          <Box className="mx-auto h-4 w-72" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Box key={i} className="h-40" />
          ))}
        </div>
        <Box className="h-72 w-full" />
      </MarketingLayout>
    </div>
  )
}

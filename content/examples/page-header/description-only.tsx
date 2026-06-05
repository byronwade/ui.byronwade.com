import { PageHeader } from "@/components/page-header"

export default function Example() {
  return (
    <div className="p-8 space-y-12">
      {/* Title only — no description */}
      <PageHeader title="Dashboard" />

      {/* Title + description — no actions */}
      <PageHeader
        title="Analytics"
        description="Track engagement metrics and audience trends over time."
      />

      {/* Centered title only */}
      <PageHeader title="Welcome back" align="center" />

      {/* Centered title + description */}
      <PageHeader
        title="Verify your email"
        description="We sent a 6-digit code to the address on file. Check your inbox to continue."
        align="center"
      />
    </div>
  )
}

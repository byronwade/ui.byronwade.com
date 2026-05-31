import { StatusDot, type StatusTone } from "@/components/ui/status-dot";

const jobs = [
  { id: "job_001", name: "Data export", tone: "success" as StatusTone, status: "Complete", duration: "2m 14s" },
  { id: "job_002", name: "Image resize", tone: "info" as StatusTone, status: "Running", duration: "0m 48s" },
  { id: "job_003", name: "Report build", tone: "warning" as StatusTone, status: "Stalled", duration: "12m 03s" },
  { id: "job_004", name: "DB backup", tone: "danger" as StatusTone, status: "Failed", duration: "1m 09s" },
  { id: "job_005", name: "Cache warm", tone: "neutral" as StatusTone, status: "Queued", duration: "—" },
];

export default function Example() {
  return (
    <div className="w-full max-w-lg overflow-hidden rounded-2xl border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/40">
            <th className="px-4 py-2 text-left font-medium text-muted-foreground">Job</th>
            <th className="px-4 py-2 text-left font-medium text-muted-foreground">Status</th>
            <th className="px-4 py-2 text-right font-medium text-muted-foreground">Duration</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.id} className="border-b last:border-0">
              <td className="px-4 py-2.5 text-muted-foreground">{job.name}</td>
              <td className="px-4 py-2.5">
                <span className="flex items-center gap-1.5">
                  <StatusDot tone={job.tone} size="sm" />
                  {job.status}
                </span>
              </td>
              <td className="px-4 py-2.5 text-right tabular-nums text-muted-foreground">{job.duration}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, Info, Star, Warning, XCircle } from "@/lib/icons"

export default function Example() {
  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Icon at the start */}
      <div className="flex flex-wrap gap-2">
        <Badge variant="success">
          <CheckCircle data-icon="inline-start" />
          Verified
        </Badge>
        <Badge variant="warning">
          <Warning data-icon="inline-start" />
          Pending
        </Badge>
        <Badge variant="destructive">
          <XCircle data-icon="inline-start" />
          Failed
        </Badge>
        <Badge variant="secondary">
          <Info data-icon="inline-start" />
          Info
        </Badge>
      </div>

      {/* Icon at the end */}
      <div className="flex flex-wrap gap-2">
        <Badge variant="default">
          Featured
          <Star data-icon="inline-end" />
        </Badge>
        <Badge variant="outline">
          Scheduled
          <Clock data-icon="inline-end" />
        </Badge>
      </div>

      {/* Icon only */}
      <div className="flex flex-wrap gap-2">
        <Badge variant="success" className="px-1">
          <CheckCircle />
        </Badge>
        <Badge variant="destructive" className="px-1">
          <XCircle />
        </Badge>
        <Badge variant="warning" className="px-1">
          <Warning />
        </Badge>
      </div>
    </div>
  )
}

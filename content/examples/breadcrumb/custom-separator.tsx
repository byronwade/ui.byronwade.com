import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { LineSegment } from "@/lib/icons"

export default function Example() {
  return (
    <div className="flex flex-col gap-8 p-8">
      {/* Slash separator */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <LineSegment />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Blog</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <LineSegment />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>My First Post</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Dot separator */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <span className="text-xs">•</span>
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Settings</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <span className="text-xs">•</span>
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Profile</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Arrow separator */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <span className="text-muted-foreground">→</span>
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Library</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <span className="text-muted-foreground">→</span>
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Albums</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  )
}

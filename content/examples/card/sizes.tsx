import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"

export default function Example() {
  return (
    <div className="flex flex-col gap-6 p-8 bg-background items-start">
      {/* Default size */}
      <div className="flex flex-col gap-1">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
          size="default"
        </p>
        <Card className="w-72">
          <CardHeader>
            <CardTitle>Project Alpha</CardTitle>
            <CardDescription>Active, 3 contributors</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              A standard card with default sizing. Padding, gap, and font sizes
              are at their base values.
            </p>
          </CardContent>
          <CardFooter>
            <span className="text-xs text-muted-foreground">
              Updated 2 hours ago
            </span>
          </CardFooter>
        </Card>
      </div>

      {/* Small size */}
      <div className="flex flex-col gap-1">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
          size="sm"
        </p>
        <Card size="sm" className="w-72">
          <CardHeader>
            <CardTitle>Project Alpha</CardTitle>
            <CardDescription>Active, 3 contributors</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              A compact card with reduced padding and tighter spacing, ideal for
              dense list-style layouts.
            </p>
          </CardContent>
          <CardFooter>
            <span className="text-xs text-muted-foreground">
              Updated 2 hours ago
            </span>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { DotsThree, TrendDown, TrendUp } from "@/lib/icons"

export default function Example() {
  return (
    <div className="flex flex-wrap gap-6 p-8 bg-background items-start justify-center">
      {/* CardAction: text button */}
      <Card className="w-72">
        <CardHeader>
          <CardTitle>Revenue</CardTitle>
          <CardDescription>Last 30 days</CardDescription>
          <CardAction>
            <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              View report
            </button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold">$18,240</p>
          <span className="inline-flex items-center gap-1 mt-1 text-xs text-success font-medium">
            <TrendUp className="w-3 h-3" />
            +8.4%
          </span>
        </CardContent>
        <CardFooter>
          <span className="text-xs text-muted-foreground">
            vs. previous 30 days
          </span>
        </CardFooter>
      </Card>

      {/* CardAction: icon-only button, spans both title and description rows */}
      <Card className="w-72">
        <CardHeader>
          <CardTitle>Active Users</CardTitle>
          <CardDescription>This week</CardDescription>
          <CardAction>
            <button
              className="flex items-center justify-center w-7 h-7 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              aria-label="More options"
            >
              <DotsThree className="w-4 h-4" />
            </button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold">1,042</p>
          <span className="inline-flex items-center gap-1 mt-1 text-xs text-destructive font-medium">
            <TrendDown className="w-3 h-3" />
            -2.1%
          </span>
        </CardContent>
        <CardFooter>
          <span className="text-xs text-muted-foreground">vs. last week</span>
        </CardFooter>
      </Card>
    </div>
  )
}

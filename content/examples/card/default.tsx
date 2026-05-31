import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export default function Example() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-8">
      <Card className="w-80">
        <CardHeader>
          <CardTitle>Monthly Summary</CardTitle>
          <CardDescription>Overview for May 2026</CardDescription>
          <CardAction>
            <button className="text-sm text-muted-foreground hover:text-foreground">
              View all
            </button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">$4,820.00</p>
          <p className="text-sm text-muted-foreground mt-1">+12% from last month</p>
        </CardContent>
        <CardFooter>
          <span className="text-xs text-muted-foreground">Last updated: today</span>
        </CardFooter>
      </Card>
    </div>
  );
}

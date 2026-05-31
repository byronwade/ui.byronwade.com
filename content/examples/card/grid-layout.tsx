import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Users, ShoppingCart, Package, ArrowUpRight } from "lucide-react";

const metrics = [
  {
    icon: Users,
    title: "Total Users",
    description: "Registered accounts",
    value: "24,891",
    delta: "+5.2%",
    positive: true,
    updated: "Just now",
  },
  {
    icon: ShoppingCart,
    title: "Orders",
    description: "Placed this week",
    value: "1,340",
    delta: "+11.8%",
    positive: true,
    updated: "5 min ago",
  },
  {
    icon: Package,
    title: "In Transit",
    description: "Active shipments",
    value: "482",
    delta: "-3.1%",
    positive: false,
    updated: "1 hour ago",
  },
];

export default function Example() {
  return (
    <div className="p-8 bg-background">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl">
        {metrics.map(({ icon: Icon, title, description, value, delta, positive, updated }) => (
          <Card key={title} size="sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-muted text-muted-foreground">
                  <Icon className="w-4 h-4" />
                </span>
                <CardTitle>{title}</CardTitle>
              </div>
              <CardDescription>{description}</CardDescription>
              <CardAction>
                <button
                  className="flex items-center justify-center w-6 h-6 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                  aria-label={`View ${title} details`}
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </CardAction>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{value}</p>
              <span
                className={`text-xs font-medium mt-0.5 inline-block ${
                  positive ? "text-emerald-600" : "text-rose-600"
                }`}
              >
                {delta} vs last week
              </span>
            </CardContent>
            <CardFooter>
              <span className="text-xs text-muted-foreground">{updated}</span>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

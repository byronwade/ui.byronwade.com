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
    <div className="flex flex-wrap gap-6 p-8 bg-background items-start justify-center">
      {/* Image at the top — auto rounded top corners */}
      <Card className="w-72 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=300&fit=crop"
          alt="Mountain landscape"
          className="w-full h-40 object-cover"
        />
        <CardHeader>
          <CardTitle>Mountain Retreat</CardTitle>
          <CardDescription>Elevation 2,400 m · 3-night trip</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            A scenic alpine getaway with panoramic views, guided hikes, and
            stargazing each evening.
          </p>
        </CardContent>
        <CardFooter>
          <span className="text-xs font-medium text-foreground">
            $320 / night
          </span>
          <span className="ml-auto text-xs text-muted-foreground">
            Available June–Sept
          </span>
        </CardFooter>
      </Card>

      {/* Image at the top, small size */}
      <Card size="sm" className="w-64 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=600&h=240&fit=crop"
          alt="Forest lake"
          className="w-full h-32 object-cover"
        />
        <CardHeader>
          <CardTitle>Forest Lake</CardTitle>
          <CardDescription>Day trip · 12 km trail</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            A peaceful lakeside loop through old-growth forest.
          </p>
        </CardContent>
        <CardFooter>
          <span className="text-xs text-muted-foreground">Free entry</span>
        </CardFooter>
      </Card>
    </div>
  )
}

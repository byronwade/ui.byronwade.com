import { CircleAlertIcon } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardPanel,
  CardFrame,
  CardFrameFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Example() {
  return (
    <div className="flex min-h-[480px] items-center justify-center bg-background p-8">
      <CardFrame className="w-full max-w-xs">
        <Card>
          <CardHeader>
            <CardTitle>Create project</CardTitle>
            <CardDescription>Deploy your new project in one-click.</CardDescription>
          </CardHeader>
          <CardPanel>
            <form className="flex w-full flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="ff-name">Name</Label>
                <Input
                  id="ff-name"
                  type="text"
                  placeholder="Name of your project"
                  className="w-full"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="ff-framework">Framework</Label>
                <Select defaultValue="next">
                  <SelectTrigger id="ff-framework" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="next">Next.js</SelectItem>
                    <SelectItem value="vite">Vite</SelectItem>
                    <SelectItem value="remix">Remix</SelectItem>
                    <SelectItem value="astro">Astro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">
                Deploy
              </Button>
            </form>
          </CardPanel>
        </Card>
        <CardFrameFooter>
          <div className="flex gap-1.5 text-xs text-muted-foreground">
            <CircleAlertIcon className="size-3 h-lh shrink-0" />
            <p>This will take a few seconds to complete.</p>
          </div>
        </CardFrameFooter>
      </CardFrame>
    </div>
  );
}

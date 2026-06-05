import {
  Card,
  CardPanel,
  CardFrame,
  CardFrameHeader,
  CardFrameTitle,
  CardFrameDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function Example() {
  return (
    <div className="flex min-h-[480px] items-center justify-center bg-background p-8">
      <CardFrame className="w-full max-w-xs">
        <CardFrameHeader>
          <CardFrameTitle>Create project</CardFrameTitle>
          <CardFrameDescription>
            Deploy your new project in one-click.
          </CardFrameDescription>
        </CardFrameHeader>
        <Card>
          <CardPanel>
            <form className="flex w-full flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="fh-name">Name</Label>
                <Input
                  id="fh-name"
                  type="text"
                  placeholder="Name of your project"
                  className="w-full"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="fh-framework">Framework</Label>
                <Select defaultValue="next">
                  <SelectTrigger id="fh-framework" className="w-full">
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
      </CardFrame>
    </div>
  )
}

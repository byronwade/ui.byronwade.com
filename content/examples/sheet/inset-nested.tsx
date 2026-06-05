import {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetPanel,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

/**
 * Nested inset drawers on the right edge — view a record, then open a second
 * inset drawer to edit it. (Adapted from coss p-drawer-8.)
 */
export default function Example() {
  return (
    <div className="flex min-h-[320px] items-center justify-center p-8">
      <Sheet>
        <SheetTrigger render={<Button variant="outline" />}>
          Nested inset drawers
        </SheetTrigger>
        <SheetContent side="right" variant="inset">
          <SheetHeader>
            <SheetTitle>Manage team member</SheetTitle>
            <SheetDescription>
              View and manage a user in your team.
            </SheetDescription>
          </SheetHeader>
          <SheetPanel className="grid gap-4">
            <div className="grid gap-1">
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="text-sm font-medium">Bora Baloglu</p>
            </div>
            <div className="grid gap-1">
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="text-sm font-medium">bora@example.com</p>
            </div>
          </SheetPanel>
          <SheetFooter>
            <Sheet>
              <SheetTrigger render={<Button variant="outline" />}>
                Edit details
              </SheetTrigger>
              <SheetContent side="right" variant="inset">
                <SheetHeader>
                  <SheetTitle>Edit details</SheetTitle>
                  <SheetDescription>
                    Make changes to the member&apos;s information.
                  </SheetDescription>
                </SheetHeader>
                <SheetPanel className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="member-name">Name</Label>
                    <Input
                      id="member-name"
                      type="text"
                      defaultValue="Bora Baloglu"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="member-email">Email</Label>
                    <Input
                      id="member-email"
                      type="email"
                      defaultValue="bora@example.com"
                    />
                  </div>
                </SheetPanel>
                <SheetFooter className="flex-row justify-end">
                  <SheetClose render={<Button variant="ghost" />}>
                    Cancel
                  </SheetClose>
                  <Button type="submit">Save changes</Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}

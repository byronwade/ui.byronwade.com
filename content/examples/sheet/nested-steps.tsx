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
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

/**
 * Nested bottom drawers with a grab bar — a multi-step flow where each
 * "Continue" opens the next drawer. (Adapted from coss p-drawer-7.)
 */
export default function Example() {
  return (
    <div className="flex min-h-[320px] items-center justify-center p-8">
      <Sheet>
        <SheetTrigger render={<Button variant="outline" />}>
          Nested drawers
        </SheetTrigger>
        <SheetContent
          side="bottom"
          showBar
          showCloseButton={false}
          className="sm:mx-auto sm:max-w-md"
        >
          <SheetHeader className="items-center text-center">
            <SheetTitle>First step</SheetTitle>
            <SheetDescription>
              This is the first step. Tap the button below to continue to the
              next screen.
            </SheetDescription>
          </SheetHeader>
          <SheetFooter variant="bare" className="justify-center">
            <SheetClose render={<Button variant="ghost" />}>Cancel</SheetClose>
            <Sheet>
              <SheetTrigger render={<Button variant="outline" />}>
                Continue
              </SheetTrigger>
              <SheetContent
                side="bottom"
                showBar
                showCloseButton={false}
                className="sm:mx-auto sm:max-w-md"
              >
                <SheetHeader className="items-center text-center">
                  <SheetTitle>Second step</SheetTitle>
                  <SheetDescription>
                    You&apos;ve reached the second step. Tap the button below to
                    continue to the next screen.
                  </SheetDescription>
                </SheetHeader>
                <SheetPanel>
                  <div className="flex justify-center">
                    <div className="size-48 shrink-0 rounded-xl edge bg-muted" />
                  </div>
                </SheetPanel>
                <SheetFooter variant="bare" className="justify-center">
                  <SheetClose render={<Button variant="ghost" />}>
                    Back
                  </SheetClose>
                  <Sheet>
                    <SheetTrigger render={<Button variant="outline" />}>
                      Continue
                    </SheetTrigger>
                    <SheetContent
                      side="bottom"
                      showBar
                      showCloseButton={false}
                      className="sm:mx-auto sm:max-w-md"
                    >
                      <SheetHeader className="items-center text-center">
                        <SheetTitle>Third step</SheetTitle>
                        <SheetDescription>
                          You&apos;ve reached the final step. You can close this
                          drawer or go back.
                        </SheetDescription>
                      </SheetHeader>
                      <SheetPanel>
                        <div className="flex justify-center">
                          <div className="size-32 shrink-0 rounded-full edge bg-muted" />
                        </div>
                      </SheetPanel>
                    </SheetContent>
                  </Sheet>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}

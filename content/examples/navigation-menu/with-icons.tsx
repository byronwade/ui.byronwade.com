import { BookOpen, LifeBuoy, Newspaper, Rocket } from "lucide-react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

export default function Example() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-56 gap-1 p-2">
              <li>
                <NavigationMenuLink href="#">
                  <Rocket />
                  Getting started
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink href="#">
                  <BookOpen />
                  Documentation
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink href="#">
                  <Newspaper />
                  Blog
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink href="#">
                  <LifeBuoy />
                  Support
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

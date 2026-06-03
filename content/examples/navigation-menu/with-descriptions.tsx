import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const solutions = [
  {
    title: "Analytics",
    description: "Track usage, conversion, and retention in real time.",
  },
  {
    title: "Automation",
    description: "Trigger workflows from any event in your stack.",
  },
  {
    title: "Collaboration",
    description: "Share dashboards and reports across your team.",
  },
  {
    title: "Security",
    description: "SSO, audit logs, and granular access controls.",
  },
];

export default function Example() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Solutions</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[26rem] grid-cols-2 gap-1 p-2">
              {solutions.map((solution) => (
                <li key={solution.title}>
                  <NavigationMenuLink
                    href="#"
                    className="flex-col items-start gap-1"
                  >
                    <span className="text-sm font-medium leading-none">
                      {solution.title}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {solution.description}
                    </span>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

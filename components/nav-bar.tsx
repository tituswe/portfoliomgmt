import Link from "next/link";
import { ModeToggle } from "./mode-toggle";
import { NavigationMenu, NavigationMenuLink } from "./ui/navigation-menu";

export function NavBar() {
  return (
    <nav className="px-12 pt-8 pb-4 flex items-center">
      <div className="mr-auto flex items-center justify-between">
        <a className="text-2xl font-semibold pr-6 pb-2">MoneyStar</a>
        <NavigationMenu>
          <NavigationMenuLink asChild>
            <Link href="/">Dashboard</Link>
          </NavigationMenuLink>
        </NavigationMenu>
      </div>
      <ModeToggle />
    </nav>
  );
}

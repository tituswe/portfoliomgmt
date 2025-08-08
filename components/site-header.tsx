"use client";

import Image from "next/image";
import { ModeToggle } from "./mode-toggle";
import { useTheme } from "next-themes";

export function SiteHeader() {
  const { resolvedTheme } = useTheme();

  const isDarkMode = resolvedTheme === "dark";

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        {/* <SidebarTrigger className="-ml-1" /> */}
        {/* <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        /> */}
        <Image
          src={isDarkMode ? "/moneystar_dark.png" : "/moneystar_light.png"}
          alt="Logo"
          width={64}
          height={40}
          priority
        />
        <div className="ml-auto flex items-center gap-2">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}

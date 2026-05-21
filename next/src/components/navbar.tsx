"use client";

import { Menu } from "lucide-react";
import type { ReactNode } from "react";
import { useSidebar } from "./ui/sidebar";

export default function Navbar({
  children,
}: Readonly<{ children: ReactNode }>) {
  const { toggleSidebar } = useSidebar();

  return (
    <div className="h-dvh w-dvw flex flex-col">
      <header className="sticky top-0 z-50 w-full h-14 p-2 border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center">
        <button
          className="p-2 hover:bg-accent rounded transition-colors"
          type="button"
          onClick={toggleSidebar}
        >
          <Menu className="size-6" />
        </button>
      </header>
      {children}
    </div>
  );
}

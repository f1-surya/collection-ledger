"use client";

import {
  Cable,
  ChevronRight,
  History,
  Home,
  LandPlot,
  Package,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import useSwr from "swr";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { fetcher } from "@/lib/fetcher";

const links = [
  {
    name: "home",
    icon: Home,
    href: "/dashboard",
  },
  {
    name: "connections",
    icon: Cable,
    href: "/dashboard/connections",
  },
  {
    name: "paymentHistory",
    icon: History,
    href: "/dashboard/history",
  },
  {
    name: "packs",
    icon: Package,
    href: "/dashboard/packs",
  },
  {
    name: "areas",
    icon: LandPlot,
    href: "/dashboard/areas",
  },
  {
    name: "settings",
    icon: Settings,
    href: "/dashboard/settings",
  },
];

export function AppSidebar() {
  const { isLoading, data } = useSwr("/api/company", fetcher);
  const t = useTranslations("Appbar");
  const pathname = usePathname();
  const { toggleSidebar } = useSidebar();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="bg-card hover:bg-accent cursor-pointer transition-colors h-14 w-full rounded flex flex-row px-3 items-center justify-between">
          {isLoading ? (
            <Skeleton className="h-7 w-32 bg-primary/40" />
          ) : (
            <>
              <h2 className="text-lg font-bold">{data.name}</h2>
              <ChevronRight />
            </>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {links.map((link) => (
              <SidebarMenuItem key={link.href}>
                <SidebarMenuButton asChild isActive={pathname === link.href}>
                  <Link href={link.href} onNavigate={toggleSidebar}>
                    <link.icon /> <span>{t(link.name)}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton></SidebarMenuButton>
          </DropdownMenuTrigger>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

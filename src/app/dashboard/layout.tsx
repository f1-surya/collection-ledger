import { cookies } from "next/headers";
import type { ReactNode } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import Navbar from "@/components/navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getOrg } from "@/lib/get-org";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const [cookieJar] = await Promise.all([cookies(), getOrg()]);
  const defaultOpen = cookieJar.get("sidebar_state")?.value === "true";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <Navbar>{children}</Navbar>
    </SidebarProvider>
  );
}

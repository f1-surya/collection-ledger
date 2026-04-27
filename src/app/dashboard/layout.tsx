import { cookies } from "next/headers";
import type { ReactNode } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { Goto } from "@/components/goto";
import Navbar from "@/components/navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ensureOrgContext } from "@/lib/get-org";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const [cookieJar] = await Promise.all([cookies(), ensureOrgContext()]);
  const defaultOpen = cookieJar.get("sidebar_state")?.value === "true";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <Goto />
      <Navbar>{children}</Navbar>
    </SidebarProvider>
  );
}

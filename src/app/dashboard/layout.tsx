import type { ReactNode } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import Navbar from "@/components/navbar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <Navbar>{children}</Navbar>
    </SidebarProvider>
  );
}

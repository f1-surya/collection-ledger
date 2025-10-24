import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import Navbar from "@/components/navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const org = await auth.api.getFullOrganization({ headers: await headers() });
  if (!org) {
    redirect("/create-company");
  }

  const cookieJar = await cookies();
  const defaultOpen = cookieJar.get("sidebar_state")?.value === "true";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <Navbar>{children}</Navbar>
    </SidebarProvider>
  );
}

import React from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "@/components/app-sidebar";
import { requireAuth } from "@/module/utils/auth-utils";

interface DashboadLayoutProps {
  children: React.ReactNode;
}

async function DashboadLayout({ children }: DashboadLayoutProps) {
  await requireAuth();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default DashboadLayout;

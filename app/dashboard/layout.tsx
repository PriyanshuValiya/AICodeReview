import React from "react";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
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
        <header className="flex shrink-0 items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1 cursor-pointer hover:bg-white" />
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default DashboadLayout;

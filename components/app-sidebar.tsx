"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "@/lib/auth-client";

// UI Components
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Icons
import { Github, BookOpen, Settings, LogOut, Zap, Users } from "lucide-react";

// Other Imports
import Link from "next/link";
// Renamed the import to avoid conflict with the Logout icon
import LogoutButton from "@/module/auth/components/logout";

// Note: Removed unused 'path' and 'email' imports.

const navigationItems = [
  { title: "Dashboard", href: "/dashboard", icon: Zap }, // Using Zap for Dashboard
  { title: "Repositories", href: "/dashboard/repositories", icon: Github },
  { title: "Reviews", href: "/dashboard/reviews", icon: BookOpen },
  { title: "Subscriptions", href: "/dashboard/subscriptions", icon: BookOpen },
  { title: "Clients", href: "/dashboard/clients", icon: Users },
  { title: "Settings", href: "/dashboard/settings", icon: Settings },
];

function AppSidebar() {
  const pathname = usePathname();
  // Using useSession to check if the user is logged in
  const { data: session } = useSession();

  const isActive = (url: string) => {
    return pathname === url || pathname?.startsWith(url + "/dashboard");
  };

  // Render nothing until session data is available
  if (!session) {
    return null;
  }

  const user = session.user;

  // Prepare user data for display
  const userData = {
    name: user?.name || "User",
    email: user?.email || "",
    avatar: user?.image || "",
    // Robust way to get initials
    userIntials:
      user?.name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase() || "U",
  };

  return (
    // The Sidebar component likely wraps the entire structure and provides the default styling
    <Sidebar className="bg-gray-900 text-gray-300 border-r border-gray-800 h-full">
      {/* Sidebar Content (Scrollable Area) */}
      <SidebarContent>
        {/* Logo/Branding Link */}
        <div className="px-6 pt-6 pb-4">
          <Link
            href="/dashboard"
            className="flex items-center space-x-2 text-xl font-bold text-blue-400 hover:text-blue-300 transition-colors"
          >
            <Zap className="h-6 w-6" />
            <span>AI Reviewer</span>
          </Link>
        </div>

        <SidebarSeparator className="border-gray-800 mt-0" />

        {/* Navigation Menu */}
        <SidebarMenu className="p-2 space-y-1">
          {navigationItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link key={item.href} href={item.href} passHref legacyBehavior>
                <SidebarMenuItem
                  // Use Tailwind classes for the modern, blue-accented look
                  className={`
                    flex items-center px-4 py-2 rounded-lg transition-colors duration-200
                    ${
                      active
                        ? "bg-blue-600 text-white shadow-md hover:bg-blue-700"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }
                  `}
                >
                  <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
                  <span className="truncate">{item.title}</span>
                </SidebarMenuItem>
              </Link>
            );
          })}
        </SidebarMenu>

        <SidebarSeparator className="border-gray-800" />
      </SidebarContent>

      {/* User Profile Footer */}
      <SidebarFooter className="p-4 border-t border-gray-800">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              className="w-full flex items-center justify-between p-2 rounded-xl text-left 
              bg-gray-800 hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
            >
              <div className="flex items-center space-x-3 truncate">
                {/* Avatar */}
                <Avatar className="h-9 w-9 border-2 border-blue-500">
                  <AvatarImage src={userData.avatar} alt={userData.name} />
                  <AvatarFallback className="bg-blue-600 text-white text-sm font-semibold">
                    {userData.userIntials}
                  </AvatarFallback>
                </Avatar>

                {/* User Info */}
                <div className="truncate">
                  <p className="text-sm font-semibold text-white truncate">
                    {userData.name}
                  </p>
                </div>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-64 bg-white shadow-2xl rounded-lg p-1 border border-gray-100"
            align="start"
          >
            {/* Direct Link to Profile/Settings */}
            <Link href="/dashboard/settings" passHref>
              <DropdownMenuItem className="cursor-pointer text-gray-700 hover:bg-gray-50 hover:text-blue-600 p-2 rounded-md">
                <Settings className="h-4 w-4 mr-2" />
                <span>Account Settings</span>
              </DropdownMenuItem>
            </Link>

            <SidebarSeparator className="my-1 border-gray-200" />

            {/* Logout Action (Uses the imported component) */}
            <LogoutButton>
              <DropdownMenuItem className="cursor-pointer text-red-600 hover:bg-red-50 p-2 rounded-md">
                <LogOut className="h-4 w-4 mr-2" />
                <span>Log out</span>
              </DropdownMenuItem>
            </LogoutButton>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;

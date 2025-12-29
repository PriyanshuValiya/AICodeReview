"use client";

import { usePathname } from "next/navigation";
import { useSession } from "@/lib/auth-client";
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
import {
  Github,
  CreditCard,
  Settings,
  LogOut,
  LayoutDashboard,
  Users,
  ChevronDown,
  MessageSquareText,
  Crown,
  Rat,
} from "lucide-react";
import Link from "next/link";
import LogoutButton from "@/module/auth/components/logout";
import { useEffect, useState } from "react";
import { getDashboardStats } from "@/module/dashboard/actions";

const navigationItems = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Repositories", href: "/dashboard/repositories", icon: Github },
  { title: "Reviews", href: "/dashboard/reviews", icon: MessageSquareText },
  {
    title: "Subscriptions",
    href: "/dashboard/subscriptions",
    icon: CreditCard,
  },
  { title: "Clients", href: "/dashboard/clients", icon: Users },
  { title: "Settings", href: "/dashboard/settings", icon: Settings },
];

function AppSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [proUser, setProUser] = useState(false);

  useEffect(() => {
    const getSubscriptionTier = async () => {
      const subscriptionTier = await getDashboardStats();

      if (
        subscriptionTier?.subscriptionType?.subscriptionTier === "PRO" &&
        subscriptionTier?.subscriptionType?.subscriptionStatus === "ACTIVE"
      ) {
        setProUser(true);
      }
    };

    getSubscriptionTier();
  }, []);

  const isActive = (url: string) => {
    return (
      pathname === url || (pathname?.startsWith(url) && url !== "/dashboard")
    );
  };

  if (!session) {
    return null;
  }

  const user = session.user;

  const userData = {
    name: user?.name || "User",
    email: user?.email || "",
    avatar: user?.image || "",
    userIntials:
      user?.name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase() || "U",
  };

  return (
    <Sidebar className="h-full overflow-x-hidden transition-all duration-300">
      <SidebarContent>
        <div className="px-6 pt-6 pb-5">
          <Link
            href="/"
            className="flex justify-center space-x-2 text-3xl font-semibold"
          >
            <div className="flex items-center justify-center gap-x-3">
              <Rat className="h-14 w-14 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight mt-2">
                CodeRat
              </h1>
            </div>{" "}
          </Link>
        </div>
        <SidebarSeparator className="border-[#020304] mt-0" />

        <SidebarMenu className="p-3 space-y-1">
          {navigationItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link key={item.href} href={item.href} passHref legacyBehavior>
                <SidebarMenuItem
                  className={`
                group flex items-center px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium cursor-pointer
                ${
                  active
                    ? "bg-[#2563EB] text-white shadow-md hover:bg-[#012bff]"
                    : "text-gray-700 group hover:bg-[#e8e8e8]"
                }
              `}
                >
                  <item.icon
                    className={`w-5 h-5 mr-3 ${
                      active
                        ? "text-white"
                        : "text-gray-500 group-hover:text-black"
                    }`}
                  />
                  <span className="truncate">{item.title}</span>
                </SidebarMenuItem>
              </Link>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-5">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              className="w-full flex items-center justify-between rounded-xl text-left
              text-black transition-colors duration-200 cursor-pointer hover:bg-[#e8e8e8] hover:text-black"
            >
              <div className="flex items-center space-x-3 truncate">
                <Avatar className="h-9 w-9 border-black">
                  <AvatarImage src={userData.avatar} alt={userData.name} />
                  <AvatarFallback className="text-sm font-semibold">
                    {userData.userIntials}
                  </AvatarFallback>
                </Avatar>

                <div className="truncate hidden md:block">
                  <p className="text-sm font-semibold truncate leading-none">
                    {userData.name}
                  </p>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400 ml-2" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-64 bg-white shadow-2xl rounded-lg p-1 border border-gray-100"
            align="end"
          >
            <div className="px-3 py-2 text-sm text-gray-700 font-medium border-b border-gray-100 mb-1">
              <div className="flex gap-x-2 justify-between">
                <p>{userData.name}</p>
                <div>{proUser && <Crown className="text-yellow-600" />}</div>
              </div>
              <p className="text-xs text-gray-500 font-normal">
                {userData.email}
              </p>
            </div>

            <Link href="/dashboard/settings" passHref>
              <DropdownMenuItem className="cursor-pointer text-gray-700 hover:bg-blue-50 p-2 rounded-md">
                <Settings className="h-4 w-4 mr-2" />
                <span>Account Settings</span>
              </DropdownMenuItem>
            </Link>

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

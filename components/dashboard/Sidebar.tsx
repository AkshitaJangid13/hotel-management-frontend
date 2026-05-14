"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  DoorOpen,
  Layers,
  Tag,
  Settings,
  LogOut,
  Users,
  Calendar,
  DollarSign,
  ClipboardList,
  BarChart3,
  UserCog,
  Tractor,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Branch", href: "/dashboard/branch", icon: Tractor },
  { name: "Users", href: "/dashboard/user", icon: Users },
  { name: "Brand", href: "/dashboard/brand", icon: Tractor },
  { name: "Bookings", href: "/dashboard/bookings", icon: Calendar },
  { name: "Customers", href: "/dashboard/customer", icon: Users },
  { name: "Rooms", href: "/dashboard/rooms", icon: DoorOpen },
  { name: "Room Types", href: "/dashboard/room-types", icon: Layers },
  {
    name: "Room Type Amenities",
    href: "/dashboard/room-type-amenities",
    icon: Layers,
  },

  { name: "Amenities", href: "/dashboard/amenities", icon: Tag },
  { name: "Staff", href: "/dashboard/staff", icon: UserCog },
  {
    name: "Housekeeping",
    href: "/dashboard/housekeeping",
    icon: ClipboardList,
  },
  { name: "Billing", href: "/dashboard/billing", icon: DollarSign },
  // { name: "Reports", href: "/dashboard/reports", icon: BarChart3 },
  // { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col overflow-y-auto hide-scrollbar border-r border-gray-200 bg-white">
      <div className="flex h-16 items-center border-b border-gray-200 px-6">
        <h1 className="text-xl font-semibold text-gray-900">HMS</h1>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
              )}
            >
              <item.icon
                className={cn(
                  "mr-3 h-5 w-5 flex-shrink-0",
                  isActive
                    ? "text-gray-900"
                    : "text-gray-400 group-hover:text-gray-500",
                )}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* <div className="border-t p-4">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => signOut({ callbackUrl: "/auth/signin" })}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sign Out
        </Button>
      </div> */}
    </div>
  );
}
